"use client";
import React from "react";
import { Button } from "@heroui/react";
import { Input } from "@heroui/react";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const patientHistory = [
    {
      id: 1,
      name: "John Doe",
      problemType: "Anxiety",
      status: "solved",
      date: "2024-06-10",
      diagnosis: "Generalized Anxiety Disorder",
    },
    {
      id: 2,
      name: "Jane Smith",
      problemType: "Depression",
      status: "pending",
      date: "2024-06-12",
      diagnosis: "Major Depressive Disorder",
    },
    {
      id: 3,
      name: "Michael Brown",
      problemType: "Stress",
      status: "solved",
      date: "2024-06-14",
      diagnosis: "Acute Stress Reaction",
    },
    {
      id: 4,
      name: "Emily Johnson",
      problemType: "Bipolar",
      status: "pending",
      date: "2024-06-15",
      diagnosis: "Bipolar II Disorder",
    },
    {
      id: 5,
      name: "Chris Lee",
      problemType: "OCD",
      status: "solved",
      date: "2024-06-16",
      diagnosis: "Obsessive-Compulsive Disorder",
    },
    {
      id: 6,
      name: "Sara Kim",
      problemType: "PTSD",
      status: "pending",
      date: "2024-06-17",
      diagnosis: "Post-Traumatic Stress Disorder",
    },
    {
      id: 7,
      name: "David Wilson",
      problemType: "Phobia",
      status: "solved",
      date: "2024-06-18",
      diagnosis: "Social Phobia",
    },
    {
      id: 8,
      name: "Linda Martinez",
      problemType: "Eating Disorder",
      status: "pending",
      date: "2024-06-19",
      diagnosis: "Anorexia Nervosa",
    },
    {
      id: 9,
      name: "James Anderson",
      problemType: "ADHD",
      status: "solved",
      date: "2024-06-20",
      diagnosis: "Attention Deficit Hyperactivity Disorder",
    },
    {
      id: 10,
      name: "Patricia Thomas",
      problemType: "Schizophrenia",
      status: "pending",
      date: "2024-06-21",
      diagnosis: "Paranoid Schizophrenia",
    },
  ];
  return (
    <div>
      <div className="border-2 border-primary-500 rounded-xl p-4">
        <h1 className="text-2xl font-bold mb-4">Students</h1>
        <div className="grid grid-cols-2 justify-between items-center border-1 border-secondary-500 rounded-xl p-2 mb-4">
          <div className="gap-2 grid sm:grid-cols-1">
            <Input
              type="text"
              variant="bordered"
              placeholder="Search by name or ID"
              className="md:w-full text-primary-900 mb-2"
            />
            <select className="p-2 rounded border border-gray-300">
              <option value="">All</option>
              <option value="undergraduate">solved</option>
              <option value="postgraduate">pending</option>
              <option value="phd">not solved</option>
            </select>
          </div>
          <div className="justify-self-end">
            <Button
              color="primary"
              variant="solid"
              className="px-4 py-2 rounded"
              onClick={() => alert("Add New Student")}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 ">
        {patientHistory.map((patient) => (
          <div
            key={patient.id}
            className="border-2 border-primary-500 rounded-xl h-60 p-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold mb-1">{patient.name}</h2>
              <p className="text-sm text-primary-700 mb-1">
                <span className="font-medium">Problem:</span>{" "}
                {patient.problemType}
              </p>
              <p className="text-sm text-primary-700 mb-1">
                <span className="font-medium">Diagnosis:</span>{" "}
                {patient.diagnosis}
              </p>
              <p className="text-sm text-primary-700 mb-1">
                <span className="font-medium">Date:</span> {patient.date}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                  patient.status === "solved"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {patient.status}
              </span>
              <Button
                color="secondary"
                variant="bordered"
                className="ml-2"
                onClick={() => router.push(`/en/case/${patient.id}`)}
              >
                Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;
