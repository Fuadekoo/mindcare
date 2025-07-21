"use client";
import React, { useState } from "react";
import { Textarea } from "@heroui/react";
import { ArrowLeft, X } from "lucide-react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import useAction from "@/hooks/useActions";
import { addToast } from "@heroui/toast";
import { useParams } from "next/navigation";
import {
  changeCaseStatus,
  createDiagnosis,
  deleteDiagnosis,
  createObservation,
  deleteObservation,
  createTreatment,
  deleteTreatment,
  getallDiagnosisPerCase,
  getallObservationPerCase,
  getallTreatmentPerCase,
} from "@/actions/psycatrist/case";

function EditableSection({
  title,
  items,
  onAddItem,
  onDeleteItem,
}: {
  title: string;
  items: string[];
  onAddItem: (item: string) => void;
  onDeleteItem: (index: number) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddItem(inputValue);
      setInputValue(""); // Clear input after submission
    }
  };

  // Handle key presses in the textarea
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    // Submit on Enter, but allow Shift+Enter for new lines
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent adding a new line
      handleSubmit(e as any); // Trigger the form submission logic
    }
  };

  // gate the caseid from the URL parameters
  const { caseId } = useParams();

  return (
    <div className="p-4 border-r-1 border-primary-300">
      <h1 className="text-xl font-bold capitalize text-primary-700 mb-3 underline">
        {title}
      </h1>
      <ul className="space-y-2 mb-4 min-h-[100px]">
        {items.map((item, index) => (
          <li
            key={index}
            className="relative p-3 bg-primary-50 border border-primary-200 rounded-lg shadow-sm text-primary-900 group"
          >
            <p className="whitespace-pre-wrap break-words pr-6">{item}</p>
            <button
              onClick={() => onDeleteItem(index)}
              className="absolute top-2 right-2 text-primary-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Delete ${title} item`}
            >
              <X size={16} />
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Add ${title}... (Enter to save)`}
          className="w-full p-2 bg-transparent border-b-2 border-primary-300 focus:border-secondary-500 focus:outline-none transition-colors"
          rows={3} // Adjust the initial height
        />
      </form>
    </div>
  );
}

function Page() {
  const [diagnoses, setDiagnoses] = useState<string[]>([]);
  const [observations, setObservations] = useState<string[]>([]);
  const [treatments, setTreatments] = useState<string[]>([]);

  // Get caseId from URL params
  const { caseId } = useParams();

  // --- Data Fetching & Action Hooks ---
  const [diagnosisResponse, refreshDiagnosis, isLoadingDiagnosis] = useAction(
    getallDiagnosisPerCase,
    [
      true,
      (response) => {
        if (response) {
          addToast({
            title: "Success",
            description: "New case has been added.",
          });
          refreshDiagnosis();
        } else {
          addToast({
            title: "Error",
            description: "Failed to add case.",
          });
        }
      },
    ],
    caseId as string
  );
  const [observationResponse, refreshObservation, isLoadingObservation] =
    useAction(
      getallObservationPerCase,
      [
        true,
        (response) => {
          if (response) {
            addToast({
              title: "Success",
              description: "New observation has been added.",
            });
            refreshObservation();
          } else {
            addToast({
              title: "Error",
              description: "Failed to add observation.",
            });
          }
        },
      ],
      caseId as string
    );

  const [treatmentResponse, refreshTreatment, isLoadingTreatment] = useAction(
    getallTreatmentPerCase,
    [
      true,
      (response) => {
        if (response) {
          addToast({
            title: "Success",
            description: "New treatment has been added.",
          });
          refreshTreatment();
        } else {
          addToast({
            title: "Error",
            description: "Failed to add treatment.",
          });
        }
      },
    ],
    caseId as string
  );

  // Helper functions to extract the data we need from responses
  const getDiagnoses = () => {
    return diagnosisResponse?.map((item: any) => item.diagnosis) || [];
  };

  const getObservations = () => {
    return observationResponse?.map((item: any) => item.observation) || [];
  };

  const getTreatments = () => {
    return treatmentResponse?.map((item: any) => item.treatment) || [];
  };

  // Create diagnosis action hook
  const [createDiagnosisResponse, createDiagnosisAction, isCreatingDiagnosis] =
    useAction(createDiagnosis, [
      ,
      (response) => {
        if (response) {
          addToast({
            title: "Success",
            description: "Diagnosis created successfully.",
          });
          // Optionally refresh diagnoses here if needed
        } else {
          addToast({
            title: "Error",
            description: "Failed to create diagnosis.",
          });
        }
      },
    ]);

  // Delete diagnosis action hook
  const [deleteDiagnosisResponse, deleteDiagnosisAction, isDeletingDiagnosis] =
    useAction(deleteDiagnosis, [
      ,
      (response) => {
        if (response) {
          addToast({
            title: "Success",
            description: "Diagnosis deleted successfully.",
          });
          // Optionally refresh diagnoses here if needed
        } else {
          addToast({
            title: "Error",
            description: "Failed to delete diagnosis.",
          });
        }
      },
    ]);

  // Create observation action hook
  const [
    createObservationResponse,
    createObservationAction,
    isCreatingObservation,
  ] = useAction(createObservation, [
    ,
    (response) => {
      if (response) {
        addToast({
          title: "Success",
          description: "Observation created successfully.",
        });
        // Optionally refresh observations here if needed
      } else {
        addToast({
          title: "Error",
          description: "Failed to create observation.",
        });
      }
    },
  ]);

  // Delete observation action hook
  const [
    deleteObservationResponse,
    deleteObservationAction,
    isDeletingObservation,
  ] = useAction(deleteObservation, [
    ,
    (response) => {
      if (response) {
        addToast({
          title: "Success",
          description: "Observation deleted successfully.",
        });
        // Optionally refresh observations here if needed
      } else {
        addToast({
          title: "Error",
          description: "Failed to delete observation.",
        });
      }
    },
  ]);

  const handleAddDiagnosis = (item: string) => {
    setDiagnoses([...diagnoses, item]);
    createDiagnosisAction(caseId as string, item);
  };
  const handleDeleteDiagnosis = (indexToDelete: number) => {
    deleteDiagnosisAction(diagnoses[indexToDelete]);
    setDiagnoses(diagnoses.filter((_, index) => index !== indexToDelete));
  };

  const handleAddObservation = (item: string) => {
    setObservations([...observations, item]);
    createObservationAction(caseId as string, item);
  };
  const handleDeleteObservation = (indexToDelete: number) => {
    deleteObservationAction(observations[indexToDelete]);
    setObservations(observations.filter((_, index) => index !== indexToDelete));
  };

  // Create treatment action hook
  const [createTreatmentResponse, createTreatmentAction, isCreatingTreatment] =
    useAction(createTreatment, [
      ,
      (response) => {
        if (response) {
          addToast({
            title: "Success",
            description: "Treatment created successfully.",
          });
          // Optionally refresh treatments here if needed
        } else {
          addToast({
            title: "Error",
            description: "Failed to create treatment.",
          });
        }
      },
    ]);

  // Delete treatment action hook
  const [deleteTreatmentResponse, deleteTreatmentAction, isDeletingTreatment] =
    useAction(deleteTreatment, [
      ,
      (response) => {
        if (response) {
          addToast({
            title: "Success",
            description: "Treatment deleted successfully.",
          });
          // Optionally refresh treatments here if needed
        } else {
          addToast({
            title: "Error",
            description: "Failed to delete treatment.",
          });
        }
      },
    ]);

  const handleAddTreatment = (item: string) => {
    setTreatments([...treatments, item]);
    createTreatmentAction(caseId as string, item);
  };
  const handleDeleteTreatment = (indexToDelete: number) => {
    deleteTreatmentAction(treatments[indexToDelete]);
    setTreatments(treatments.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="rounded-xl p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-8 bg-secondary-500 rounded-sm" />
        <button
          type="button"
          className="text-primary-800 font-semibold text-lg"
          onClick={() => (window.location.href = "/en/case")}
          aria-label="Go back to case list"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-bold text-primary-800 tracking-tight">
          Case Details
        </h1>
        <span className="ml-auto text-sm text-primary-400 font-medium">
          Last updated: 2 hours ago
        </span>
        <span>change the Status</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-primary-50 rounded-lg border border-primary-200 shadow-sm flex flex-col gap-2">
          <div className="font-semibold text-primary-800">
            Student Name:{" "}
            <span className="font-normal text-primary-900">
              Fuad Abdurahman
            </span>
          </div>
          <div className="font-semibold text-primary-800">
            Type:{" "}
            <span className="font-normal text-primary-900">
              Psychiatric Evaluation
            </span>
          </div>
          <div className="font-semibold text-primary-800">
            Status: <span className="font-normal text-green-600">Solved</span>
          </div>
        </div>
      </div>
      <div className="bg-white/100 shadow-secondary-400 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <EditableSection
          title="diagnosis"
          items={diagnoses}
          onAddItem={handleAddDiagnosis}
          onDeleteItem={handleDeleteDiagnosis}
        />
        <EditableSection
          title="observation"
          items={observations}
          onAddItem={handleAddObservation}
          onDeleteItem={handleDeleteObservation}
        />
        <EditableSection
          title="treatment"
          items={treatments}
          onAddItem={handleAddTreatment}
          onDeleteItem={handleDeleteTreatment}
        />
      </div>
      <div className="h-20 gap-4"></div>
    </div>
  );
}

export default Page;
