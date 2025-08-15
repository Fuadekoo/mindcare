"use client";
import React, { useState } from "react";
import CustomTable from "@/components/custom-table";
import useAction from "@/hooks/useActions";
import { getTrack } from "@/actions/psycatrist/track";

type ColumnDef = {
  key: string;
  label: string;
  renderCell?: (item: Record<string, string>) => React.ReactNode;
};

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

  const [trackResponse, , isLoading] = useAction(
    getTrack,
    [true, () => {}],
    search,
    page,
    pageSize
  );

  // Convert all row fields to string for CustomTable compatibility
  const rows =
    (trackResponse?.data || []).map((item) => ({
      key: String(item.id),
      id: String(item.id),
      name: item.name ?? "",
      totalGeneralCase:
        item.totalGeneralCase != null ? String(item.totalGeneralCase) : "0",
      totalProblems:
        item.totalProblems != null ? String(item.totalProblems) : "0",
      solved: item.solved != null ? String(item.solved) : "0",
      pending: item.pending != null ? String(item.pending) : "0",
      lastVisit: item.lastVisit ?? "",
    })) || [];

  const columns: ColumnDef[] = [
    {
      key: "autoId",
      label: "#",
      renderCell: (item) => {
        const rowIndexOnPage = rows.findIndex((r) => r.id === item.id);
        if (rowIndexOnPage !== -1) {
          return (page - 1) * pageSize + rowIndexOnPage + 1;
        }
        return item.id;
      },
    },
    {
      key: "id",
      label: "Student ID",
      renderCell: (item) => item.id,
    },
    {
      key: "name",
      label: "Name",
      renderCell: (item) => item.name,
    },
    {
      key: "totalGeneralCase",
      label: "Total General Cases",
      renderCell: (item) => item.totalGeneralCase,
    },
    {
      key: "totalProblems",
      label: "Total Cases",
      renderCell: (item) => item.totalProblems,
    },
    {
      key: "pending",
      label: "Pending Cases",
      renderCell: (item) => item.pending,
    },
    {
      key: "progress",
      label: "Progress (Solved)",
      renderCell: (item) => (
        <ProgressCell
          solved={Number(item.solved)}
          total={Number(item.totalProblems)}
        />
      ),
    },
    {
      key: "lastVisit",
      label: "Last Visit",
      renderCell: (item) =>
        item.lastVisit ? new Date(item.lastVisit).toLocaleDateString() : "N/A",
    },
  ];

  // Handle loading state
  if (isLoading && !trackResponse?.data && page === 1) {
    return (
      <div className="flex justify-center items-center h-full p-4">
        <div>Loading student tracking...</div>
      </div>
    );
  }

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
        totalRows={trackResponse?.pagination?.totalRecords || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          setPage(1);
        }}
        searchValue={search}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        isLoading={isLoading}
      />
    </div>
  );
}

export default Page;
