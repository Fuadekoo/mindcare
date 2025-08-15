"use client";
import React, { useState } from "react";
import Link from "next/link";
import CustomTable from "@/components/custom-table";
import useAction from "@/hooks/useActions";
import { getStudents } from "@/actions/psycatrist/students";
import {
  getAllGeneralCasePerStudent,
  createGeneralCase,
} from "@/actions/psycatrist/generalCase";
import {
  createCaseCard2,
  patientTypeData,
  getCasePerStudent,
  getCasePerGeneralCase,
} from "@/actions/psycatrist/case";
import {
  createAppointment,
  getAppointmentById,
  ChangeAppointmentStatus,
} from "@/actions/psycatrist/appointment";
import { Button } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  caseSchema,
  appointmentSchema,
  generalCaseSchema,
} from "@/lib/zodSchema";

type Student = {
  key: string;
  id: number;
  name: string;
  StudentGeneralCase: { id: string; status: string }[][];
  history: {
    id: string;
    solved: boolean;
    appointment: { id: string; status: string }[];
  }[];
  appointment: { id: string; status: string }[];
  wdt_ID?: number;
  phoneno?: string;
  country?: string;
  status?: string;
};

type CaseItem = { id: string; createdAt: string };

interface ColumnDef<T = any> {
  key: string;
  label: string;
  renderCell?: (item: T) => React.ReactNode;
}

