"use client";
import React, { useState } from "react";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { CustomCard } from "@/components/custom-card";
import { addToast } from "@heroui/toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";

// Zod schema for case validation
const caseSchema = z.object({
  name: z.string().min(3, "Patient name is required."),
  problemType: z.string().min(3, "Problem type is required."),
  diagnosis: z.string().min(3, "Diagnosis is required."),
  date: z.string().min(1, "Date is required."),
});

// Type for a single patient case
type PatientCase = {
  id: string;
  name: string;
  problemType: string;
  status: "solved" | "pending";
  date: string;
  diagnosis: string;
};

// Sample data
const samplePatientHistory: PatientCase[] = [
  {
    id: "1",
    name: "John Doe",
    problemType: "Anxiety",
    status: "solved",
    date: "2024-06-10",
    diagnosis: "Generalized Anxiety Disorder",
  },
  {
    id: "2",
    name: "Jane Smith",
    problemType: "Depression",
    status: "pending",
    date: "2024-06-12",
    diagnosis: "Major Depressive Disorder",
  },
  {
    id: "3",
    name: "Alice Johnson",
    problemType: "Stress",
    status: "solved",
    date: "2024-06-15",
    diagnosis: "Acute Stress Reaction",
  },
  {
    id: "4",
    name: "Bob Brown",
    problemType: "PTSD",
    status: "pending",
    date: "2024-06-20",
    diagnosis: "Post-Traumatic Stress Disorder",
  },
  {
    id: "5",
    name: "Charlie Green",
    problemType: "OCD",
    status: "solved",
    date: "2024-06-22",
    diagnosis: "Obsessive-Compulsive Disorder",
  },
  {
    id: "6",
    name: "Diana Prince",
    problemType: "Bipolar",
    status: "pending",
    date: "2024-06-25",
    diagnosis: "Bipolar Disorder",
  },
];

function Page() {
  const [patientHistory, setPatientHistory] =
    useState<PatientCase[]>(samplePatientHistory);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof caseSchema>>({
    resolver: zodResolver(caseSchema),
  });

  const handleAddCase = () => {
    reset();
    setShowModal(true);
  };

  const handleDeleteCase = (id: string) => {
    if (window.confirm("Are you sure you want to delete this case?")) {
      setPatientHistory((prev) => prev.filter((p) => p.id !== id));
      addToast({ title: "Success", description: "Case has been deleted." });
    }
  };

  const onSubmit = (data: z.infer<typeof caseSchema>) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newCase: PatientCase = {
        id: Date.now().toString(),
        ...data,
        status: "pending",
      };
      setPatientHistory((prev) => [newCase, ...prev]);
      addToast({ title: "Success", description: "New case has been added." });
      setIsLoading(false);
      setShowModal(false);
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Patient Case History
        </h1>
        <Button color="primary" variant="solid" onClick={handleAddCase}>
          <Plus size={20} className="mr-2" />
          Add New Case
        </Button>
      </div>

      <CustomCard patientHistory={patientHistory} onDelete={handleDeleteCase} />

      {/* Modal for Add New Case */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Case</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <div>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Patient Name"
                    {...register("name")}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </span>
                  )}
                </div>
                <div>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Problem Type"
                    {...register("problemType")}
                    disabled={isLoading}
                  />
                  {errors.problemType && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.problemType.message}
                    </span>
                  )}
                </div>
                <div>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Diagnosis"
                    rows={3}
                    {...register("diagnosis")}
                    disabled={isLoading}
                  />
                  {errors.diagnosis && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.diagnosis.message}
                    </span>
                  )}
                </div>
                <div>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    {...register("date")}
                    disabled={isLoading}
                  />
                  {errors.date && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.date.message}
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
                  Add Case
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
