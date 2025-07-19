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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
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

  const [taskResponse, createAction, isCreating] = useAction(createTask, [
    ,
    () => {},
  ]);

  const [updateResponse, updateAction, isUpdatingTask] = useAction(
    changeStatus,
    [, () => {}]
  );

  const [deleteResponse, deleteAction, isDeleting] = useAction(deleteTask, [
    ,
    () => {},
  ]);

  const [statusResponse, changeStatusAction, isChangingStatus] = useAction(
    changeStatus,
    [, () => {}]
  );
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

  const handleDeleteTask = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteAction(id);
      addToast({ title: "Success", description: "Task deleted." });
      refreshTasks();
    }
  };

  // --- Memoized Data for Rendering ---
  const tasks: Task[] = useMemo(
    () =>
      (taskData?.data
        ? (taskData.data as { note: string; id: string; createdAt: Date; status: string }[]).map((task) => ({
            ...task,
            createdAt: typeof task.createdAt === "string" ? task.createdAt : task.createdAt.toISOString(),
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
        <p className="text-sm italic mt-2 text-gray-500">
          "The secret of getting ahead is getting started." - Mark Twain
        </p>
      </div>
    </div>
  );
}

export default Page;
