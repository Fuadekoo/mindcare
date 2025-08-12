"use client";
import React, { useState, useMemo } from "react";
import { Textarea } from "@heroui/react";
import { ArrowLeft, X, ToggleLeft, ToggleRight, Check } from "lucide-react";
import { Loader2 } from "lucide-react";
import useAction from "@/hooks/useActions";
import { addToast } from "@heroui/toast";
import { useParams } from "next/navigation";
import {
  caseDetails,
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
  lastCaseUpdate,
} from "@/actions/psycatrist/case";

type SectionItem = {
  id: string;
  createdAt: string; // Changed from Date to string for display
  description: string;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}
const toastSuccess = (description: string, title = "Success") =>
  addToast({
    title,
    description,
    color: "success", // Use green for success
    variant: "solid",
    icon: <Check className="text-green-600" />, // Optional: add a green check icon
  });

const toastError = (description: string, title = "Error") =>
  addToast({
    title,
    description,
    color: "warning", // Use red for error
    variant: "solid",
    icon: <X className="text-red-600" />, // Optional: add a red X icon
  });

const handleActionCompletion = (
  response: { error?: string; message?: string } | null | undefined,
  successMessage: string,
  onSuccess?: () => void
) => {
  if (response && !response.error) {
    toastSuccess(response?.message || successMessage);
    onSuccess?.();
  } else {
    toastError(
      response?.error || response?.message || "An unexpected error occurred."
    );
  }
};

