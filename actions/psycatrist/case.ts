"use server";


import prisma from "@/lib/db";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { select } from "@heroui/react";
export async function getCaseCard(
  GeneralCaseId: string,
  search?: string,
  page: number = 1,
  perPage: number = 10
) {
  try {
    const where: any = {
      studentGeneralCaseId: GeneralCaseId,
    };

    if (search) {
      where.OR = [
        { historyCode: { contains: search, mode: "insensitive" } },
        { note: { contains: search, mode: "insensitive" } },
        { student: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [histories, total] = await Promise.all([
      prisma.history.findMany({
        where,
        select: {
          id: true,
          StudentGeneralCase: { select: { id: true, status: true } },
          student: { select: { wdt_ID: true, name: true } },
          historyCode: true,
          patientData: { select: { type: true } },
          note: true,
          solved: true,
          createdAt: true,
          priority: true,
        },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { priority: "asc" },
      }),
      prisma.history.count({ where }),
    ]);

    return { data: histories, total, page, perPage };
  } catch (error) {
    console.error("Error fetching case cards:", error);
    throw new Error("Failed to fetch case cards");
  }
}

export async function createCaseCard(
  studentGeneralCaseId: string,
  studentId: number,
  patientTypeData: string,
  note?: string
) {
  try {
    // Before creating a new history for a student:
    const maxPriority = await prisma.history.aggregate({
      where: { studentId: studentId },
      _max: { priority: true },
    });

    const nextPriority = (maxPriority._max.priority ?? 0) + 1;

    await prisma.history.create({
      data: {
        priority: nextPriority,
        studentId,
        studentGeneralCaseId,
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

export async function createCaseCard2(
  studentGeneralCaseId: string,
  studentId: number,
  patientTypeData: string,
  note?: string
) {
  try {
    const maxPriority = await prisma.history.aggregate({
      where: { studentId: studentId },
      _max: { priority: true },
    });

    const nextPriority = (maxPriority._max.priority ?? 0) + 1;

    await prisma.history.create({
      data: {
        priority: nextPriority,
        studentGeneralCaseId,
        note,
        studentId: studentId,
        patientTypeData: patientTypeData,
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

export async function caseDetails(caseId: string) {
  try {
    const details = await prisma.history.findUnique({
      where: { id: caseId },
      select: {
        student: { select: { wdt_ID: true, name: true } },
        historyCode: true,
        patientData: { select: { type: true } },
        note: true,
        solved: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return details;
  } catch (error) {
    console.error("Error fetching case details:", error);
    return null;
  }
}

// export async function changeCaseStatus(caseId: string, solved: boolean) {
//   try {
//     const updatedCase = await prisma.history.update({
//       where: { id: caseId },
//       data: { solved },
//     });
//     return { message: "Case status updated successfully" };
//   } catch (error) {
//     console.error("Error updating case status:", error);
//     return { message: "Failed to update case status" };
//   }
// }

export async function getCasePerStudent(id: number) {
  try {
    const cases = await prisma.history.findMany({
      where: { student: { wdt_ID: id }, solved: false },
      select: {
        id: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
    console.log("Cases for student:", cases);
    return { data: cases };
  } catch (error) {
    console.error("Error fetching cases for student:", error);
    return { data: [] };
  }
}

export async function rejectOldPendingAppointments() {
  try {
    // Get the start and end of the current day
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Find and update pending appointments scheduled for today
    const result = await prisma.appointment.updateMany({
      where: {
        status: "pending",
        date: {
          gte: startOfToday, // greater than or equal to the start of today
          lte: endOfToday, // less than or equal to the end of today
        },
      },
      data: {
        status: "rejected",
      },
    });

    console.log(
      `Automatically rejected ${result.count} pending appointments for today.`
    );
    return { success: true, count: result.count };
  } catch (error) {
    console.error(
      "Error in cron job to reject today's pending appointments:",
      error
    );
    return { success: false, error: "Failed to process appointments." };
  }
}

// i went the last update of the case from the history,observation and treatment get the createat then the recent one
export async function lastCaseUpdate(caseId: string) {
  try {
    console.log("lasted update1");
    // Get updatedAt from history
    const history = await prisma.history.findUnique({
      where: { id: caseId },
      select: { updatedAt: true },
    });
    console.log("lasted update1", history);
    // Get latest createdAt from observation
    const observation = await prisma.observation.findFirst({
      where: { historyId: caseId },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });
    console.log("lasted update1", observation);

    // Get latest createdAt from treatment
    const treatment = await prisma.treatment.findFirst({
      where: { historyId: caseId },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });
    console.log("lasted update1", treatment);

    const dates = [
      history?.updatedAt,
      observation?.createdAt,
      treatment?.createdAt,
    ].filter(Boolean) as Date[];

    if (dates.length === 0) return null;

    // Find the date closest to the current time
    const now = new Date();
    let closestDate = dates[0];
    let minDiff = Math.abs(now.getTime() - closestDate.getTime());

    for (const date of dates) {
      const diff = Math.abs(now.getTime() - date.getTime());
      if (diff < minDiff) {
        minDiff = diff;
        closestDate = date;
      }
    }

    console.log("Last case update date:>>>>>>>>>>", closestDate);
    return closestDate;

    // if (dates.length === 0) return null;

    // Return the most recent date
    // const update = new Date(Math.max(...dates.map((date) => date.getTime())));
    // console.log("Last case update date:", update);
    // return update;
  } catch (error) {
    console.error("Error fetching last case update:", error);
    return null;
  }
}
