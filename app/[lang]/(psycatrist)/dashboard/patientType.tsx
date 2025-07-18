"use client";
import React, { useState, useMemo } from "react";
import useAction from "@/hooks/useActions";
import CustomTable, { ColumnDef } from "@/components/custom-table";
import { Button } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

// --- Mock Actions (replace with your actual server actions) ---
// In a real app, these would be in separate files (e.g., @/actions/psycatrist/patientType.ts)
const mockPatientTypes = [
  { id: 1, type: "New Patient", description: "First time visit" },
  { id: 2, type: "Follow-up", description: "Returning for checkup" },
  { id: 3, type: "Emergency", description: "Urgent care needed" },
];

const getPatientTypes = async (
  search: string,
  page: number,
  pageSize: number
) => {
  console.log("Fetching...", { search, page, pageSize });
  let data = mockPatientTypes.filter(
    (pt) =>
      pt.type.toLowerCase().includes(search.toLowerCase()) ||
      pt.description.toLowerCase().includes(search.toLowerCase())
  );
  const totalRecords = data.length;
  data = data.slice((page - 1) * pageSize, page * pageSize);
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
  return { data, pagination: { totalRecords } };
};

const deletePatientType = async (id: string) => {
  console.log("Deleting...", id);
  const index = mockPatientTypes.findIndex((pt) => pt.id.toString() === id);
  if (index > -1) {
    mockPatientTypes.splice(index, 1);
    return { message: "Patient Type deleted successfully." };
  }
  return null;
};

const createPatientType = async (data: {
  type: string;
  description?: string;
}) => {
  console.log("Creating...", data);
  const newId = Math.max(0, ...mockPatientTypes.map((pt) => pt.id)) + 1;
  mockPatientTypes.push({
    id: newId,
    ...data,
    description: data.description || "",
  });
  return { message: "Patient Type created successfully." };
};

const updatePatientType = async (
  id: string,
  data: { type: string; description?: string }
) => {
  console.log("Updating...", id, data);
  const index = mockPatientTypes.findIndex((pt) => pt.id.toString() === id);
  if (index > -1) {
    mockPatientTypes[index] = { ...mockPatientTypes[index], ...data };
    return { message: "Patient Type updated successfully." };
  }
  return null;
};
// --- End of Mock Actions ---

// Zod schema for validation
const patientTypeSchema = z.object({
  type: z.string().min(3, { message: "Type must be at least 3 characters." }),
  description: z.string().optional(),
});

// Interface for a single patient type item
interface PatientTypeItem {
  id: string | number;
  key?: string | number;
  type: string;
  description?: string;
}

function PatientTypePage() {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<PatientTypeItem | null>(null);

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof patientTypeSchema>>({
    resolver: zodResolver(patientTypeSchema),
  });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [patientTypeData, refreshPatientTypes, isLoadingData] = useAction(
    getPatientTypes,
    [true, () => {}],
    search,
    page,
    pageSize
  );

  const [, executeDelete, isLoadingDelete] = useAction(deletePatientType, [
    ,
    (response) => {
      addToast({
        title: response ? "Success" : "Error",
        description: response?.message || "Failed to delete item.",
      });
      if (response) refreshPatientTypes();
    },
  ]);

  const [, executeCreate, isLoadingCreate] = useAction(createPatientType, [
    ,
    (response) => {
      addToast({
        title: response ? "Success" : "Error",
        description: response?.message || "Failed to create item.",
      });
      if (response) {
        setShowModal(false);
        reset();
        refreshPatientTypes();
      }
    },
  ]);

  const [, executeUpdate, isLoadingUpdate] = useAction(updatePatientType, [
    ,
    (response) => {
      addToast({
        title: response ? "Success" : "Error",
        description: response?.message || "Failed to update item.",
      });
      if (response) {
        setShowModal(false);
        reset();
        setEditItem(null);
        refreshPatientTypes();
      }
    },
  ]);

  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await executeDelete(id.toString());
    }
  };

  const handleEdit = (item: PatientTypeItem) => {
    setEditItem(item);
    setValue("type", item.type);
    setValue("description", item.description || "");
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditItem(null);
    reset();
    setShowModal(true);
  };

  const onSubmit = async (data: z.infer<typeof patientTypeSchema>) => {
    if (editItem) {
      executeUpdate(editItem.id.toString(), data);
    } else {
      executeCreate(data);
    }
  };

  const rows = useMemo(
    () =>
      (patientTypeData?.data || []).map((item) => ({
        ...item,
        key: item.id.toString(),
        id: item.id.toString(),
      })),
    [patientTypeData]
  );

  const columns: ColumnDef<PatientTypeItem>[] = [
    {
      key: "type",
      label: "Type",
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "actions",
      label: "Actions",
      renderCell: (item) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            color="primary"
            variant="flat"
            onPress={() => handleEdit(item as PatientTypeItem)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            color="danger"
            variant="flat"
            onPress={() => handleDelete(item.id)}
            isLoading={isLoadingDelete}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const isLoadingAction = isLoadingCreate || isLoadingUpdate;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Patient Types</h1>
        <Button color="primary" onPress={handleAdd}>
          Add Patient Type
        </Button>
      </div>
      <CustomTable
        columns={columns}
        rows={rows}
        totalRows={patientTypeData?.pagination.totalRecords || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        searchValue={search}
        onSearch={setSearch}
        isLoading={isLoadingData}
      />
      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editItem ? "Edit Patient Type" : "Add Patient Type"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <input
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Type Name"
                  {...register("type")}
                  disabled={isLoadingAction}
                />
                {errors.type && (
                  <span className="text-red-500 text-xs">
                    {errors.type.message}
                  </span>
                )}
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Description (Optional)"
                  {...register("description")}
                  rows={3}
                  disabled={isLoadingAction}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="ghost"
                  type="button"
                  onPress={() => setShowModal(false)}
                  disabled={isLoadingAction}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isLoadingAction}
                  disabled={isLoadingAction}
                >
                  {isLoadingAction && (
                    <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                  )}
                  {editItem ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientTypePage;
