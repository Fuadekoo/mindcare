"use client";
import CustomTable from "@/components/custom-table";
import React from "react";

// Sample data for students
const sampleStudents = [
  {
    id: 1,
    cname: "John Doe",
    createdAt: "2024-06-01T10:00:00Z",
  },
  {
    id: 2,
    cname: "Jane Smith",
    createdAt: "2024-06-02T11:30:00Z",
  },
  {
    id: 3,
    cname: "Alice Johnson",
    createdAt: "2024-06-03T09:15:00Z",
  },
];

type ColumnDef = {
  key: string;
  label: string;
  renderCell: (item: any) => React.ReactNode;
};

function Page() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [isLoadingDelete, setIsLoadingDelete] = React.useState(false);

  // Filtered rows based on search
  const filteredRows = sampleStudents.filter((student) =>
    student.cname.toLowerCase().includes(search.toLowerCase())
  );

  const rows = filteredRows.map((student) => ({
    ...Object.fromEntries(
      Object.entries(student).map(([k, v]) => [
        k,
        v === undefined || v === null ? "" : v.toString(),
      ])
    ),
    key: student.id?.toString(),
    id: student.id?.toString(),
  }));

  const columns: ColumnDef[] = [
    {
      key: "autoId",
      label: "#",
      renderCell: (item) => {
        const rowIndexOnPage = rows.findIndex((r) => r.id === item.id);
        if (rowIndexOnPage !== -1) {
          return (page - 1) * pageSize + rowIndexOnPage + 1;
        }
        return item.id?.toString().slice(0, 5) + "...";
      },
    },
    {
      key: "cname",
      label: "Student Name",
      renderCell: (item) => item.cname,
    },
    {
      key: "createdAt",
      label: "Created At",
      renderCell: (item) =>
        item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
    },
    {
      key: "actions",
      label: "Actions",
      renderCell: (item) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-2 py-1 bg-blue-500 text-white rounded"
            onClick={() => alert(`Edit student ${item.cname}`)}
            disabled={isLoadingDelete}
          >
            Edit
          </button>
          <button
            type="button"
            className="px-2 py-1 bg-red-500 text-white rounded"
            onClick={() => {
              setIsLoadingDelete(true);
              setTimeout(() => setIsLoadingDelete(false), 1000);
              alert(`Delete student ${item.cname}`);
            }}
            disabled={isLoadingDelete}
          >
            {isLoadingDelete ? "Deleting..." : "Delete"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800">Students Data</h1>
      <CustomTable
        columns={columns}
        rows={rows}
        totalRows={filteredRows.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        searchValue={search}
        onSearch={setSearch}
        isLoading={false}
      />
    </div>
  );
}

export default Page;
