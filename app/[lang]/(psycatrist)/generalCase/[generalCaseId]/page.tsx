"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@heroui/react";
import { CustomCard } from "@/components/custom-card";
import CustomAlert from "@/components/custom-alert";
import { addToast } from "@heroui/toast";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import useAction from "@/hooks/useActions";
import Select from "react-select";
import {
  getCaseCard,
  createCaseCard3,
  deleteCaseCard,
  patientTypeData,
} from "@/actions/psycatrist/case";
import { getStudents } from "@/actions/psycatrist/students";
import { caseSchema } from "@/lib/zodSchema";
import { useParams } from "next/navigation";

// Type for student data for the dropdown
type StudentOption = {
  value: number;
  label: string;
};

function Page() {
  const { generalCaseId } = useParams<{ generalCaseId: string }>();
  // const GeneralCaseId = params?.generalCaseId as string;

  const [showModal, setShowModal] = useState(false);
  // const [problemTypes, setProblemTypes] = useState<ProblemType[]>([]);
  const [studentOptions, setStudentOptions] = useState<StudentOption[]>([]);
  const [search] = useState("");
  const [page] = useState(1);
  const [perPage] = useState(10);

  // --- Data Fetching & Action Hooks ---
  const [casesResponse, refreshCases, isLoadingCases] = useAction(
    getCaseCard,
    [true, () => {}],
    generalCaseId,
    search,
    page,
    perPage
  );
  const [, createAction, isCreating] = useAction(createCaseCard3, [
    ,
    (response) => {
      if (response) {
        addToast({
          title: "Success",
          description: "New case has been added.",
        });
        refreshCases();
      } else {
        addToast({
          title: "Error",
          description: "Failed to add case.",
        });
      }
    },
  ]);

  const [patientresponse, ,] = useAction(patientTypeData, [true, () => {}]);

  const [, deleteAction, isDeleting] = useAction(deleteCaseCard, [
    ,
    (response) => {
      if (response) {
        addToast({
          title: "Success",
          description: "Case has been deleted.",
        });
        refreshCases();
      } else {
        addToast({
          title: "Error",
          description: "Failed to delete case.",
        });
      }
    },
  ]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Fetch students and problem types for the dropdowns
  useEffect(() => {
    const fetchDataForSelects = async () => {
      const [studentsResult] = await Promise.all([
        getStudents("", 1, 1000), // Fetch all students
        patientTypeData(),
      ]);

      if (studentsResult && Array.isArray(studentsResult.data)) {
        setStudentOptions(
          studentsResult.data.map((student) => ({
            value: student.wdt_ID,
            label: `${student.name} (ID: ${student.wdt_ID})`,
          }))
        );
      }

      // if (problemTypesResult && Array.isArray(problemTypesResult)) {
      //   setProblemTypes(problemTypesResult);
      // }
    };
    fetchDataForSelects();
  }, []);

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof caseSchema>>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      // solved: false,
    },
  });

  const isSubmitting = isCreating || isDeleting;
  // const isSolved = watch("solved");

  // --- Event Handlers ---
  const handleAddCase = () => {
    reset({
      studentId: 0,
      problemTypeId: "",
      note: "",
    });
    setShowModal(true);
  };

  const handleDeleteCase = (id: string) => {
    setDeleteId(id);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      setPendingDeleteId(deleteId);
      await deleteAction(deleteId);
      setDeleteId(null);
      refreshCases();
    } finally {
      setPendingDeleteId(null);
    }
  };

  const onSubmit = async (data: z.infer<typeof caseSchema>) => {
    await createAction(
      data.studentGeneralCaseId,
      // data.studentId,
      data.problemTypeId,
      data.note
    );
    addToast({ title: "Success", description: "New case has been added." });
    setShowModal(false);
    reset();
    refreshCases();
  };

  // --- Memoized Data for Rendering ---
  const patientHistory = useMemo(() => {
    const data = casesResponse?.data || [];
    return Array.isArray(data)
      ? data.map((item) => ({
          id: item.id,
          name: item.student.name ?? "Unknown", // Ensure name is always a string
          problemType: item.patientData?.type ?? "Unknown",
          diagnosis: item.note ?? "empty", // Add diagnosis property
          date: new Date(item.createdAt).toLocaleDateString(),
          priority: item.priority,
          status: item.solved,
        }))
      : [];
  }, [casesResponse]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Patient Case History
        </h1>
        <Button color="primary" variant="solid" onPress={handleAddCase}>
          <Plus size={20} className="mr-2" />
          Add New Case
        </Button>
      </div>

      {isLoadingCases ? (
        <div className="flex justify-center items-center p-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <CustomCard
          patientHistory={patientHistory}
          onDelete={handleDeleteCase}
          // isDeleting={isDeleting}
        />
      )}

      {/* Modal for Add New Case */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 shadow-xl rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
              Add New Case
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Problem Type
                  </label>
                  <select
                    className="w-full p-3 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    {...register("problemTypeId")}
                    disabled={isSubmitting}
                  >
                    <option value="">Select a problem type</option>
                    {(patientresponse ?? []).map((pt) => (
                      <option key={pt.id} value={pt.id}>
                        {pt.type}
                      </option>
                    ))}
                  </select>
                  {errors.problemTypeId && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.problemTypeId.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note (Optional)
                  </label>
                  <textarea
                    className="w-full p-3 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter note details"
                    rows={3}
                    {...register("note")}
                    disabled={isSubmitting}
                  />
                  {errors.note && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.note.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <Button
                  variant="ghost"
                  type="button"
                  onPress={() => setShowModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:from-pink-500 hover:to-purple-500 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                >
                  {isCreating && (
                    <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                  )}
                  Add Case
                </button>
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
    </div>
  );
}

export default Page;
