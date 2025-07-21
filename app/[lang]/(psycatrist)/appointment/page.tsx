"use client";
import React, { useState, useMemo } from "react";
import CustomTable, { ColumnDef } from "@/components/custom-table";
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
import { appointmentSchema } from "@/lib/zodSchema";

interface StudentOption {
  value: number;
  label: string;
}

interface Appointment {
  id: string;
  wdt_ID: number;
  student: {
    wdt_ID: number;
    name: string;
  };
  date: Date;
  time: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt: string;
}

function Page() {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Appointment | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  // --- Data Fetching ---
  const [appointmentsResponse, refreshAppointments, isLoadingAppointments] =
    useAction(getAppointments, [true, () => {}], search, page, pageSize);

  const [studentsResponse, , isLoadingStudents] = useAction(getStudents, [
    true,
    () => {},
  ]);

  // --- Form Handling ---
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    register, // Added register here
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema) as any,
    defaultValues: {
      studentId: undefined,
      date: "",
      time: "",
    },
  });

  // --- Actions ---
  const handleActionCompletion = (
    response: any,
    successMessage: string,
    errorMessage: string
  ) => {
    if (response && !response.error) {
      addToast({ title: "Success", description: successMessage });
      refreshAppointments();
      if (showModal) {
        setShowModal(false);
        reset();
      }
    } else {
      addToast({
        title: "Error",
        description: response?.error || errorMessage,
      });
    }
  };

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

  // Memoize student options for react-select
  const studentOptions = useMemo<StudentOption[]>(() => {
    if (!studentsResponse?.data) return [];
    return studentsResponse.data.map(
      (student: { wdt_ID: number; name: string | null }) => ({
        value: student.wdt_ID,
        label: `${student.wdt_ID} - ${student.name ?? ""}`,
      })
    );
  }, [studentsResponse]);

  // --- Event Handlers ---
  const handleAdd = () => {
    setEditItem(null);
    reset();
    setShowModal(true);
  };

  const handleEdit = (item: Appointment) => {
    setEditItem(item);
    setValue("studentId", item.student.wdt_ID);
    setValue("date", new Date(item.date).toISOString().split("T")[0]);
    setValue("time", item.time);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      await deleteAction(id);
    }
  };

  const handleChangeStatus = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to change the status of this appointment?"
      )
    ) {
      await changeStatusAction(id);
    }
  };

  const onSubmit = async (data: z.infer<typeof appointmentSchema>) => {
    const payload = {
      ...data,
      date: new Date(data.date),
    };
    if (editItem) {
      await updateAction(editItem.id, payload);
    } else {
      await createAction(payload);
    }
  };

  const isLoading =
    isCreatingAppointment || isUpdatingAppointment || isSubmitting;

  // --- Table Columns Definition ---
  const columns: ColumnDef<Appointment>[] = [
    {
      key: "autoId",
      label: "#",
      renderCell: (item, index) => {
        const calculatedIndex = (page - 1) * pageSize + index + 1;
        return isNaN(calculatedIndex) ? "" : calculatedIndex;
      },
    },
    {
      key: "student",
      label: "Student",
      renderCell: (item) => (
        <span>
          {item.student.wdt_ID} - {item.student.name}
        </span>
      ),
    },
    {
      key: "date",
      label: "Date",
      renderCell: (item) => new Date(item.date).toLocaleDateString(),
    },
    {
      key: "time",
      label: "Time",
    },
    {
      key: "status",
      label: "Status",
      renderCell: (item) => {
        const statusStyles = {
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
      renderCell: (item) => new Date(item.createdAt).toLocaleDateString(),
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
          isLoading={isChangingStatus}
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
            onPress={() => handleEdit(item)}
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
        rows={appointmentsResponse?.data || []}
        totalRows={appointmentsResponse?.meta?.total || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        searchValue={search}
        onSearch={setSearch}
        isLoading={isLoadingAppointments}
      />

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editItem ? "Edit Appointment" : "Add Appointment"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <div>
                  <Controller
                    name="studentId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={studentOptions}
                        placeholder="Search and select a student..."
                        isClearable
                        isSearchable
                        isLoading={isLoadingStudents}
                        isDisabled={isLoading}
                        onChange={(option) =>
                          field.onChange(option ? option.value : undefined)
                        }
                        value={
                          studentOptions.find((c) => c.value === field.value) ||
                          null
                        }
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: "0.5rem",
                            borderColor: errors.studentId
                              ? "#ef4444"
                              : "#d1d5db",
                            "&:hover": {
                              borderColor: errors.studentId
                                ? "#ef4444"
                                : "#8b5cf6",
                            },
                            boxShadow: errors.studentId
                              ? "0 0 0 1px #ef4444"
                              : "none",
                            minHeight: "42px",
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected
                              ? "#8b5cf6"
                              : state.isFocused
                              ? "#f5f3ff"
                              : "white",
                            color: state.isSelected ? "white" : "#374151",
                          }),
                        }}
                      />
                    )}
                  />
                  {errors.studentId && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.studentId.message}
                    </span>
                  )}
                </div>
                <div>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500"
                    {...register("date")}
                    disabled={isLoading}
                  />
                  {errors.date && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.date.message}
                    </span>
                  )}
                </div>
                <div>
                  <input
                    type="time"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500"
                    {...register("time")}
                    disabled={isLoading}
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
                  onPress={() => setShowModal(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                  )}
                  {editItem ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
