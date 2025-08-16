"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@heroui/react";
import { addToast } from "@heroui/toast";
import Select from "react-select";
import useAction from "@/hooks/useActions";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { getStudents } from "@/actions/psycatrist/students";
import CustomAlert from "@/components/custom-alert";
import {
  getGeneralCase,
  createGeneralCase,
  updateGeneralCase,
  deleteGeneralCase,
  getGeneralCaseByStudentId,
} from "@/actions/psycatrist/generalCase";

const generalCaseCreateSchema = z.object({
  studentId: z.number().int().min(1, "Student is required"),
});

type GeneralCaseRecord = {
  id: string;
  status: string;
  createdAt: string;
  student: { wdt_ID: number; name: string | null };
};

type StudentOption = { value: number; label: string };
type FormValues = z.infer<typeof generalCaseCreateSchema>;

type GeneralCaseCardProps = {
  accent?: "blue" | "green" | "red" | "yellow";
  title?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

function GeneralCaseCard({
  accent = "blue",
  title,
  footer,
  children,
  className = "",
}: GeneralCaseCardProps) {
  const accentColor =
    accent === "green"
      ? "border-green-400"
      : accent === "red"
      ? "border-red-400"
      : accent === "yellow"
      ? "border-yellow-400"
      : "border-blue-400";
  return (
    <div
      className={`rounded-2xl border-2 ${accentColor} bg-white shadow-sm p-5 flex flex-col gap-3 ${className}`}
    >
      {title && <div className="mb-2">{title}</div>}
      <div className="flex-1">{children}</div>
      {footer && <div className="mt-3">{footer}</div>}
    </div>
  );
}

// Simple debounce hook
function useDebounce<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function Page() {
  const router = useRouter();
  const params = useParams<{ lang: string }>();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [studentOptions, setStudentOptions] = useState<StudentOption[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const [closeId, setCloseId] = useState<string | null>(null);
  const [pendingCloseId, setPendingCloseId] = useState<string | null>(null);

  // Only search when user stops typing and when query length >= 2 (or empty for all)
  const q = debouncedSearch.trim();
  const effectiveSearch = q.length >= 2 ? q : "";

  const [generalCasesResponse, refreshGeneralCases, isLoadingGeneralCases] =
    useAction(
      getGeneralCase,
      [true, () => {}],
      effectiveSearch,
      page,
      pageSize
    );

  const [, createAction, isCreating] = useAction(createGeneralCase, [
    undefined,
    (res) => {
      if (res?.success) {
        addToast({ title: "Success", description: res.message });
        setShowModal(false);
        reset();
        refreshGeneralCases();
      } else {
        addToast({
          title: "Error",
          description: res?.message || "Failed to create general case",
        });
      }
    },
  ]);

  const [, updateAction, isUpdating] = useAction(updateGeneralCase, [
    undefined,
    (res) => {
      if (res) {
        addToast({
          title: "Success",
          description: res.message || "General case updated",
        });
        refreshGeneralCases();
      }
    },
  ]);

  const [, deleteAction, isDeleting] = useAction(deleteGeneralCase, [
    undefined,
    (res) => {
      if (res?.message?.includes("success")) {
        addToast({ title: "Success", description: res.message });
        refreshGeneralCases();
      } else {
        addToast({
          title: "Error",
          description: res?.message || "Failed to delete general case",
        });
      }
    },
  ]);

  useEffect(() => {
    const loadStudents = async () => {
      setIsLoadingStudents(true);
      try {
        const res = await getStudents("", 1, 1000);
        if (Array.isArray(res?.data)) {
          setStudentOptions(
            res.data.map((s) => ({
              value: s.wdt_ID,
              label: `${s.wdt_ID} - ${s.name ?? "Unnamed"}`,
            }))
          );
        }
      } finally {
        setIsLoadingStudents(false);
      }
    };
    loadStudents();
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(generalCaseCreateSchema),
    defaultValues: { studentId: 0 },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const existing = await getGeneralCaseByStudentId(data.studentId);
      if (existing && existing.status !== "closed") {
        addToast({
          title: "Info",
          description: "Student already has an open general case.",
        });
        return;
      }
    } catch {}
    await createAction(data.studentId);
  };

  const handleCloseCase = (id: string) => setCloseId(id);

  const handleConfirmClose = async () => {
    if (!closeId) return;
    try {
      setPendingCloseId(closeId);
      await updateAction(closeId);
      setCloseId(null);
    } finally {
      setPendingCloseId(null);
    }
  };

  const handleDelete = (id: string) => setDeleteId(id);

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

  const handleDetails = (id: string) => {
    router.push(`/${params.lang}/generalCase/${id}`);
  };

  const cases: GeneralCaseRecord[] = useMemo(
    () =>
      Array.isArray(generalCasesResponse?.data)
        ? generalCasesResponse.data.map((item) => ({
            ...item,
            createdAt:
              typeof item.createdAt === "string"
                ? item.createdAt
                : Object.prototype.toString.call(item.createdAt) ===
                  "[object Date]"
                ? (item.createdAt as Date).toISOString()
                : "",
          }))
        : [],
    [generalCasesResponse]
  );
  const pagination = generalCasesResponse?.pagination;

  const isBusy =
    isCreating || isUpdating || isDeleting || isLoadingGeneralCases;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">General Cases</h1>
        <div className="flex gap-3 w-full md:w-auto items-center">
          <input
            placeholder="Search by student name..."
            className="flex-1 md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            disabled={isLoadingGeneralCases}
          />
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            disabled={isLoadingGeneralCases}
            aria-label="Rows per page"
            title="Rows per page"
          >
            {[1, 10, 30, 100].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
          <Button
            color="primary"
            variant="solid"
            onPress={() => setShowModal(true)}
            isDisabled={isBusy}
          >
            <Plus size={18} className="mr-1" />
            Add
          </Button>
        </div>
      </div>

      <div>
        {isLoadingGeneralCases ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-xl border border-gray-200 bg-gray-50 animate-pulse"
              />
            ))}
          </div>
        ) : cases.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-xl p-10 text-center text-gray-500">
            No general cases found.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cases.map((gc, idx) => {
              const isClosed = gc.status === "closed";
              return (
                <GeneralCaseCard
                  key={gc.id}
                  accent={isClosed ? "green" : "blue"}
                  title={
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800">
                        {gc.student.name || "Unnamed"}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${
                          isClosed
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {gc.status}
                      </span>
                    </div>
                  }
                  footer={
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        onPress={() => handleDetails(gc.id)}
                        disabled={isBusy}
                      >
                        Details
                      </Button>
                      {!isClosed && (
                        <Button
                          size="sm"
                          variant="flat"
                          color="success"
                          onPress={() => handleCloseCase(gc.id)}
                          disabled={isBusy}
                        >
                          Close
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        onPress={() => handleDelete(gc.id)}
                        disabled={isBusy}
                      >
                        Delete
                      </Button>
                    </div>
                  }
                >
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase text-gray-400">
                        Student ID
                      </span>
                      <span className="font-mono text-xs text-gray-700">
                        {gc.student.wdt_ID}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase text-gray-400">
                        Index
                      </span>
                      <span className="text-xs text-gray-700">
                        {(page - 1) * pageSize + idx + 1}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase text-gray-400">
                        Created
                      </span>
                      <span className="text-xs text-gray-700">
                        {new Date(gc.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </GeneralCaseCard>
              );
            })}
          </div>
        )}
      </div>

      {pagination && cases.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 px-1 text-sm">
          <div className="text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages} •{" "}
            {pagination.totalRecords} records
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="flat"
              disabled={!pagination.hasPreviousPage || isLoadingGeneralCases}
              onPress={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="flat"
              disabled={!pagination.hasNextPage || isLoadingGeneralCases}
              onPress={() =>
                setPage((p) => (pagination.hasNextPage ? p + 1 : p))
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Create General Case
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student
                </label>
                <Controller
                  name="studentId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select student..."
                      isClearable
                      isSearchable
                      isLoading={isLoadingStudents}
                      options={studentOptions}
                      onChange={(opt) => field.onChange(opt ? opt.value : 0)}
                      value={studentOptions.find(
                        (o) => o.value === field.value
                      )}
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "46px",
                          borderRadius: "0.75rem",
                          borderColor: errors.studentId
                            ? "#ef4444"
                            : base.borderColor,
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
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="ghost"
                  type="button"
                  disabled={isCreating}
                  onPress={() => {
                    setShowModal(false);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  disabled={isCreating}
                  isLoading={isCreating}
                >
                  {isCreating && (
                    <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                  )}
                  Create
                </Button>
              </div>
            </form>
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
              isConfirmLoading={pendingDeleteId === deleteId && isDeleting}
            />
          </div>
        </div>
      )}

      {closeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm">
            <CustomAlert
              color="danger"
              title="Close case?"
              description="This action cannot be undone."
              confirmText="Close"
              cancelText="Cancel"
              onConfirm={handleConfirmClose}
              onCancel={() => setCloseId(null)}
              isConfirmLoading={pendingCloseId === closeId && isUpdating}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
