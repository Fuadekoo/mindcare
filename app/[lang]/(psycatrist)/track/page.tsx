"use client";
import React, { useState } from "react";
import CustomTable from "@/components/custom-table";

const rows = [
  {
    id: 1,
    name: "John Doe",
    totalProblems: 5,
    solved: 3,
    pending: 2,
    lastVisit: "2024-06-10",
  },
  {
    id: 2,
    name: "Jane Smith",
    totalProblems: 8,
    solved: 5,
    pending: 3,
    lastVisit: "2024-06-12",
  },
  {
    id: 3,
    name: "Alice Johnson",
    totalProblems: 2,
    solved: 1,
    pending: 1,
    lastVisit: "2024-06-15",
  },
  {
    id: 4,
    name: "Bob Brown",
    totalProblems: 6,
    solved: 4,
    pending: 2,
    lastVisit: "2024-06-20",
  },
  {
    id: 5,
    name: "Charlie Black",
    totalProblems: 7,
    solved: 6,
    pending: 1,
    lastVisit: "2024-07-01",
  },
  {
    id: 6,
    name: "Diana Prince",
    totalProblems: 4,
    solved: 2,
    pending: 2,
    lastVisit: "2024-07-02",
  },
  {
    id: 7,
    name: "Ethan Hunt",
    totalProblems: 3,
    solved: 1,
    pending: 2,
    lastVisit: "2024-07-03",
  },
  {
    id: 8,
    name: "Fiona Gallagher",
    totalProblems: 9,
    solved: 7,
    pending: 2,
    lastVisit: "2024-07-04",
  },
  {
    id: 9,
    name: "George Costanza",
    totalProblems: 1,
    solved: 0,
    pending: 1,
    lastVisit: "2024-07-05",
  },
  {
    id: 10,
    name: "Hannah Montana",
    totalProblems: 10,
    solved: 8,
    pending: 2,
    lastVisit: "2024-07-06",
  },
  {
    id: 11,
    name: "Ivy League",
    totalProblems: 3,
    solved: 2,
    pending: 1,
    lastVisit: "2024-07-04",
  },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "totalProblems", label: "Total Problems" },
  { key: "solved", label: "Solved" },
  { key: "pending", label: "Pending" },
  { key: "lastVisit", label: "Last Visit" },
];

function Page() {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);

  // Filter by search
  const filtered = rows.filter((row) =>
    row.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalRows = filtered.length;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Simulate loading state if needed
  const isLoadingData = false;

  return (
    <div>
      <CustomTable
        columns={columns}
        rows={paginated}
        totalRows={totalRows}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        searchValue={search}
        onSearch={setSearch}
        isLoading={isLoadingData}
      />
    </div>
  );
}

export default Page;
