"use client";
import React, { useState } from "react";
import CustomTable, { ColumnDef } from "@/components/custom-table";
import { getTrack } from "@/actions/psycatrist/track";
import useAction from "@/hooks/useActions";

// Define the structure of a row in our table
interface TrackRow {
  id: number;
  name: string;
  totalProblems: number;
  solved: number;
  pending: number;
  lastVisit: string | null;
}

// Component to render a progress bar for solved/pending cases
const ProgressCell = ({ solved, total }: { solved: number; total: number }) => {
  if (total === 0) {
    return <div className="text-gray-500">No Cases</div>;
  }
  const percentage = Math.round((solved / total) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-green-500 h-2.5 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-sm font-medium text-gray-700">{percentage}%</span>
    </div>
  );
};

function Page() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  // Fetch data using the useAction hook
  const [trackResponse, , isLoading] = useAction(
    getTrack,
    [true, () => {}],
    search,
    page,
    pageSize
  );

  // Define columns for the custom table
  const columns: ColumnDef<TrackRow>[] = [
    {
      key: "id",
      label: "Student ID",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "totalProblems",
      label: "Total Cases",
    },
    {
      key: "pending",
      label: "Pending Cases",
    },
    {
      key: "progress",
      label: "Progress (Solved)",
      renderCell: (item) => (
        <ProgressCell solved={item.solved} total={item.totalProblems} />
      ),
    },
    {
      key: "lastVisit",
      label: "Last Visit",
      renderCell: (item) =>
        item.lastVisit ? new Date(item.lastVisit).toLocaleDateString() : "N/A",
    },
  ];

  const rows = trackResponse?.data || [];
  const totalRows = trackResponse?.pagination?.totalRecords || 0;

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Tracking</h1>
        <p className="text-gray-500 mt-1">
          Overview of student cases and progress.
        </p>
      </div>
      <CustomTable
        columns={columns}
        rows={rows}
        totalRows={totalRows}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        searchValue={search}
        onSearch={setSearch}
        isLoading={isLoading}
      />
    </div>
  );
}

export default Page;
