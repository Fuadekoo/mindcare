"use client";
import React from "react";
import CustomTable from "@/components/custom-table";
const types = [
  { id: 1, type: "New Patient", description: "First time visit" },
  { id: 2, type: "Follow-up", description: "Returning for checkup" },
  { id: 3, type: "Emergency", description: "Urgent care needed" },
];
interface PatientTypeItem {
  id: number;
  type: string;
  description: string;
}

interface TableRow {
  key: string;
  id: string;
  type: string;
  description: string;
}

interface Column {
  key: string;
  label: string;
  renderCell: (item: Record<string, any>) => React.ReactNode;
}

const columns: Column[] = [
  {
    key: "autoId",
    label: "#",
    renderCell: (item) => item.id,
  },
  {
    key: "type",
    label: "Type",
    renderCell: (item) => item.type,
  },
  {
    key: "description",
    label: "Description",
    renderCell: (item) => item.description,
  },
];

const rows: TableRow[] = types.map((type) => ({
  key: type.id.toString(),
  id: type.id.toString(),
  type: type.type,
  description: type.description,
}));

function PatientType() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");

  const filteredRows = rows.filter(
    (row) =>
      row.type.toLowerCase().includes(search.toLowerCase()) ||
      row.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Patient Types</h1>
      <CustomTable
        columns={columns}
        rows={filteredRows}
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

export default PatientType;
