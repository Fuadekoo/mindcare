"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import CustomTable from "@/components/custom-table";
import useAction from "@/hooks/useActions";
import { getStudents } from "@/actions/psycatrist/students";
import { createCaseCard2, patientTypeData } from "@/actions/psycatrist/case";
import {
  createAppointment,
  getAppointmentById,
} from "@/actions/psycatrist/appointment";
import { Button } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { caseSchema, appointmentSchema } from "@/lib/zodSchema";

type Student = {
  key: string;
  id: number;
  name: string;
  history: { id: string; solved: boolean }[];
  appointment: { id: string; status: string }[];
  [key: string]: any;
};

type ColumnDef = {
  key: string;
  label: string;
  renderCell?: (item: Student) => React.ReactNode;
};

function Page() {
  const [page, setPage] = useState(1);
  const [Data, setData] = useState<string>("");
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  // --- Modal State ---
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showAppointmentDetailModal, setShowAppointmentDetailModal] =
    useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);

  // --- Data Fetching ---
  const [studentsResponse, refreshStudents, isLoading] = useAction(
    getStudents,
    [true, () => {}],
    search,
    page,
    pageSize
  );

  const [patientTypeResponse, , isLoadingPatientTypes] = useAction(
    patientTypeData,
    [true, () => {}]
  );

  const [appointmentDetailResponse, , isLoadingAppointmentDetail] = useAction(
    getAppointmentById,
    [true, () => {}],
    Data
  );

  // --- Action Callbacks ---
  const handleActionCompletion = (
    response: { error?: string; message?: string } | null,
    successMessage: string
  ) => {
    if (response && !response.error) {
      addToast({
        title: "Success",
        description: response?.message || successMessage,
      });
      setShowCaseModal(false);
      setShowAppointmentModal(false);
      caseForm.reset();
      appointmentForm.reset();
      refreshStudents();
    } else {
      addToast({
        title: "Error",
        description:
          response?.error ||
          response?.message ||
          "An unexpected error occurred.",
      });
    }
  };

  const [, createAppointmentAction, isCreatingAppointment] = useAction(
    createAppointment,
    [
      ,
      (res) => handleActionCompletion(res, "Appointment created successfully."),
    ]
  );

  const [, createCaseAction, isCreatingCase] = useAction(createCaseCard2, [
    ,
    (res) => handleActionCompletion(res, "Case created successfully."),
  ]);

  // --- Form Handling ---
  const caseForm = useForm<z.infer<typeof caseSchema>>({
    resolver: zodResolver(caseSchema),
  });

  const appointmentForm = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
  });

  // --- Event Handlers ---
  const handleOpenCaseModal = (student: Student) => {
    setSelectedStudent(student);
    caseForm.reset();
    caseForm.setValue("studentId", Number(student.id));
    setShowCaseModal(true);
  };

  const handleOpenAppointmentModal = (student: Student) => {
    setSelectedStudent(student);
    appointmentForm.reset();
    appointmentForm.setValue("studentId", Number(student.id));
    setShowAppointmentModal(true);
  };

  const handleOpenAppointmentDetailModal = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setShowAppointmentDetailModal(true);
  };

  const handleCloseAppointmentDetailModal = () => {
    setShowAppointmentDetailModal(false);
    setSelectedAppointmentId(null);
  };

  const onCaseSubmit = async (data: z.infer<typeof caseSchema>) => {
    await createCaseAction(data.studentId, data.problemTypeId, data.note);
  };

  const onAppointmentSubmit = async (
    data: z.infer<typeof appointmentSchema>
  ) => {
    await createAppointmentAction({ ...data, date: new Date(data.date) });
  };

  // --- Table Rows & Columns ---
  const rows: Student[] =
    (studentsResponse?.data || []).map((student: any) => ({
      key: String(student.wdt_ID),
      id: String(student.wdt_ID),
      ...student,
    })) || [];

  const columns: ColumnDef[] = [
    {
      key: "autoId",
      label: "#",
      renderCell: (item) => {
        const rowIndexOnPage = rows.findIndex((r) => r.id === item.id);
        return rowIndexOnPage !== -1
          ? (page - 1) * pageSize + rowIndexOnPage + 1
          : item.id;
      },
    },
    { key: "name", label: "Student Name" },
    { key: "wdt_ID", label: "ID" },
    { key: "passcode", label: "Passcode" },
    { key: "phoneno", label: "Phone No" },
    { key: "country", label: "Country" },
    { key: "status", label: "Status" },
    {
      key: "history",
      label: "Case List",
      renderCell: (item: Student) => {
        if (!item.history || item.history.length === 0) {
          return <span className="text-gray-500">no flow up</span>;
        }
        return (
          <div className="grid grid-cols-4 gap-9">
            {item.history.map((caseItem, index) => {
              const isSolved = caseItem.solved;
              const linkClass = isSolved
                ? "text-sm text-green-600 hover:underline hover:text-green-800 bg-green-100  pl-2 pr-5 py-1 rounded-md"
                : "text-sm text-red-600 hover:underline hover:text-red-800 bg-red-100 pl-2 pr-5  py-1 rounded-md";

              return (
                <Link
                  key={caseItem.id}
                  href={`/en/case/${caseItem.id}`}
                  className={linkClass}
                >
                  {`C${index + 1}`}
                </Link>
              );
            })}
          </div>
        );
      },
    },
    {
      key: "appointment",
      label: "Appointment List",
      renderCell: (item: Student) => {
        if (!item.appointment || item.appointment.length === 0) {
          return <span className="text-gray-500">no appointment</span>;
        }
        return (
          <div className="flex flex-wrap gap-2 items-center">
            {item.appointment.map((appt, index) => (
              <button
                key={appt.id}
                onMouseEnter={() => setData(appt.id)}
                onClick={() => handleOpenAppointmentDetailModal(appt.id)}
                className="text-sm text-blue-600 hover:underline hover:text-blue-800 bg-blue-100 px-2 py-1 rounded-md"
              >
                {`P${index + 1}`}
              </button>
            ))}
          </div>
        );
      },
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
            onPress={() => handleOpenCaseModal(item)}
          >
            Add Case
          </Button>
          <Button
            size="sm"
            color="secondary"
            variant="flat"
            onPress={() => handleOpenAppointmentModal(item)}
          >
            Add Appointment
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading && !studentsResponse?.data && page === 1) {
    return (
      <div className="flex justify-center items-center h-full p-4">
        <div>Loading students...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Students Data</h1>
        <p className="text-gray-500 mt-1">
          A list of all the students in the system.
        </p>
      </div>
      <CustomTable
        columns={columns}
        rows={rows}
        totalRows={studentsResponse?.pagination?.totalRecords || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          setPage(1);
        }}
        searchValue={search}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        isLoading={isLoading}
      />

      {/* Add Case Modal */}
      {showCaseModal && selectedStudent && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Add Case for {selectedStudent.name}
            </h2>
            <form onSubmit={caseForm.handleSubmit(onCaseSubmit)}>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Problem Type
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 disabled:bg-gray-100"
                    {...caseForm.register("problemTypeId")}
                    disabled={isCreatingCase || isLoadingPatientTypes}
                  >
                    <option value="">
                      {isLoadingPatientTypes
                        ? "Loading..."
                        : "Select a problem type"}
                    </option>
                    {(patientTypeResponse || []).map((pt: any) => (
                      <option key={pt.id} value={pt.id}>
                        {pt.type}
                      </option>
                    ))}
                  </select>
                  {caseForm.formState.errors.problemTypeId && (
                    <span className="text-red-500 text-xs mt-1">
                      {caseForm.formState.errors.problemTypeId.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500"
                    placeholder="Enter note details"
                    rows={3}
                    {...caseForm.register("note")}
                    disabled={isCreatingCase}
                  />
                  {caseForm.formState.errors.note && (
                    <span className="text-red-500 text-xs mt-1">
                      {caseForm.formState.errors.note.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="ghost"
                  type="button"
                  onPress={() => setShowCaseModal(false)}
                  disabled={isCreatingCase}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isCreatingCase}
                  disabled={isCreatingCase}
                >
                  {isCreatingCase && (
                    <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                  )}
                  Add Case
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Appointment Modal */}
      {showAppointmentModal && selectedStudent && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Add Appointment for {selectedStudent.name}
            </h2>
            <form onSubmit={appointmentForm.handleSubmit(onAppointmentSubmit)}>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500"
                    {...appointmentForm.register("date")}
                    disabled={isCreatingAppointment}
                  />
                  {appointmentForm.formState.errors.date && (
                    <span className="text-red-500 text-xs mt-1">
                      {appointmentForm.formState.errors.date.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500"
                    {...appointmentForm.register("time")}
                    disabled={isCreatingAppointment}
                  />
                  {appointmentForm.formState.errors.time && (
                    <span className="text-red-500 text-xs mt-1">
                      {appointmentForm.formState.errors.time.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="ghost"
                  type="button"
                  onPress={() => setShowAppointmentModal(false)}
                  disabled={isCreatingAppointment}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isCreatingAppointment}
                  disabled={isCreatingAppointment}
                >
                  {isCreatingAppointment && (
                    <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                  )}
                  Add Appointment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Appointment Detail Modal */}
      {showAppointmentDetailModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
            {isLoadingAppointmentDetail ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : appointmentDetailResponse ? (
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Student:</strong>{" "}
                  {appointmentDetailResponse.student.name}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(
                    appointmentDetailResponse.date
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {appointmentDetailResponse.time}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointmentDetailResponse.status === "solved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {appointmentDetailResponse.status}
                  </span>
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(
                    appointmentDetailResponse.createdAt
                  ).toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-red-500">
                Could not load appointment details.
              </p>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="ghost"
                type="button"
                onPress={handleCloseAppointmentDetailModal}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