function Page() {
  const [page, setPage] = useState(1);
  const [Data, setData] = useState<string>("");
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  // Modal State
  const [showGeneralCaseModal, setShowGeneralCaseModal] = useState(false);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showAppointmentDetailModal, setShowAppointmentDetailModal] =
    useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);

  // const [expandedGeneralCaseId, setExpandedGeneralCaseId] = useState<
  //   string | null
  // >(null);
  // const [casesForGeneralCase, setCasesForGeneralCase] = useState<CaseItem[]>(
  //   []
  // );

  // Per-row selection + loaded cases per GC
  const [selectedGCByStudent, setSelectedGCByStudent] = useState<
    Record<number, { gcId: string; dIndex: number }>
  >({});
  const [casesByGC, setCasesByGC] = useState<Record<string, CaseItem[]>>({});
  const [loadingByGC, setLoadingByGC] = useState<Record<string, boolean>>({});

  // Data Fetching
  const [studentsResponse, refreshStudents, isLoading] = useAction(
    getStudents,
    [
      true,
      (data) => {
        console.log("Students data fetched:>>>>>123", data);
      },
    ],
    search,
    page,
    pageSize
  );

  const [patientTypeResponse, , isLoadingPatientTypes] = useAction(
    patientTypeData,
    [true, () => {}]
  );

  const [caseData, perGeneralCaseAction, isLoadingGeneralCase] = useAction(
    getCasePerGeneralCase,
    [, () => {}]
  );

  const [caseResponse, perStudentCaseAction, isLoadingCase] = useAction(
    getCasePerStudent,
    [, () => {}]
  );

  const [studentCases, setStudentCases] = useState<CaseItem[]>([]);

  const [generalCaseResponse, getGeneralCaseAction, isLoadingGeneralCases] =
    useAction(getAllGeneralCasePerStudent, [
      ,
      (generalCaseResponse) => {
        console.log("General cases fetched:", generalCaseResponse);
      },
    ]);

  const [generalCasesPerStudent, setGeneralCasesPerStudent] = useState<
    { id: string; createdAt: string }[]
  >([]);

  const [appointmentDetailResponse, , isLoadingAppointmentDetail] = useAction(
    getAppointmentById,
    [true, () => {}],
    Data
  );

  // Action completion
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

  const [, createGeneralCaseAction, isCreatingGeneralCase] = useAction(
    createGeneralCase,
    [
      ,
      (res) =>
        handleActionCompletion(res, "General case created successfully."),
    ]
  );

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

  const [, ChangeAppointmentStatusAction, isChangingAppointmentStatus] =
    useAction(ChangeAppointmentStatus, [
      ,
      (res) =>
        handleActionCompletion(res, "Appointment status changed successfully."),
    ]);

  // Forms
  const caseForm = useForm<z.infer<typeof caseSchema>>({
    resolver: zodResolver(caseSchema),
  });
  const appointmentForm = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
  });
  const generalCaseForm = useForm<z.infer<typeof generalCaseSchema>>({
    resolver: zodResolver(generalCaseSchema),
  });

  // Handlers
  const handleOpenCaseModal = (student: Student) => {
    setSelectedStudent(student);
    caseForm.reset();
    caseForm.setValue("studentId", Number(student.id));
    setShowCaseModal(true);
  };

  const handleOpenGeneralCaseModal = (student: Student) => {
    setSelectedStudent(student);
    generalCaseForm.reset();
    generalCaseForm.setValue("studentId", student.id ? Number(student.id) : 0);
    setShowGeneralCaseModal(true);
  };

  const handleOpenAppointmentModal = async (student: Student) => {
    setSelectedStudent(student);
    appointmentForm.reset();
    // Fetch cases via action
    try {
      const res = await getCasePerStudent(student.id);
      console.log("Cases for student:", res);
      let cases: CaseItem[] = [];
      if (Array.isArray(res?.data))
        cases = res.data.map((c: { id: string; createdAt: Date | string }) => ({
          ...c,
          createdAt:
            typeof c.createdAt === "string"
              ? c.createdAt
              : c.createdAt.toISOString(),
        }));
      setStudentCases(cases);
      if (cases.length === 1) {
        appointmentForm.setValue("caseId", cases[0].id);
      }
    } catch (e) {
      console.error("getCasePerStudent error:", e);
      setStudentCases([]);
    }
    setShowAppointmentModal(true);
  };

  const handleOpenAppointmentDetailModal = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setShowAppointmentDetailModal(true);
    setData(appointmentId);
  };

  const handleCloseAppointmentDetailModal = () => {
    setShowAppointmentDetailModal(false);
    setSelectedAppointmentId(null);
  };

  const handleChangeAppointmentStatus = async (
    status: "rejected" | "confirmed"
  ) => {
    if (!selectedAppointmentId) return;
    await ChangeAppointmentStatusAction(selectedAppointmentId, status);
    setShowAppointmentDetailModal(false);
    setSelectedAppointmentId(null);
    refreshStudents();
  };

  const onCaseSubmit = async (data: z.infer<typeof caseSchema>) => {
    await createCaseAction(
      data.studentGeneralCaseId,
      data.studentId,
      data.problemTypeId,
      data.note
    );
  };

  const onGeneralCaseSubmit = async (
    data: z.infer<typeof generalCaseSchema>
  ) => {
    await createGeneralCaseAction(data.studentId);
  };

  const onAppointmentSubmit = async (
    data: z.infer<typeof appointmentSchema>
  ) => {
    console.log("Appointment data:>>>>", data);
    await createAppointmentAction({ ...data, date: new Date(data.date) });
  };

  // Rows
  const rows: Student[] =
    (studentsResponse?.data || []).map((student: any) => ({
      key: String(student.wdt_ID),
      id: student.wdt_ID,
      ...student,
    })) || [];

  const adaptedRows = rows.map((student) => {
    const {
      key,
      id,
      name,
      wdt_ID,
      phoneno,
      country,
      status,
      StudentGeneralCase,
      history: rawHistory,
    } = student;
    return {
      key,
      id: Number(id),
      name: name ?? "",
      wdt_ID: wdt_ID ?? 0,
      phoneno: phoneno ?? "",
      country: country ?? "",
      status: status ?? "",
      StudentGeneralCase: StudentGeneralCase || [],
      history: Array.isArray(rawHistory) ? rawHistory : [], // <- ensure array
    };
  });

  const handleSelectGeneralCase = async (
    studentId: number,
    gcId: string,
    dIndex: number
  ) => {
    setSelectedGCByStudent((prev) => ({
      ...prev,
      [studentId]: { gcId, dIndex },
    }));
    // fetch if not loaded yet
    if (!casesByGC[gcId]) {
      setLoadingByGC((p) => ({ ...p, [gcId]: true }));
      try {
        const res = await getCasePerGeneralCase(gcId);
        const list: CaseItem[] = Array.isArray(res?.data)
          ? res.data.map((item: any) => ({
              id: item.id,
              createdAt:
                typeof item.createdAt === "string"
                  ? item.createdAt
                  : item.createdAt?.toISOString?.() ?? "",
            }))
          : [];
        list.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setCasesByGC((p) => ({ ...p, [gcId]: list }));
      } catch {
        setCasesByGC((p) => ({ ...p, [gcId]: [] }));
      } finally {
        setLoadingByGC((p) => ({ ...p, [gcId]: false }));
      }
    }
  };

  const columns: ColumnDef[] = [
    {
      key: "autoId",
      label: "#",
      renderCell: (item) => {
        const rowIndexOnPage = rows.findIndex(
          (r) => String(r.id) === String(item.id)
        );
        return rowIndexOnPage !== -1
          ? (page - 1) * pageSize + rowIndexOnPage + 1
          : item.id;
      },
    },
    { key: "name", label: "Student Name" },
    { key: "wdt_ID", label: "ID" },
    { key: "phoneno", label: "Phone No" },
    { key: "country", label: "Country" },
    { key: "status", label: "Status" },

    {
      key: "StudentGeneralCase",
      label: "General Case",
      renderCell: (item: Student) => {
        if (!item.StudentGeneralCase || item.StudentGeneralCase.length === 0) {
          return <span className="text-gray-500">no case</span>;
        }
        const selected = selectedGCByStudent[item.id]?.gcId;
        return (
          <div className="flex gap-2">
            {item.StudentGeneralCase[0].map((caseItem, idx) => {
              const d = idx + 1;
              const active = selected === caseItem.id;
              return (
                <button
                  key={caseItem.id}
                  type="button"
                  className={`text-sm font-semibold px-3 py-1 rounded-md transition border ${
                    active ? "border-violet-500" : "border-transparent"
                  } ${
                    caseItem.status === "open"
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                  onClick={() =>
                    handleSelectGeneralCase(item.id, caseItem.id, d)
                  }
                >
                  {`D${d}`}
                  <span
                    className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
                      caseItem.status === "open"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {caseItem.status}
                  </span>
                </button>
              );
            })}
          </div>
        );
      },
    },
    {
      key: "history",
      label: "Case List",
      renderCell: (item: Student) => {
        const sel = selectedGCByStudent[item.id];
        if (!sel) {
          return <span className="text-gray-500">select a general case</span>;
        }
        const { gcId, dIndex } = sel;
        const loading = !!loadingByGC[gcId];
        const list = casesByGC[gcId] || [];
        if (loading && list.length === 0) {
          return (
            <span className="inline-flex items-center gap-1 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" /> loading...
            </span>
          );
        }
        if (list.length === 0) {
          return <span className="text-gray-500">no flow up</span>;
        }
        return (
          <div className="flex flex-wrap gap-2">
            {list.map((c, i) => {
              const label = `D${dIndex}C${i + 1}`;
              return (
                <Link
                  key={c.id}
                  href={`/en/generalCase/${gcId}/${c.id}`}
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md"
                  title={label}
                >
                  {label}
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
        const appointmentArr = Array.isArray(item.history)
          ? item.history.flatMap((cc: any) =>
              Array.isArray(cc?.appointment) ? cc.appointment : []
            )
          : [];
        if (appointmentArr.length === 0) {
          return <span className="text-gray-500">no appointment</span>;
        }
        return (
          <div className="flex flex-wrap gap-2 items-center">
            {appointmentArr.map((appt: any, idx: number) => (
              <button
                key={appt.id ?? `${idx}`}
                onClick={() =>
                  appt?.id && handleOpenAppointmentDetailModal(appt.id)
                }
                className="text-sm text-blue-600 hover:underline hover:text-blue-800 bg-blue-100 px-2 py-1 rounded-md"
              >
                {`P${idx + 1}`}
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
            onPress={() => handleOpenGeneralCaseModal(item)}
          >
            Add generalCase
          </Button>
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
        rows={adaptedRows}
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

      {showGeneralCaseModal && selectedStudent && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Add General Case for {selectedStudent.name}
            </h2>
            <div className="flex flex-col gap-4">
              <Button
                color="primary"
                isLoading={isCreatingGeneralCase}
                disabled={isCreatingGeneralCase}
                onPress={async () => {
                  await createGeneralCaseAction(selectedStudent.id);
                }}
              >
                {isCreatingGeneralCase && (
                  <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                )}
                Create General Case
              </Button>
              <Button
                variant="ghost"
                type="button"
                onPress={() => setShowGeneralCaseModal(false)}
                disabled={isCreatingGeneralCase}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* this is a case createPopup model */}
      {showCaseModal && selectedStudent && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
            {/* Close X icon in top right */}
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 focus:outline-none"
              onClick={() => setShowCaseModal(false)}
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Add Case for {selectedStudent.name}
            </h2>
            <form onSubmit={caseForm.handleSubmit(onCaseSubmit)}>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    General Case
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 disabled:bg-gray-100"
                    {...caseForm.register("studentGeneralCaseId")}
                    disabled={
                      isCreatingCase ||
                      !selectedStudent?.StudentGeneralCase ||
                      selectedStudent.StudentGeneralCase.length === 0
                    }
                    required
                  >
                    <option value="">
                      {selectedStudent?.StudentGeneralCase?.length === 0
                        ? "No general case found"
                        : "Select a general case"}
                    </option>
                    {selectedStudent?.StudentGeneralCase?.[0]?.map(
                      (gc, idx) => (
                        <option key={gc.id} value={gc.id}>
                          {`General Case ${idx + 1} (${gc.status})`}
                        </option>
                      )
                    )}
                  </select>
                  {caseForm.formState.errors.studentGeneralCaseId && (
                    <span className="text-red-500 text-xs mt-1">
                      {caseForm.formState.errors.studentGeneralCaseId.message}
                    </span>
                  )}
                </div>
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
                    {(patientTypeResponse || []).map(
                      (pt: { id: string; type: string }) => (
                        <option key={pt.id} value={pt.id}>
                          {pt.type}
                        </option>
                      )
                    )}
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
                    Case from open General case
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500"
                    {...appointmentForm.register("caseId")}
                    disabled={
                      isCreatingAppointment ||
                      isLoadingCase ||
                      studentCases.length === 0
                    }
                    required
                  >
                    <option value="">
                      {isLoadingCase
                        ? "Loading cases..."
                        : studentCases.length === 0
                        ? "No cases found"
                        : "Select a case"}
                    </option>
                    {studentCases.map((c, idx) => (
                      <option key={c.id} value={c.id}>
                        {`Case ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                  {appointmentForm.formState.errors.caseId && (
                    <span className="text-red-500 text-xs mt-1">
                      {appointmentForm.formState.errors.caseId.message}
                    </span>
                  )}
                </div>
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

      {showAppointmentDetailModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
            {/* Close X icon in top right */}
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 focus:outline-none"
              onClick={handleCloseAppointmentDetailModal}
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
            {isLoadingAppointmentDetail ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : appointmentDetailResponse ? (
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Student:</strong>{" "}
                  {appointmentDetailResponse.case?.student.name}
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
                color="danger"
                variant="flat"
                type="button"
                disabled={isChangingAppointmentStatus}
                onPress={() => handleChangeAppointmentStatus("rejected")}
              >
                Reject
              </Button>
              <Button
                color="success"
                variant="flat"
                type="button"
                disabled={isChangingAppointmentStatus}
                onPress={() => handleChangeAppointmentStatus("confirmed")}
              >
                Confirm
              </Button>
              {/* Replace Close button with Go to Case button */}
              {appointmentDetailResponse?.case?.id && (
                <Link
                  href={
                    appointmentDetailResponse.case?.studentGeneralCaseId
                      ? `/en/generalCase/${appointmentDetailResponse.case.studentGeneralCaseId}/${appointmentDetailResponse.case.id}`
                      : `/en/generalCase/${appointmentDetailResponse.case.id}`
                  }
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-violet-100 text-violet-700 hover:bg-violet-200 transition"
                >
                  Go to Case
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
