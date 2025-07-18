"use client";
import React, { useState, useMemo } from "react";
import CustomTable, { ColumnDef } from "@/components/custom-table";
import { Button } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";

// Zod schema for validation
const appointmentSchema = z.object({
  studentName: z.string().min(3, "Student name is required."),
  date: z.string().min(1, "Date is required."),
  time: z.string().min(1, "Time is required."),
});

// Interface for appointment data
interface Appointment {
  id: number;
  studentName: string;
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt: string;
}

// Sample data - will be managed in state
const sampleAppointments: Appointment[] = [
  {
    id: 1,
    studentName: "John Doe",
    date: "2024-06-10",
    time: "09:00",
    status: "Pending",
    createdAt: "2024-06-01T10:00:00Z",
  },
  {
    id: 2,
    studentName: "Alice Johnson",
    date: "2024-06-11",
    time: "11:30",
    status: "Confirmed",
    createdAt: "2024-06-02T11:30:00Z",
  },
  {
    id: 3,
    studentName: "Bob Smith",
    date: "2024-06-12",
    time: "14:15",
    status: "Cancelled",
    createdAt: "2024-06-03T09:15:00Z",
  },
];

function Page() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(sampleAppointments);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
  });

  const handleAdd = () => {
    setEditItem(null);
    reset({ studentName: "", date: "", time: "" });
    setShowModal(true);
  };

  const handleEdit = (item: Appointment) => {
    setEditItem(item);
    setValue("studentName", item.studentName);
    setValue("date", item.date);
    setValue("time", item.time);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      setAppointments(appointments.filter((app) => app.id !== id));
      addToast({ title: "Success", description: "Appointment deleted." });
    }
  };

  const onSubmit = (data: z.infer<typeof appointmentSchema>) => {
    setIsLoading(true);
    setTimeout(() => {
      // Simulate API call
      if (editItem) {
        // Update existing appointment
        setAppointments(
          appointments.map((app) =>
            app.id === editItem.id ? { ...app, ...data } : app
          )
        );
        addToast({ title: "Success", description: "Appointment updated." });
      } else {
        // Add new appointment
        const newAppointment: Appointment = {
          id: Date.now(),
          ...data,
          status: "Pending",
          createdAt: new Date().toISOString(),
        };
        setAppointments([...appointments, newAppointment]);
        addToast({ title: "Success", description: "Appointment created." });
      }
      setIsLoading(false);
      setShowModal(false);
      reset();
    }, 1000);
  };

  const filteredRows = useMemo(
    () =>
      appointments.filter((appointment) =>
        appointment.studentName.toLowerCase().includes(search.toLowerCase())
      ),
    [appointments, search]
  );

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  const columns: ColumnDef<Appointment>[] = [
    { key: "studentName", label: "Student Name" },
    {
      key: "date",
      label: "Date",
      renderCell: (item) => new Date(item.date).toLocaleDateString(),
    },
    { key: "time", label: "Time" },
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
      key: "actions",
      label: "Actions",
      renderCell: (item) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="flat"
            color="primary"
            onPress={() => handleEdit(item)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="flat"
            color="danger"
            onPress={() => handleDelete(item.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

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
        isLoading={false}
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
                    placeholder="Student Name"
                    {...register("studentName")}
                    disabled={isLoading}
                  />
                  {errors.studentName && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.studentName.message}
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
