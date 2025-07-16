"use client";
import React, { useState } from "react";
import { Input } from "@heroui/react";
import { Textarea } from "@heroui/react";
import { Button } from "@heroui/react";
import { Select } from "@heroui/react";

function EditableSection({
  title,
  items,
  onAddItem,
}: {
  title: string;
  items: string[];
  onAddItem: (item: string) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddItem(inputValue);
      setInputValue(""); // Clear input after submission
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
            className="p-3 bg-primary-50 border border-primary-200 rounded-lg shadow-sm text-primary-900"
          >
            {item}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Add ${title}... (Press Enter)`}
          className="w-full p-2 bg-transparent border-b-2 border-primary-300 focus:border-secondary-500 focus:outline-none transition-colors"
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

  const handleAddObservation = (item: string) => {
    setObservations([...observations, item]);
  };

  const handleAddTreatment = (item: string) => {
    setTreatments([...treatments, item]);
  };
  return (
    <div className="border-2 border-primary-500 rounded-xl p-4">
      <h1>Details about the case will be displayed here</h1>
      <div>
        <Input
          type="text"
          variant="bordered"
          placeholder="Search by name or ID"
          className="md:w-full text-primary-900 mb-2"
        />
        <div>type</div>
        <div>status</div>
      </div>
      <div className="border-2 border-primary-400 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <EditableSection
          title="diagnosis"
          items={diagnoses}
          onAddItem={handleAddDiagnosis}
        />
        <EditableSection
          title="observation"
          items={observations}
          onAddItem={handleAddObservation}
        />
        <EditableSection
          title="treatment"
          items={treatments}
          onAddItem={handleAddTreatment}
        />
      </div>
    </div>
  );
}

export default Page;
