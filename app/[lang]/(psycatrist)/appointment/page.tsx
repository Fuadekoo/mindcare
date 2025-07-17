"use client";
import CustomTable from "@/components/custom-table";
import React from "react";
import { Plus, Check, X, Trash2, Search } from "lucide-react";

// Sample data for appointments
const sampleAppointments = [
  {
    id: 1,
    studentName: "John Doe",
    date: "2024-06-10T09:00:00Z",
    time: "09:00 AM",
    status: "pending",
    createdAt: "2024-06-01T10:00:00Z",
  },
  {
    id: 2,
    studentName: "Alice Johnson",
    date: "2024-06-11T11:30:00Z",
    time: "11:30 AM",
    status: "confirmed",
    createdAt: "2024-06-02T11:30:00Z",
  },
  {
    id: 3,
    studentName: "Bob Smith",
    date: "2024-06-12T14:15:00Z",
    time: "02:15 PM",
    status: "cancelled",
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
  const filteredRows = sampleAppointments.filter((appointment) =>
    appointment.studentName.toLowerCase().includes(search.toLowerCase())
  );

  const rows = filteredRows.map((appointment) => ({
    ...Object.fromEntries(
      Object.entries(appointment).map(([k, v]) => [
        k,
        v === undefined || v === null ? "" : v.toString(),
      ])
    ),
    key: appointment.id?.toString(),
    id: appointment.id?.toString(),
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
      key: "studentName",
      label: "Student Name",
      renderCell: (item) => item.studentName,
    },
    {
      key: "date",
      label: "Date",
      renderCell: (item) =>
        item.date ? new Date(item.date).toLocaleDateString() : "N/A",
    },
    {
      key: "time",
      label: "Time",
      renderCell: (item) => item.time,
    },
    {
      key: "status",
      label: "Status",
      renderCell: (item) => {
        let color = "gray";
        if (item.status === "confirmed") color = "green";
        else if (item.status === "pending") color = "yellow";
        else if (item.status === "cancelled") color = "red";
        return (
          <span className={`px-2 py-1 rounded text-white bg-${color}-500`}>
            {item.status}
          </span>
        );
      },
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
            onClick={() => alert(`Edit appointment for ${item.studentName}`)}
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
              alert(`Delete appointment for ${item.studentName}`);
            }}
            disabled={isLoadingDelete}
          >
            {isLoadingDelete ? "Deleting..." : <Trash2 size={16} />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
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
