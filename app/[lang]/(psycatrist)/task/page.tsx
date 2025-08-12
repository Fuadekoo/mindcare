"use client";
import React, { useMemo, useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import useAction from "@/hooks/useActions";
import {
  getTasks,
  changeStatus,
  createTask,
  deleteTask,
} from "@/actions/psycatrist/task";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@heroui/toast";
import { z } from "zod";
import CustomAlert from "@/components/custom-alert";

// Zod schema for task validation
const taskSchema = z.object({
  note: z.string().min(1, "Task description cannot be empty."),
});

// Interface for a single task from the database
interface Task {
  id: string;
  note: string;
  status: "pending" | "completed";
  createdAt: string;
}

function Page() {
  const [page] = useState(1);
  const [pageSize] = useState(10);
  const [search] = useState("");
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
  });

  const [taskData, refreshTasks, isLoadingTasks] = useAction(
    getTasks,
    [true, () => {}],
    search,
    page,
    pageSize
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const [, createAction, isCreating] = useAction(createTask, [, () => {}]);

  // const [updateResponse, updateAction, isUpdatingTask] = useAction(
  //   changeStatus,
  //   [, () => {}]
  // );

  const [, deleteAction, isDeleting] = useAction(deleteTask, [, () => {}]);

  const [, changeStatusAction, isChangingStatus] = useAction(changeStatus, [
    ,
    () => {},
  ]);
  // --- Event Handlers ---
  const onSubmit = async (data: z.infer<typeof taskSchema>) => {
    await createAction(data);
    addToast({ title: "Success", description: "Task added successfully." });
    reset();
    refreshTasks();
  };

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    await changeStatusAction(task.id, newStatus);
    addToast({ title: "Success", description: "Task status updated." });
    refreshTasks();
  };

  const handleDeleteTask = (id: string) => {
    setDeleteId(id);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      setPendingDeleteId(deleteId);
      await deleteAction(deleteId);
      addToast({ title: "Success", description: "Task deleted." });
      refreshTasks();
      setDeleteId(null);
    } finally {
      setPendingDeleteId(null);
    }
  };

  const isDeletingAppointment = isDeleting;

  // --- Memoized Data for Rendering ---
  const tasks: Task[] = useMemo(
    () =>
      (taskData?.data
        ? (
            taskData.data as {
              note: string;
              id: string;
              createdAt: Date;
              status: string;
            }[]
          ).map((task) => ({
            ...task,
            createdAt:
              typeof task.createdAt === "string"
                ? task.createdAt
                : task.createdAt.toISOString(),
            status: task.status === "completed" ? "completed" : "pending",
          }))
        : []) as Task[],
    [taskData]
  );
  const remainingTodos = useMemo(
    () => tasks.filter((task: Task) => task.status !== "completed").length,
    [tasks]
  );

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Your To-Do List
      </h1>

      {/* Add Task Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-start gap-2 mb-6"
      >
        <div className="flex-grow">
          <input
            type="text"
            {...register("note")}
            placeholder="Add a new task..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={isCreating}
          />
          {errors.note && (
            <p className="text-red-500 text-xs mt-1">{errors.note.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0 disabled:bg-blue-300"
          disabled={isCreating}
        >
          {isCreating ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <Plus size={24} />
          )}
        </button>
      </form>

      {/* Task List */}
      <div className="space-y-3 min-h-[100px]">
        {isLoadingTasks && (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        )}
        {!isLoadingTasks &&
          tasks.map((task: Task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.status === "completed"}
                  onChange={() => handleToggleStatus(task)}
                  disabled={isChangingStatus || isDeleting}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span
                  className={`ml-4 text-gray-700 ${
                    task.status === "completed"
                      ? "line-through text-gray-400"
                      : ""
                  }`}
                >
                  {task.note}
                </span>
              </div>
              <button
                onClick={() => handleDeleteTask(task.id)}
                disabled={isDeleting || isChangingStatus}
                className="text-gray-400 hover:text-red-500 transition-colors disabled:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
          ))}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-600">
        <p>
          You have <span className="font-bold">{remainingTodos}</span> remaining
          tasks.
        </p>
      </div>
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm">
            <CustomAlert
              color="danger"
              title="Delete appointment?"
              description="This action cannot be undone."
              confirmText="Delete"
              cancelText="Cancel"
              onConfirm={handleConfirmDelete}
              onCancel={() => setDeleteId(null)}
              isConfirmLoading={pendingDeleteId === deleteId && isDeleting}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
