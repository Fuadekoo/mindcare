"use client";
import React, { useState } from "react";
import { Textarea } from "@heroui/react";
import { ArrowLeft, X } from "lucide-react";

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

  const handleAddDiagnosis = (item: string) => {
    setDiagnoses([...diagnoses, item]);
  };
  const handleDeleteDiagnosis = (indexToDelete: number) => {
    setDiagnoses(diagnoses.filter((_, index) => index !== indexToDelete));
  };

  const handleAddObservation = (item: string) => {
    setObservations([...observations, item]);
  };
  const handleDeleteObservation = (indexToDelete: number) => {
    setObservations(observations.filter((_, index) => index !== indexToDelete));
  };

  const handleAddTreatment = (item: string) => {
    setTreatments([...treatments, item]);
  };
  const handleDeleteTreatment = (indexToDelete: number) => {
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
