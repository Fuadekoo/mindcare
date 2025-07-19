"use server";
import prisma from "@/lib/db";
import { z } from "zod";
import { auth } from "@/lib/auth";

export async function getAppointments(
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
          OR: [{ student: { name: { contains: search } } }],
        }
      : {};

    const totalRows = await prisma.appointment.count({ where });
    const totalPages = Math.ceil(totalRows / pageSize);

    const data = await prisma.appointment.findMany({
      where,
      select: {
        id: true,
        student: {
          select: {
            name: true,
          },
        },
        date: true,
        time: true,
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
    console.error("Error fetching appointments:", error);
    throw new Error("Failed to fetch appointments");
  }
}

export async function createAppointment(data: {
  studentId: number;
  date: Date;
  time: string;
}) {
  const schema = z.object({
    studentId: z.number().min(1, "Student ID is required"),
    date: z.date(),
    time: z.string().min(1, "Time is required"),
  });

  const parsedData = schema.safeParse(data);
  if (!parsedData.success) {
    // throw new Error(parsedData.error.errors[0].message);
    return null;
  }

  try {
    await prisma.appointment.create({
      data: {
        studentId: parsedData.data.studentId,
        date: parsedData.data.date,
        time: parsedData.data.time,
      },
    });
    return { message: "Appointment created successfully" };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return { message: "Failed to create appointment" };
  }
}

export async function updateAppointment(
  id: string,
  data: {
    studentId?: number;
    date?: Date;
    time?: string;
  }
) {
  const schema = z.object({
    studentId: z.number().optional(),
    date: z.date().optional(),
    time: z.string().optional(),
  });

  const parsedData = schema.safeParse(data);
  if (!parsedData.success) {
    return null;
  }

  try {
    await prisma.appointment.update({
      where: { id },
      data: parsedData.data,
    });
    return { message: "Appointment updated successfully" };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return { message: "Failed to update appointment" };
  }
}

export async function deleteAppointment(id: string) {
  try {
    await prisma.appointment.delete({
      where: { id },
    });
    return { message: "Appointment deleted successfully" };
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return { message: "Failed to delete appointment" };
  }
}

export async function studentName(id: number) {
  try {
    const student = await prisma.student.findUnique({
      where: { wdt_ID: id },
      select: { wdt_ID: true, name: true },
    });
    return student;
  } catch (error) {
    console.error("Error fetching student name:", error);
    return null;
  }
}
