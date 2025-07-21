"use server";
import prisma from "@/lib/db";
import { z } from "zod";
import { auth } from "@/lib/auth";
export async function getCaseCard(
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
          OR: [
            { historyCode: { contains: search, mode: "insensitive" } },
            // { patientTypeData: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const totalRows = await prisma.history.count({ where });
    const totalPages = Math.ceil(totalRows / pageSize);

    const histories = await prisma.history.findMany({
      where,
      select: {
        id: true,
        student: { select: { wdt_ID: true, name: true } },
        historyCode: true,
        patientTypeData: true,
        note: true,
        solved: true,
        createdAt: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data: histories,
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
    console.error("Error fetching case cards:", error);
    throw new Error("Failed to fetch case cards");
  }
}

export async function createCaseCard(
  studentId: number,
  patientTypeData: string,
  note?: string
) {
  try {
    const newCase = await prisma.history.create({
      data: {
        studentId,
        patientTypeData,
        note,
      },
    });
    return { message: "Case card created successfully" };
  } catch (error) {
    console.error("Error creating case card:", error);
    return { message: "Failed to create case card" };
  }
}

export async function deleteCaseCard(id: string) {
  try {
    await prisma.history.delete({
      where: { id },
    });
    return { message: "Case card deleted successfully" };
  } catch (error) {
    console.error("Error deleting case card:", error);
    return { message: "Failed to delete case card" };
  }
}

export async function changeCaseStatus(id: string, status: boolean) {
  try {
    await prisma.history.update({
      where: { id },
      data: { solved: status },
    });
    return { message: "Case status updated successfully" };
  } catch (error) {
    console.error("Error updating case status:", error);
    return { message: "Failed to update case status" };
  }
}

export async function getallDiagnosisPerCase(id: string) {
  try {
    const diagnoses = await prisma.diagnosis.findMany({
      where: { historyId: id },
    });
    return diagnoses;
  } catch (error) {
    console.error("Error fetching diagnoses:", error);
    return [];
  }
}
export async function createDiagnosis(caseId: string, description: string) {
  try {
    const newDiagnosis = await prisma.diagnosis.create({
      data: {
        historyId: caseId,
        description,
      },
    });
    return { message: "Diagnosis created successfully" };
  } catch (error) {
    console.error("Error creating diagnosis:", error);
    return { message: "Failed to create diagnosis" };
  }
}
export async function deleteDiagnosis(id: string) {
  try {
    await prisma.diagnosis.delete({
      where: { id },
    });
    return { message: "Diagnosis deleted successfully" };
  } catch (error) {
    console.error("Error deleting diagnosis:", error);
    return { message: "Failed to delete diagnosis" };
  }
}

export async function getallObservationPerCase(caseId: string) {
  try {
    const observations = await prisma.observation.findMany({
      where: { historyId: caseId },
    });
    return observations;
  } catch (error) {
    console.error("Error fetching observations:", error);
    return [];
  }
}
export async function createObservation(caseId: string, description: string) {
  try {
    const newObservation = await prisma.observation.create({
      data: {
        historyId: caseId,
        description,
      },
    });
    return { message: "Observation created successfully" };
  } catch (error) {
    console.error("Error creating observation:", error);
    return { message: "Failed to create observation" };
  }
}
export async function deleteObservation(id: string) {
  try {
    await prisma.observation.delete({
      where: { id },
    });
    return { message: "Observation deleted successfully" };
  } catch (error) {
    console.error("Error deleting observation:", error);
    return { message: "Failed to delete observation" };
  }
}

export async function getallTreatmentPerCase(caseId: string) {
  try {
    const treatments = await prisma.treatment.findMany({
      where: { historyId: caseId },
    });
    return treatments;
  } catch (error) {
    console.error("Error fetching treatments:", error);
    return [];
  }
}

export async function createTreatment(caseId: string, description: string) {
  try {
    const newTreatment = await prisma.treatment.create({
      data: {
        historyId: caseId,
        description,
      },
    });
    return { message: "Treatment created successfully" };
  } catch (error) {
    console.error("Error creating treatment:", error);
    return { message: "Failed to create treatment" };
  }
}

export async function deleteTreatment(id: string) {
  try {
    await prisma.treatment.delete({
      where: { id },
    });
    return { message: "Treatment deleted successfully" };
  } catch (error) {
    console.error("Error deleting treatment:", error);
    return { message: "Failed to delete treatment" };
  }
}

export async function patientTypeData() {
  try {
    const types = await prisma.patientType.findMany({
      select: {
        id: true,
        type: true,
      },
    });
    return types;
  } catch (error) {
    console.error("Error fetching patient types:", error);
    return [];
  }
}
