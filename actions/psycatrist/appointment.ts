"use server";
import prisma from "@/lib/db";
import { z } from "zod";
import { auth } from "@/lib/auth";

export async function getAppointments(
  search?: string,
  page?: number,
  pageSize?: number,
  startDate?: Date,
  endDate?: Date
) {
  try {
    // Default values for pagination
    page = page || 1;
    pageSize = pageSize || 10;

    const where: any = {};

    if (search) {
      where.student = {
        name: {
          contains: search,
          mode: "insensitive", // Case-insensitive search
        },
      };
    }

    if (startDate && endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setUTCHours(23, 59, 59, 999);
      where.createdAt = {
        gte: startDate,
        lte: endOfDay,
      };
    }

    const totalRows = await prisma.appointment.count({ where });
    const totalPages = Math.ceil(totalRows / pageSize);

    const data = await prisma.appointment.findMany({
      where,
      select: {
        id: true,
        case: {
          include: { student: { select: { wdt_ID: true, name: true } } },
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
  caseId: string;
  date: Date;
  time: string;
}) {
  const schema = z.object({
    caseId: z.string().min(1, "Case ID is required"),
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
        caseId: parsedData.data.caseId,
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
    caseId?: string;
    date?: Date;
    time?: string;
  }
) {
  const schema = z.object({
    caseId: z.string().optional(),
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
      where: { wdt_ID: id, status: { in: ["Active", "Not yet"] } },
      select: { wdt_ID: true, name: true },
    });
    return student;
  } catch (error) {
    console.error("Error fetching student name:", error);
    return null;
  }
}

export async function changeAppointmentStatus(id: string) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    const newStatus = appointment.status === "pending" ? "solved" : "pending";

    await prisma.appointment.update({
      where: { id },
      data: { status: newStatus },
    });

    return { message: "Appointment status updated successfully" };
  } catch (error) {
    console.error("Error changing appointment status:", error);
    return { message: "Failed to change appointment status" };
  }
}

export async function getAppointmentPerStudent(StudentId: number) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { case: { student: { wdt_ID: StudentId } }, status: "pending" },
      select: {
        id: true,
        date: true,
        time: true,
        status: true,
        createdAt: true,
      },
    });
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments for student:", error);
    return [];
  }
}

export async function getAppointmentById(id: string) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      select: {
        id: true,
        case: {
          include: { student: { select: { name: true, wdt_ID: true } } },
        },
        date: true,
        time: true,
        status: true,
        createdAt: true,
      },
    });

    if (!appointment) {
      return null;
    }

    return appointment;
  } catch (error) {
    console.error("Error fetching appointment by ID:", error);
    return null;
  }
}
export async function getTodayAppointments(page?: number, pageSize?: number) {
  try {
    // Default values for pagination
    page = page || 1;
    pageSize = pageSize || 10;

    // Get today's date range (00:00:00 to 23:59:59 UTC)
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const where = {
      status: "pending",
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    const totalRows = await prisma.appointment.count({ where });
    const totalPages = Math.ceil(totalRows / pageSize);

    const data = await prisma.appointment.findMany({
      where,
      select: {
        id: true,
        case: {
          include: { student: { select: { wdt_ID: true, name: true } } },
        },
        date: true,
        time: true,
        status: true,
        createdAt: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    console.log("Today's appointments:", data);

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
    console.error("Error fetching today's appointments:", error);
    throw new Error("Failed to fetch today's appointments");
  }
}

export async function ChangeAppointmentStatus(id: string, status: string) {
  try {
    // the status is only reject and  confirm
    if (status !== "rejected" && status !== "confirmed") {
      return { message: "Invalid status" };
    }
    await prisma.appointment.update({
      where: { id },
      data: { status: status },
    });
    return { message: `${status} appointment successfully` };
  } catch (error) {
    console.error("Error rejecting appointment:", error);
    return { message: "Failed to reject appointment" };
  }
}
