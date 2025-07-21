"use client";
import React, { useState, useMemo } from "react";
import CustomTable, { ColumnDef } from "@/components/custom-table";
import { Button } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import Select from "react-select";
import useAction from "@/hooks/useActions";
import {
  changeAppointmentStatus,
  getAppointments,
  createAppointment,
  deleteAppointment,
  updateAppointment,
  studentName,
} from "@/actions/psycatrist/appointment";
import { appointmentSchema } from "@/lib/zodSchema";

// const appointmentSchema = z.object({
//   studentId: z.coerce.number().min(1, "Student ID is required."),
//   date: z.string().min(1, "Date is required."),
//   time: z.string().min(1, "Time is required."),
// });

interface Appointment {
  id: string;
  wdt_ID: number;
  student: {
    wdt_ID: number;
    name: string;
  };
  date: Date;
  time: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt: string;
}

function Page() {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  // Fetch appointments from backend
  const [appointments, refreshAppointments, isLoadingAppointments] = useAction(
    getAppointments,
    [true, () => {}],
    search,
    page,
    pageSize
  );
  const [, changeStatusAction, isChangingStatus] = useAction(
    changeAppointmentStatus,
    [, () => {}]
  );

  const [, createAction, isCreatingAppointment] = useAction(createAppointment, [
    ,
    () => {},
  ]);
  const [, deleteAction, isDeletingAppointment] = useAction(deleteAppointment, [
    ,
    () => {},
  ]);
  const [, updateAction, isUpdatingAppointment] = useAction(updateAppointment, [
    ,
    () => {},
  ]);

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema) as any,
  });

  const handleAdd = () => {
    setEditItem(null);
    reset({ studentId: 0, date: "", time: "" });
    setShowModal(true);
  };

  const handleEdit = (item: Appointment) => {
    setEditItem(item);
    setValue("studentId", item.student.wdt_ID);
    setValue("date", item.date.toISOString().split("T")[0]);
    setValue("time", item.time);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      setIsLoading(true);
      await deleteAction(id);
      addToast({ title: "Success", description: "Appointment deleted." });
      setIsLoading(false);
      refreshAppointments();
    }
  };

  const handleChangeStatus = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to change the status of this appointment?"
      )
    ) {
      return;
    }
    setIsLoading(true);
    await changeStatusAction(id);
    setIsLoading(false);
    refreshAppointments();
  };

  const onSubmit = async (data: z.infer<typeof appointmentSchema>) => {
    setIsLoading(true);
    if (editItem) {
      await updateAction(editItem.id, {
        studentId: data.studentId,
        date: new Date(data.date),
        time: data.time,
      });
      addToast({ title: "Success", description: "Appointment updated." });
    } else {
      await createAction({
        studentId: data.studentId,
        date: new Date(data.date),
        time: data.time,
      });
      addToast({ title: "Success", description: "Appointment created." });
    }
    setIsLoading(false);
    setShowModal(false);
    reset();
    refreshAppointments();
  };
  const filteredRows =
    appointments && Array.isArray(appointments.data)
      ? appointments.data.filter((appointment) =>
          appointment.id.toString().toLowerCase().includes(search.toLowerCase())
        )
      : [];
  const columns: ColumnDef<Appointment>[] = [
    {
      key: "autoId",
      label: "#",
      renderCell: (item) => {
        const rowIndexOnPage = filteredRows.findIndex((r) => r.id === item.id);
        if (rowIndexOnPage !== -1) {
          return (page - 1) * pageSize + rowIndexOnPage + 1;
        }
        return item.id?.toString().slice(0, 5) + "...";
      },
    },
    {
      key: "student",
      label: "Student",
      renderCell: (item) => (
        <span>
          {item.student.wdt_ID} - {item.student.name}
        </span>
      ),
    },
    {
      key: "date",
      label: "Date",
      renderCell: (item) => new Date(item.date).toLocaleDateString(),
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
        const statusStyles = {
          Confirmed: "bg-green-100 text-green-800",
          Pending: "bg-yellow-100 text-yellow-800",
          Cancelled: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              statusStyles[item.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {item.status}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      label: "Created At",
      renderCell: (item) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      key: "changeStatus",
      label: "Change Status",
      renderCell: (item) => (
        <Button
          size="sm"
          color="primary"
          variant="flat"
          onPress={() => handleChangeStatus(item.id)}
          isLoading={isLoading && isChangingStatus}
        >
          Confirm
        </Button>
      ),
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
            onPress={() => handleEdit(item)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            color="danger"
            variant="flat"
            onPress={() => handleDelete(item.id)}
            isLoading={isLoading && isDeletingAppointment}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  // Pagination logic for table rows
  const paginatedRows = filteredRows.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
        <Button color="primary" onPress={handleAdd}>
          <Plus size={20} className="mr-2" />
          Add Appointment
        </Button>
      </div>
      <CustomTable
        columns={columns}
        rows={paginatedRows}
        totalRows={filteredRows.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        searchValue={search}
        onSearch={setSearch}
        isLoading={isLoadingAppointments}
      />

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editItem ? "Edit Appointment" : "Add Appointment"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <div>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Student ID"
                    type="number"
                    {...register("studentId")}
                    disabled={isLoading}
                  />
                  {errors.studentId && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.studentId.message}
                    </span>
                  )}
                </div>
                <div>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    {...register("date")}
                    disabled={isLoading}
                  />
                  {errors.date && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.date.message}
                    </span>
                  )}
                </div>
                <div>
                  <input
                    type="time"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    {...register("time")}
                    disabled={isLoading}
                  />
                  {errors.time && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.time.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="ghost"
                  type="button"
                  onPress={() => setShowModal(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading && (
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

export default Page;
