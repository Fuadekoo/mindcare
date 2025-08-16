"use server";
import prisma from "@/lib/db";
import { z } from "zod";

export async function getAllGeneralCasePerStudent(studentId: number) {
  try {
    const generalCases = await prisma.studentGeneralCase.findMany({
      where: { studentId, status: "open" },
      select: {
        id: true,
        createdAt: true,
      },
    });
    console.log("General cases for student:>><<", generalCases);
    return generalCases;
  } catch (error) {
    console.error("Error fetching general cases:", error);
    throw new Error("Failed to fetch general cases");
  }
}

export async function getGeneralCase(
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
          student: {
            name: { contains: search },
          },
        }
      : {};

    const totalRows = await prisma.studentGeneralCase.count({ where });
    const totalPages = Math.ceil(totalRows / pageSize);

    const generalCases = await prisma.studentGeneralCase.findMany({
      where,
      select: {
        id: true,
        status: true,
        createdAt: true,
        student: {
          select: {
            wdt_ID: true,
            name: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data: generalCases,
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
    console.error("Error fetching general cases:", error);
    throw new Error("Failed to fetch general cases");
  }
}

export async function createGeneralCase(studentId: number) {
  try {
    await prisma.studentGeneralCase.create({
      data: {
        studentId,
        openFlag: 1,
      },
    });
    return { success: true, message: "General case created successfully" };
  } catch (error) {
    console.error("Error creating general case:", error);
    return { success: false, message: "Failed to create general case" };
  }
}

export async function updateGeneralCase(generalCaseId: string) {
  await prisma.studentGeneralCase.update({
    where: { id: generalCaseId },
    data: {
      status: "closed",
      openFlag: null,
    },
  });
  return { message: "General case updated successfully" };
}

export async function deleteGeneralCase(generalCaseId: string) {
  try {
    await prisma.studentGeneralCase.delete({
      where: { id: generalCaseId },
    });
    return { message: "General case deleted successfully" };
  } catch (error) {
    console.error("Error deleting general case:", error);
    return { success: false, message: "Failed to delete general case" };
  }
}

export async function getGeneralCaseByStudentId(studentId: number) {
  try {
    const generalCase = await prisma.studentGeneralCase.findFirst({
      where: { studentId },
      select: {
        id: true,
        status: true,
      },
    });
    return generalCase;
  } catch (error) {
    console.error("Error fetching general case by student ID:", error);
    return null;
  }
}
