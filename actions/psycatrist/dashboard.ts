"use server";
import prisma from "@/lib/db";
import { patientTypeSchema } from "@/lib/zodSchema";
import { z } from "zod";

// ths dashboard is return total history solved ,pending total student total appointment,pending appointment, total solved appointment, total pending appointment, total solved student, total pending student
export async function getDashboardCard() {
  const [
    totalHistory,
    totalStudents,
    totalAppointments,
    totalPendingAppointments,
    totalSolvedAppointments,
    totalPendingStudents,
    totalSolvedStudents,
  ] = await Promise.all([
    prisma.history.count(),
    prisma.student.count(),
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: "pending" } }),
    prisma.appointment.count({ where: { status: "solved" } }),
    prisma.student.count({ where: { status: "pending" } }),
    prisma.student.count({ where: { status: "solved" } }),
  ]);

  return {
    totalHistory,
    totalStudents,
    totalAppointments,
    totalPendingAppointments,
    totalSolvedAppointments,
    totalPendingStudents,
    totalSolvedStudents,
  };
}
export async function getYear() {
  try {
    const years = await prisma.history.findMany({
      select: {
        createdAt: true,
      },
    });

    // Extract years and return unique sorted list
    const uniqueYears = Array.from(
      new Set(years.map((item) => item.createdAt.getFullYear()))
    ).sort((a, b) => a - b);

    return { data: uniqueYears };
  } catch (error) {
    console.error("Error fetching years:", error);
    return { error: "Failed to fetch years." };
  }
}

// in this it is  for graph display the months and total history count,solved and notSolving in each month by select the year found in the database
export async function getGraphData(year: number) {
  try {
    // 1. Fetch all history records for the selected year for efficiency.
    const historyForYear = await prisma.history.findMany({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01T00:00:00.000Z`),
          lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
        },
      },
      select: {
        createdAt: true,
        solved: true,
      },
    });

    // 2. Initialize a data structure for all 12 months.
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyData = monthNames.map((name) => ({
      month: name,
      total: 0,
      solved: 0,
      pending: 0,
    }));

    // 3. Process each record and aggregate the data into the correct month.
    for (const record of historyForYear) {
      const monthIndex = record.createdAt.getMonth(); // 0 for Jan, 1 for Feb, etc.
      monthlyData[monthIndex].total++;
      if (record.solved) {
        monthlyData[monthIndex].solved++;
      }
    }

    // 4. Calculate pending cases for each month and return the final structure.
    const finalGraphData = monthlyData.map((data) => ({
      ...data,
      pending: data.total - data.solved,
    }));

    return { data: finalGraphData };
  } catch (error) {
    console.error("Error fetching graph data:", error);
    return { error: "Failed to fetch graph data." };
  }
}

export async function getPayChartData() {}

export async function getPatientTypeData(
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
          OR: [{ type: { contains: search, mode: "insensitive" } }],
        }
      : {};

    const totalRows = await prisma.patientType.count({ where });
    const totalPages = Math.ceil(totalRows / pageSize);

    const data = await prisma.patientType.findMany({
      where,
      select: {
        id: true,
        type: true,
        description: true,
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
    console.error("Error fetching patient types:", error);
    throw new Error("Failed to fetch patient types");
  }
}

export async function createPatientType(
  data: z.infer<typeof patientTypeSchema>
) {
  try {
    const parsedData = patientTypeSchema.parse(data);
    await prisma.patientType.create({
      data: {
        type: parsedData.type,
        description: parsedData.description,
      },
    });
    return { message: "Patient type created successfully." };
  } catch (error) {
    console.error("Error creating patient type:", error);
    throw new Error("Failed to create patient type");
  }
}

export async function updatePatientType(
  id: string,
  data: z.infer<typeof patientTypeSchema>
) {
  try {
    const parsedData = patientTypeSchema.parse(data);
    await prisma.patientType.update({
      where: { id },
      data: {
        type: parsedData.type,
        description: parsedData.description,
      },
    });
    return { message: "Patient type updated successfully." };
  } catch (error) {
    console.error("Error updating patient type:", error);
    throw new Error("Failed to update patient type");
  }
}

export async function deletePatientType(id: string) {
  try {
    await prisma.patientType.delete({
      where: { id },
    });
    return { message: "Patient type deleted successfully." };
  } catch (error) {
    console.error("Error deleting patient type:", error);
    throw new Error("Failed to delete patient type");
  }
}
