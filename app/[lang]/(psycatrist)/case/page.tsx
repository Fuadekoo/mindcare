"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@heroui/react";
import { CustomCard } from "@/components/custom-card";
import { addToast } from "@heroui/toast";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import useAction from "@/hooks/useActions";
import Select from "react-select";
import {
  getCaseCard,
  createCaseCard,
  deleteCaseCard,
  patientTypeData,
} from "@/actions/psycatrist/case";
import { getStudents } from "@/actions/psycatrist/students";
import { caseSchema } from "@/lib/zodSchema";

type PatientCase = {
  id: string;
  name: string;
  problemType: string;
  status: "solved" | "pending";
  date: string;
  diagnosis: string;
};

// Type for problem type data for the dropdown
type ProblemType = {
  id: string;
  type: string;
};

// Type for student data for the dropdown
type StudentOption = {
  value: number;
  label: string;
};

function Page() {
  const [showModal, setShowModal] = useState(false);
  const [problemTypes, setProblemTypes] = useState<ProblemType[]>([]);
  const [studentOptions, setStudentOptions] = useState<StudentOption[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // --- Data Fetching & Action Hooks ---
  const [casesResponse, refreshCases, isLoadingCases] = useAction(
    getCaseCard,
    [true, () => {}],
    search,
    page,
    perPage
  );
  const [, createAction, isCreating] = useAction(createCaseCard, [
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

  const [patientresponse, refreshPatientTypes, isLoadingPatientTypes] =
    useAction(patientTypeData, [true, () => {}]);

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

  // Fetch students and problem types for the dropdowns
  useEffect(() => {
    const fetchDataForSelects = async () => {
      const [studentsResult, problemTypesResult] = await Promise.all([
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

      if (problemTypesResult && Array.isArray(problemTypesResult)) {
        setProblemTypes(problemTypesResult);
      }
    };
    fetchDataForSelects();
  }, []);

  const {
    handleSubmit,
    register,
    reset,
    control,
    watch,
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

  const handleDeleteCase = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this case?")) {
      await deleteAction(id);
      addToast({ title: "Success", description: "Case has been deleted." });
      refreshCases();
    }
  };

  const onSubmit = async (data: z.infer<typeof caseSchema>) => {
    await createAction(data.studentId, data.problemTypeId, data.note);
    addToast({ title: "Success", description: "New case has been added." });
    setShowModal(false);
    reset();
    refreshCases();
  };

  // --- Memoized Data for Rendering ---
  const patientHistory = useMemo(() => {
    const data = casesResponse?.data || [];
    return Array.isArray(data)
      ? (data as any[]).map((item) => ({
          id: item.id,
          name: item.student?.name,
          problemType: item.patientType?.type,
          diagnosis: item.diagnosis ?? "", // Ensure diagnosis is present
          status: item.solved
            ? ("solved" as "solved")
            : ("pending" as "pending"),
          date: new Date(item.date).toLocaleDateString(),
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
                    Patient
                  </label>
                  <Controller
                    name="studentId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={studentOptions}
                        placeholder="Search and select a patient..."
                        isClearable
                        isSearchable
                        isDisabled={isSubmitting}
                        onChange={(option) =>
                          field.onChange(option ? option.value : "")
                        }
                        value={studentOptions.find(
                          (c) => c.value === field.value
                        )}
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: "0.75rem",
                            borderColor: "#a78bfa",
                            boxShadow: "0 0 0 2px #a78bfa33",
                            minHeight: "48px",
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected
                              ? "#a78bfa"
                              : state.isFocused
                              ? "#f3e8ff"
                              : "white",
                            color: state.isSelected ? "white" : "#4b5563",
                            fontWeight: state.isSelected ? "bold" : "normal",
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
                    Note
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
    </div>
  );
}

export default Page;
