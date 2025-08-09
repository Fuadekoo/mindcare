"use server";
import prisma from "@/lib/db";
import { z } from "zod";
export async function getGeneraleCase() {
  try {
    const generalCases = await prisma.studentGeneralCase.findMany({
      select: {
        id: true,
        status: true,
        student: {
          select: {
            wdt_ID: true,
            name: true,
          },
        },
      },
    });
    return generalCases;
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
    const generalCase = await prisma.studentGeneralCase.findUnique({
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
