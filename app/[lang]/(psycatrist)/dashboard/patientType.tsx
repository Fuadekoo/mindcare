"use client";
import React, { useState } from "react";
import useAction from "@/hooks/useActions";
import CustomTable from "@/components/custom-table";
import { Button } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  getPatientTypeData,
  deletePatientType,
  createPatientType,
  updatePatientType,
} from "@/actions/psycatrist/dashboard";

type ColumnDef = {
  key: string;
  label: string;
  renderCell?: (item: Record<string, string>) => React.ReactNode;
};

const patientTypeSchema = z.object({
  type: z.string().min(3, { message: "Type must be at least 3 characters." }),
  description: z.string().optional(),
});

function PatientTypePage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<string | null>(null);

  // Fetch data from server
  const [patientTypeData, refreshPatientTypes, isLoadingData] = useAction(
    getPatientTypeData,
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

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof patientTypeSchema>>({
    resolver: zodResolver(patientTypeSchema),
  });

  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await executeDelete(id.toString());
    }
  };

  interface PatientTypeItem {
    id: string;
    type: string;
    description?: string;
    [key: string]: string | undefined;
  }

  interface HandleEditProps {
    type: string;
    description?: string;
    id: string;
    [key: string]: string | undefined;
  }

  const handleEdit = (item: HandleEditProps): void => {
    setEditItem(item.id);
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
      executeUpdate(editItem, data);
    } else {
      executeCreate(data);
    }
  };

  // Convert all row fields to string for CustomTable compatibility
  const rows =
    (patientTypeData?.data || []).map((item) => ({
      key: String(item.id),
      id: String(item.id),
      type: item.type ?? "",
      description: item.description ?? "",
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
      key: "type",
      label: "Type",
      renderCell: (item) => item.type,
    },
    {
      key: "description",
      label: "Description",
      renderCell: (item) => item.description,
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

  // Handle loading state
  if (isLoadingData && !patientTypeData?.data && page === 1) {
    return (
      <div className="flex justify-center items-center h-full p-4">
        <div>Loading patient types...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Patient Types</h1>
        <Button color="primary" onPress={handleAdd}>
          Add Patient Type
        </Button>
      </div>
      <CustomTable
        columns={columns}
        rows={rows}
        totalRows={patientTypeData?.pagination?.totalRecords || 0}
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
