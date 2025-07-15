"use client";
import React, { useState } from "react";
import { Plus, X } from "lucide-react";

// Define the type for a single task
interface Task {
  id: number;
  text: string;
  completed: boolean;
}

function TodoPage() {
  // State for the list of tasks
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "This is an example of task #1", completed: true },
    { id: 2, text: "This is an example of task #2", completed: false },
    { id: 3, text: "This is an example of task #3", completed: true },
    { id: 4, text: "This is an example of task #4", completed: false },
    { id: 5, text: "This is an example of task #5", completed: false },
  ]);

  // State for the new task input
  const [newTask, setNewTask] = useState("");

  // Handle adding a new task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === "") return; // Don't add empty tasks
    const newTaskObject: Task = {
      id: Date.now(),
      text: newTask,
      completed: false,
    };
    setTasks([...tasks, newTaskObject]);
    setNewTask(""); // Clear the input field
  };

  // Handle toggling the completed status of a task
  const handleToggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Handle deleting a task
  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Calculate the number of remaining tasks
  const remainingTodos = tasks.filter((task) => !task.completed).length;

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-sm">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Your To Do
      </h1>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="flex items-center gap-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task"
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
        >
          <Plus size={24} />
        </button>
      </form>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task.id)}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <span
                className={`ml-4 text-gray-700 ${
                  task.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {task.text}
              </span>
            </div>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-600">
        <p>
          Your remaining todos :{" "}
          <span className="font-bold">{remainingTodos}</span>
        </p>
        <p className="text-sm italic mt-2 text-gray-500">
          "Doing what you love is the cornerstone of having abundance in your
          life." - Wayne Dyer
        </p>
      </div>
    </div>
  );
}

export default TodoPage;
