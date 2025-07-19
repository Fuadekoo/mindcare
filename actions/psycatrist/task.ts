"use server";
import prisma from "@/lib/db";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { taskSchema } from "@/lib/zodSchema";

export async function getTasks(
  search?: string,
  page?: number,
  pageSize?: number
) {
  try {
    // Default values for pagination
    page = page || 1;
    pageSize = pageSize || 10;

    const where = search
      ? {
          OR: [{ note: { contains: search } }],
        }
      : {};

    const totalRows = await prisma.todoList.count({ where });
    const totalPages = Math.ceil(totalRows / pageSize);

    const data = await prisma.todoList.findMany({
      where,
      select: {
        id: true,
        note: true,
        status: true,
        createdAt: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: pageSize,
        totalRecords: totalRows,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks");
  }
}

export async function createTask(data: z.infer<typeof taskSchema>) {
  try {
    const parsedData = taskSchema.parse(data);
    await prisma.todoList.create({
      data: {
        note: parsedData.note,
      },
    });
    return { message: "Task created successfully" };
  } catch (error) {
    console.error("Error creating task:", error);
    return { message: "Failed to create task" };
  }
}

export async function updateTask(id: string, data: z.infer<typeof taskSchema>) {
  try {
    const parsedData = taskSchema.parse(data);
    await prisma.todoList.update({
      where: { id },
      data: {
        note: parsedData.note,
      },
    });
    return { message: "Task updated successfully" };
  } catch (error) {
    console.error("Error updating task:", error);
    return { message: "Failed to update task" };
  }
}

export async function deleteTask(id: string) {
  try {
    await prisma.todoList.delete({
      where: { id },
    });
    return { message: "Task deleted successfully" };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { message: "Failed to delete task" };
  }
}

export async function changeStatus(id: string, status: string) {
  try {
    await prisma.todoList.update({
      where: { id },
      data: { status },
    });
    return { message: "Task status updated successfully" };
  } catch (error) {
    console.error("Error updating task status:", error);
    return { message: "Failed to update task status" };
  }
}
