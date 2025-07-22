"use client";
import CustomTable from "@/components/custom-table";
import React from "react";
// import { Plus, Check, X, Trash2, Search } from "lucide-react";
import useAction from "@/hooks/useActions";
import { getStudents } from "@/actions/psycatrist/students";

type StudentRow = {
  [key: string]: string | undefined;
  key: string;
  id: string;
  name?: string | undefined;
  // wdt_ID?: number | null | undefined;
  // passcode?: string | null;
  // phoneno?: string | null;
  // country?: string | null;
  // status?: string | null;
  // isKid?: boolean  | null;
  ustaz?: string;
  subject?: string;
  package?: string;
  chat_id?: string;
  u_control?: string;
  createdAt?: string;
};

type ColumnDef = {
  key: string;
  label: string;
  renderCell: (item: StudentRow) => React.ReactNode;
};

function Page() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  // const [isLoadingDelete, setIsLoadingDelete] = React.useState(false);
  const [studentsData] = useAction(
    getStudents,
    [true, () => {}],
    search,
    page,
    pageSize
  );

  // Filtered rows based on search
  const filteredRows =
    studentsData && Array.isArray(studentsData.data)
      ? studentsData.data.filter((student) =>
          (student.name ?? "").toLowerCase().includes(search.toLowerCase())
        )
      : [];

  const rows = filteredRows.map((student: Record<string, any>) => ({
    ...Object.fromEntries(
      Object.entries(student).map(([k, v]) => [
        k,
        v === undefined || v === null ? "" : v.toString(),
      ])
    ),
    key: student.wdt_ID?.toString(),
    id: student.wdt_ID?.toString(),
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
      key: "name",
      label: "Student Name",
      renderCell: (item) => item.name,
    },
    {
      key: "wdt_ID",
      label: "ID",
      renderCell: (item) => item.wdt_ID,
    },
    {
      key: "passcode",
      label: "Passcode",
      renderCell: (item) => item.passcode,
    },
    {
      key: "phoneno",
      label: "Phone No",
      renderCell: (item) => item.phoneno,
    },
    {
      key: "country",
      label: "Country",
      renderCell: (item) => item.country,
    },
    {
      key: "status",
      label: "Status",
      renderCell: (item) => item.status,
    },
    {
      key: "isKid",
      label: "Is Kid",
      renderCell: (item) => (item.isKid ? "Yes" : "No"),
    },
    {
      key: "ustaz",
      label: "Ustaz",
      renderCell: (item) => item.ustaz,
    },
    {
      key: "subject",
      label: "Subject",
      renderCell: (item) => item.subject,
    },
    {
      key: "package",
      label: "Package",
      renderCell: (item) => item.package,
    },
    {
      key: "chat_id",
      label: "Chat ID",
      renderCell: (item) => item.chat_id,
    },
    {
      key: "u_control",
      label: "U Control",
      renderCell: (item) => item.u_control,
    },
    {
      key: "createdAt",
      label: "Created At",
      renderCell: (item) =>
        item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
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
