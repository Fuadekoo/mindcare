"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import CustomTable from "@/components/custom-table";
import CustomAlert from "@/components/custom-alert";
import { Button } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import Select from "react-select";
import useAction from "@/hooks/useActions";
import { getStudents } from "@/actions/psycatrist/students";
import {
  changeAppointmentStatus,
  getAppointments,
  createAppointment,
  deleteAppointment,
  updateAppointment,
} from "@/actions/psycatrist/appointment";
import { getCasePerStudent } from "@/actions/psycatrist/case";
import { appointmentSchema } from "@/lib/zodSchema";

type ColumnDef = {
  key: string;
  label: string;
  renderCell?: (item: Record<string, string>) => React.ReactNode;
};

type AppointmentRow = {
  id: string;
  caseId: string;
  studentId?: string;
  student_wdt_ID?: string;
  student_name?: string;
  date: string;
  time: string;
  status: string;
  createdAt: string;
  [key: string]: string | undefined;
};

type CaseOption = { value: string; label: string };

function Page() {
  // Table state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [pendingStatusId, setPendingStatusId] = useState<string | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Modal & edit
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<AppointmentRow | null>(null);

  // Dynamic student & case selection
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [caseOptions, setCaseOptions] = useState<CaseOption[]>([]);
  const [isLoadingCases, setIsLoadingCases] = useState(false);

  // Data actions
  const [appointmentsResponse, refreshAppointments, isLoadingAppointments] =
    useAction(
      getAppointments,
      [true, () => {}],
      search,
      page,
      pageSize,
      startDate,
      endDate
    );

  const [studentsResponse, , isLoadingStudents] = useAction(getStudents, [
    true,
    () => {},
  ]);

  const [, createAction, isCreatingAppointment] = useAction(createAppointment, [
    ,
    (res) =>
      handleActionCompletion(
        res,
        "Appointment created successfully.",
        "Failed to create appointment."
      ),
  ]);

  const [, updateAction, isUpdatingAppointment] = useAction(updateAppointment, [
    ,
    (res) =>
      handleActionCompletion(
        res,
        "Appointment updated successfully.",
        "Failed to update appointment."
      ),
  ]);

  const [, deleteAction, isDeletingAppointment] = useAction(deleteAppointment, [
    ,
    (res) =>
      handleActionCompletion(
        res,
        "Appointment deleted successfully.",
        "Failed to delete appointment."
      ),
  ]);

  const [, changeStatusAction, isChangingStatus] = useAction(
    changeAppointmentStatus,
    [
      ,
      (res) =>
        handleActionCompletion(
          res,
          "Status updated successfully.",
          "Failed to update status."
        ),
    ]
  );

  // Form
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    register,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { caseId: undefined, date: "", time: "" },
  });

  function handleActionCompletion(
    response: unknown,
    successMessage: string,
    errorMessage: string
  ) {
    if (response) {
      addToast({ title: "Success", description: successMessage });
      refreshAppointments();
      if (showModal) {
        setShowModal(false);
        reset();
        setSelectedStudentId(null);
        setCaseOptions([]);
      }
    } else {
      addToast({ title: "Error", description: errorMessage });
    }
  }

  const handleDateChange = ({
    startDate,
    endDate,
  }: {
    startDate: string | null;
    endDate: string | null;
  }) => {
    setStartDate(startDate ? new Date(startDate) : undefined);
    setEndDate(endDate ? new Date(endDate) : undefined);
    setPage(1);
  };

  // Student select options
  const studentOptions = useMemo(() => {
    if (!studentsResponse?.data) return [];
    return studentsResponse.data.map(
      (student: { wdt_ID: number; name: string | null }) => ({
        value: student.wdt_ID,
        label: `${student.wdt_ID} - ${student.name ?? ""}`,
      })
    );
  }, [studentsResponse]);

  // Fetch cases per student
  const fetchCases = useCallback(
    async (studentId: number) => {
      setIsLoadingCases(true);
      try {
        const res = await getCasePerStudent(studentId);
        const list: { id: string }[] = Array.isArray(res?.data) ? res.data : [];
        const mapped = list.map((c, idx) => ({
          value: c.id,
          label: `Case ${idx + 1}`,
        }));
        setCaseOptions(mapped);
        if (mapped.length === 1) {
          setValue("caseId", mapped[0].value);
        } else {
          setValue("caseId", "");
        }
      } catch (e) {
        console.error("Error loading cases:", e);
        setCaseOptions([]);
        setValue("caseId", "");
      } finally {
        setIsLoadingCases(false);
      }
    },
    [setValue]
  );

  // React to student selection
  useEffect(() => {
    if (selectedStudentId == null) {
      setCaseOptions([]);
      setValue("caseId", "");
      return;
    }
    fetchCases(selectedStudentId);
  }, [selectedStudentId, fetchCases, setValue]);

  // Add
  const handleAdd = () => {
    setEditItem(null);
    reset();
    setSelectedStudentId(null);
    setCaseOptions([]);
    setShowModal(true);
  };

  // Edit (assumes backend row includes case + student references if needed)
  const handleEdit = (item: AppointmentRow) => {
    setEditItem(item);
    // If you can derive studentId from row -> setSelectedStudentId(Number(item.studentId))
    // Else leave student/case unchanged (disabled)
    if (item.studentId) {
      const parsed = Number(item.studentId);
      if (!Number.isNaN(parsed)) setSelectedStudentId(parsed);
    }
    setValue("caseId", item.caseId);
    setValue("date", item.date);
    setValue("time", item.time);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      setPendingDeleteId(deleteId);
      await deleteAction(deleteId);
      setDeleteId(null);
    } finally {
      setPendingDeleteId(null);
    }
  };

  const handleChangeStatus = (id: string) => {
    setConfirmId(id);
  };

  const handleConfirmChangeStatus = async () => {
    if (!confirmId) return;
    try {
      setPendingStatusId(confirmId);
      await changeStatusAction(confirmId);
      setConfirmId(null);
    } finally {
      setPendingStatusId(null);
    }
  };

  const onSubmit = async (data: z.infer<typeof appointmentSchema>) => {
    if (!data.caseId) {
      addToast({ title: "Error", description: "Please select a case." });
      return;
    }
    const payload = { ...data, date: new Date(data.date) };
    if (editItem) {
      await updateAction(editItem.id, payload);
    } else {
      await createAction(payload);
    }
  };

  // Rows for table
  const rows: AppointmentRow[] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (appointmentsResponse?.data || []).map((item: any) => ({
      key: String(item.id),
      id: String(item.id),
      caseId: item.case,
      studentId: item.student?.wdt_ID ? String(item.student.wdt_ID) : undefined,
      student_wdt_ID: item.case?.student?.wdt_ID
        ? String(item.case.student.wdt_ID)
        : "",
      student_name: item.case?.student?.name ?? "",
      date: item.date ? new Date(item.date).toISOString().split("T")[0] : "",
      time: item.time ?? "",
      status: item.status ?? "",
      createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : "",
    })) || [];

  const columns: ColumnDef[] = [
    {
      key: "autoId",
      label: "#",
      renderCell: (item) => {
        const idx = rows.findIndex((r) => r.id === item.id);
        return idx !== -1 ? (page - 1) * pageSize + idx + 1 : item.id;
      },
    },
    {
      key: "student_wdt_ID",
      label: "Student ID",
      renderCell: (item) => item.student_wdt_ID || "-",
    },
    {
      key: "student_name",
      label: "Student Name",
      renderCell: (item) => item.student_name || "-",
    },
    {
      key: "date",
      label: "Date",
      renderCell: (item) =>
        item.date ? new Date(item.date).toLocaleDateString() : "N/A",
    },
    { key: "time", label: "Time", renderCell: (item) => item.time || "-" },
    {
      key: "status",
      label: "Status",
      renderCell: (item) => {
        const statusStyles: Record<string, string> = {
          Confirmed: "bg-green-100 text-green-800",
          Pending: "bg-yellow-100 text-yellow-800",
          Cancelled: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              statusStyles[item.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {item.status}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      label: "Created At",
      renderCell: (item) =>
        item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
    },
    {
      key: "changeStatus",
      label: "Change Status",
      renderCell: (item) => (
        <Button
          size="sm"
          color="primary"
          variant="flat"
          onPress={() => handleChangeStatus(item.id)}
          isLoading={pendingStatusId === item.id && isChangingStatus}
        >
          Confirm
        </Button>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      renderCell: (item) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            color="primary"
            variant="flat"
            onPress={() => handleEdit(item as AppointmentRow)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            color="danger"
            variant="flat"
            onPress={() => handleDelete(item.id)}
            isLoading={isDeletingAppointment}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoadingAppointments && !appointmentsResponse?.data && page === 1) {
    return (
      <div className="flex justify-center items-center h-full p-4">
        <div>Loading appointments...</div>
      </div>
    );
  }

  const disableSubmit =
    isCreatingAppointment || isUpdatingAppointment || isSubmitting;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
        <Button color="primary" onPress={handleAdd}>
          <Plus size={20} className="mr-2" />
          Add Appointment
        </Button>
      </div>

      <CustomTable
        columns={columns}
        rows={rows.map((row) =>
          Object.fromEntries(Object.entries(row).map(([k, v]) => [k, v ?? ""]))
        )}
        totalRows={appointmentsResponse?.pagination?.totalRecords || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(1);
        }}
        searchValue={search}
        onSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        isLoading={isLoadingAppointments}
        enableDateFilter
        startDate={startDate?.toISOString().split("T")[0]}
        endDate={endDate?.toISOString().split("T")[0]}
        onDateChange={handleDateChange}
      />

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editItem ? "Edit Appointment" : "Add Appointment"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                {/* Student Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student
                  </label>
                  <Select
                    placeholder="Select a student..."
                    options={studentOptions}
                    isClearable
                    isDisabled={!!editItem || disableSubmit}
                    isLoading={isLoadingStudents}
                    value={
                      studentOptions.find(
                        (s) => s.value === selectedStudentId
                      ) || null
                    }
                    onChange={(opt) =>
                      setSelectedStudentId(opt ? Number(opt.value) : null)
                    }
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "0.5rem",
                        minHeight: "42px",
                      }),
                    }}
                  />
                </div>

                {/* Case Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Case
                  </label>
                  <Controller
                    name="caseId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder={
                          selectedStudentId == null
                            ? "Select a student first"
                            : isLoadingCases
                            ? "Loading cases..."
                            : caseOptions.length === 0
                            ? "No cases"
                            : "Select a case"
                        }
                        options={caseOptions}
                        isLoading={isLoadingCases}
                        isDisabled={
                          selectedStudentId == null ||
                          isLoadingCases ||
                          disableSubmit
                        }
                        value={
                          caseOptions.find((c) => c.value === field.value) ||
                          null
                        }
                        onChange={(opt) =>
                          field.onChange(opt ? opt.value : undefined)
                        }
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: "0.5rem",
                            minHeight: "42px",
                            borderColor: errors.caseId
                              ? "#ef4444"
                              : base.borderColor,
                          }),
                        }}
                      />
                    )}
                  />
                  {errors.caseId && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.caseId.message}
                    </span>
                  )}
                </div>

                {/* Date */}
                <div>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500"
                    {...register("date")}
                    disabled={disableSubmit}
                  />
                  {errors.date && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.date.message}
                    </span>
                  )}
                </div>

                {/* Time */}
                <div>
                  <input
                    type="time"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500"
                    {...register("time")}
                    disabled={disableSubmit}
                  />
                  {errors.time && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.time.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="ghost"
                  type="button"
                  onPress={() => {
                    setShowModal(false);
                    reset();
                    setSelectedStudentId(null);
                    setCaseOptions([]);
                  }}
                  disabled={disableSubmit}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={disableSubmit}
                  disabled={
                    disableSubmit || !selectedStudentId || !caseOptions.length
                  }
                >
                  {isUpdatingAppointment && editItem && (
                    <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                  )}
                  {editItem ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm">
            <CustomAlert
              color="warning"
              title="Are you sure?"
              description="Do you want to change the appointment status?"
              confirmText="Sure"
              cancelText="Cancel"
              onConfirm={handleConfirmChangeStatus}
              onCancel={() => setConfirmId(null)}
              isConfirmLoading={
                pendingStatusId === confirmId && isChangingStatus
              }
            />
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm">
            <CustomAlert
              color="danger"
              title="Delete appointment?"
              description="This action cannot be undone."
              confirmText="Delete"
              cancelText="Cancel"
              onConfirm={handleConfirmDelete}
              onCancel={() => setDeleteId(null)}
              isConfirmLoading={
                pendingDeleteId === deleteId && isDeletingAppointment
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