function EditableSection({
  title,
  items,
  onAddItem,
  onDeleteItem,
  isCreating,
  isDeleting,
}: {
  title: string;
  items: SectionItem[];
  onAddItem: (item: string) => void;
  onDeleteItem: (id: string) => void;
  isCreating: boolean;
  isDeleting: boolean;
}) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isCreating) {
      onAddItem(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 border-r-1 border-primary-300 flex flex-col">
      <h1 className="text-xl font-bold capitalize text-primary-700 mb-3 underline">
        {title}
      </h1>
      <ul className="space-y-2 mb-4 min-h-[150px] flex-grow">
        {items.map((item) => (
          <li
            key={item.id}
            className="relative p-3 bg-primary-50 border border-primary-200 rounded-lg shadow-sm text-primary-900 group"
          >
            <p className="whitespace-pre-wrap break-words pr-6">
              {item.description}
            </p>
            <p className="text-xs text-primary-400 mt-1">
              {formatDate(item.createdAt)}
            </p>
            <button
              onClick={() => onDeleteItem(item.id)}
              disabled={isDeleting}
              className="absolute top-2 right-2 text-primary-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              aria-label={`Delete ${title} item`}
            >
              <X size={16} />
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Add ${title}... (Enter to save)`}
            className="w-full p-2 bg-transparent border-b-2 border-primary-300 focus:border-secondary-500 focus:outline-none transition-colors"
            rows={2}
            disabled={isCreating}
          />
          {isCreating && (
            <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-primary-500" />
          )}
        </div>
      </form>
    </div>
  );
}

function Page() {
  const { caseId } = useParams<{ caseId: string }>();

  // --- Data Fetching & Action Hooks ---

  const [caseDetailsResponse, refreshCaseDetails, isLoadingCaseDetails] =
    useAction(
      caseDetails,
      [
        true,
        (res) => {
          res ? undefined : toastError("Failed to load case details.");
        },
      ],
      caseId as string
    );

  const [, actionStatus, isLoadingStatus] = useAction(changeCaseStatus, [
    ,
    (res) => {
      handleActionCompletion(
        res,
        "Case status updated successfully.",
        refreshCaseDetails
      );
    },
  ]);

  const [diagnosisResponse, refreshDiagnosis] = useAction(
    getallDiagnosisPerCase,
    [
      true,
      (res) => {
        res ? undefined : toastError("Failed to load diagnoses.");
      },
    ],
    caseId as string
  );

  const [observationResponse, refreshObservation] = useAction(
    getallObservationPerCase,
    [
      true,
      (res) => {
        res ? undefined : toastError("Failed to load observations.");
      },
    ],
    caseId as string
  );

  const [treatmentResponse, refreshTreatment] = useAction(
    getallTreatmentPerCase,
    [
      true,
      (res) => {
        res ? undefined : toastError("Failed to load treatments.");
      },
    ],
    caseId as string
  );

  // Action hooks
  const [, createDiagnosisAction, isCreatingDiagnosis] = useAction(
    createDiagnosis,
    [
      ,
      (res) => {
        handleActionCompletion(
          res,
          res?.message || "Diagnosis created successfully.",
          refreshDiagnosis
        );
      },
    ]
  );

  const [, deleteDiagnosisAction, isDeletingDiagnosis] = useAction(
    deleteDiagnosis,
    [
      ,
      (res) => {
        handleActionCompletion(
          res,
          res?.message || "Diagnosis deleted successfully.",
          refreshDiagnosis
        );
      },
    ]
  );

  const [, createObservationAction, isCreatingObservation] = useAction(
    createObservation,
    [
      ,
      (res) => {
        handleActionCompletion(
          res,
          res?.message || "Observation created successfully.",
          refreshObservation
        );
      },
    ]
  );

  const [, deleteObservationAction, isDeletingObservation] = useAction(
    deleteObservation,
    [
      ,
      (res) => {
        handleActionCompletion(
          res,
          res?.message || "Observation deleted successfully.",
          refreshObservation
        );
      },
    ]
  );

  const [, createTreatmentAction, isCreatingTreatment] = useAction(
    createTreatment,
    [
      ,
      (res) => {
        handleActionCompletion(
          res,
          res?.message || "Treatment created successfully.",
          refreshTreatment
        );
      },
    ]
  );

  const [, deleteTreatmentAction, isDeletingTreatment] = useAction(
    deleteTreatment,
    [
      ,
      (res) => {
        handleActionCompletion(
          res,
          res?.message || "Treatment deleted successfully.",
          refreshTreatment
        );
      },
    ]
  );

  const [lastUpdate, refreshLastUpdate, isLoadingLastUpdate] = useAction(
    lastCaseUpdate,
    [
      true,
      (res) => {
        console.log("lasted update1", res);
        if (!res) {
          toastError("Failed to load last update.");
        }
      },
    ],
    caseId
  );

  // Memoized data transformation
  const diagnosesItems = useMemo(() => {
    return (
      diagnosisResponse?.map((item) => ({
        id: item.id,
        description: item.description,
        createdAt:
          typeof item.createdAt === "string"
            ? item.createdAt
            : item.createdAt.toISOString(),
      })) || []
    );
  }, [diagnosisResponse]);

  const observationsItems = useMemo(() => {
    return (
      observationResponse?.map((item) => ({
        id: item.id,
        description: item.description,
        createdAt:
          typeof item.createdAt === "string"
            ? item.createdAt
            : item.createdAt.toISOString(),
      })) || []
    );
  }, [observationResponse]);

  const treatmentsItems = useMemo(() => {
    return (
      treatmentResponse?.map((item) => ({
        id: item.id,
        description: item.description,
        createdAt:
          typeof item.createdAt === "string"
            ? item.createdAt
            : item.createdAt.toISOString(),
      })) || []
    );
  }, [treatmentResponse]);

  return (
    <div className="rounded-xl p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-8 bg-secondary-500 rounded-sm" />
        <button
          type="button"
          className="text-primary-800 font-semibold text-lg"
          onClick={() => (window.location.href = "/en/generalCase")}
          aria-label="Go back to case list"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-bold text-primary-800 tracking-tight">
          Case Details
        </h1>
        <span className="ml-auto text-sm bg-red-300 text-primary-400 font-medium flex items-center gap-2">
          Last update:{" "}
          {isLoadingLastUpdate ? (
            <Loader2 className="animate-spin text-primary-500 ml-1" size={16} />
          ) : lastUpdate ? (
            <span>
              {new Date(
                typeof lastUpdate === "string" ? lastUpdate : lastUpdate
              ).toLocaleString()}
            </span>
          ) : (
            " No updates yet"
          )}
          <button
            type="button"
            className="ml-2 text-xs underline text-secondary-600"
            onClick={refreshLastUpdate}
            disabled={isLoadingLastUpdate}
            aria-label="Refresh last update"
          >
            Refresh
          </button>
        </span>
        <span>
          {isLoadingStatus ? (
            <Loader2 className="animate-spin text-primary-500 inline-block mr-2" />
          ) : caseDetailsResponse?.solved ? (
            <>
              <Check className="text-green-600 inline-block mr-2" />
              <ToggleRight className="text-green-600 inline-block mr-2" />
              <button
                type="button"
                className="text-primary-400 hover:text-red-600"
                onClick={() => actionStatus(caseId as string, false)}
                aria-label="Mark as unsolved"
                disabled={isLoadingStatus}
              >
                Mark as Unsolved
              </button>
            </>
          ) : (
            <>
              <X className="text-red-600 inline-block mr-2" />
              <ToggleLeft className="text-yellow-600 inline-block mr-2" />
              <button
                type="button"
                className="text-primary-400 hover:text-green-600"
                onClick={() => actionStatus(caseId as string, true)}
                aria-label="Mark as solved"
                disabled={isLoadingStatus}
              >
                Mark as Solved
              </button>
            </>
          )}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-primary-50 rounded-lg border border-primary-200 shadow-sm flex flex-col gap-2">
          {isLoadingCaseDetails ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="animate-spin text-primary-500" />
            </div>
          ) : caseDetailsResponse ? (
            <>
              <div className="font-semibold text-primary-800">
                Student Name:{" "}
                <span className="font-normal text-primary-900">
                  {caseDetailsResponse.student.name}
                </span>
              </div>
              <div className="font-semibold text-primary-800">
                Type:{" "}
                <span className="font-normal text-primary-900">
                  {caseDetailsResponse.patientData.type || "N/A"}
                </span>
              </div>
              <div className="font-semibold text-primary-800">
                Status:{" "}
                <span
                  className={`font-normal ${
                    caseDetailsResponse.solved
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {caseDetailsResponse.solved ? "Yes" : "No"}
                </span>
              </div>
              <button
                type="button"
                className="mt-2 text-sm text-secondary-600 underline"
                onClick={refreshCaseDetails}
              >
                Refresh
              </button>
            </>
          ) : (
            <div className="text-red-600">Failed to load case details.</div>
          )}
        </div>
      </div>
      <div className="bg-white/100 shadow-secondary-400 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <EditableSection
          title="History"
          items={diagnosesItems}
          onAddItem={(text) => createDiagnosisAction(caseId as string, text)}
          onDeleteItem={(id) => deleteDiagnosisAction(id)}
          isCreating={isCreatingDiagnosis}
          isDeleting={isDeletingDiagnosis}
        />
        <EditableSection
          title="Diagnosis"
          items={observationsItems}
          onAddItem={(text) => createObservationAction(caseId as string, text)}
          onDeleteItem={(id) => deleteObservationAction(id)}
          isCreating={isCreatingObservation}
          isDeleting={isDeletingObservation}
        />
        <EditableSection
          title="treatment"
          items={treatmentsItems}
          onAddItem={(text) => createTreatmentAction(caseId as string, text)}
          onDeleteItem={(id) => deleteTreatmentAction(id)}
          isCreating={isCreatingTreatment}
          isDeleting={isDeletingTreatment}
        />
      </div>
      <div className="h-20 gap-4"></div>
    </div>
  );
}

export default Page;
