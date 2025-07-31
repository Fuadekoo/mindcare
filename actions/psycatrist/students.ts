"use server";
import prisma from "@/lib/db";

export async function getStudents(
  search?: string,
  page?: number,
  pageSize?: number
) {
  try {
    // Default values for pagination
    page = page || 1;
    pageSize = pageSize || 10;

    const where = {
      ...(search
        ? {
            OR: [
              ...(Number.isFinite(Number(search))
                ? [{ wdt_ID: Number(search) }]
                : []),
              { name: { contains: search } },
              { ustaz: { contains: search } },
            ],
          }
        : {}),
      status: { in: ["Active", "Not yet"] }, // <-- Add this line
    };

    const totalRows = await prisma.student.count({ where });
    const totalPages = Math.ceil(totalRows / pageSize);

    const data = await prisma.student.findMany({
      where,
      select: {
        wdt_ID: true,
        name: true,
        passcode: true,
        phoneno: true,
        country: true,
        status: true,
        isKid: true,
        ustaz: true,
        subject: true,
        package: true,
        chat_id: true,
        u_control: true,
        history: {
          // where: { solved: false },
          select: {
            id: true,
            solved: true,
          },
          orderBy: {
            createdAt: "desc", // Order by date to easily find the last visit
          },
        },
        appointment: {
          where: { status: "pending" },
          select: {
            id: true,
            status: true,
          },
          orderBy: {
            createdAt: "desc", // Order by date to easily find the last appointment
          },
        },
      },
      // orderBy: { createdAt: "desc" },
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
    console.error("Error fetching students:", error);
    return { message: "Failed to fetch students" };
  }
}

export async function studentData() {
  try {
    const student = await prisma.student.findMany({
      where: { status: { in: ["active", "Not yet"] } },
      select: { wdt_ID: true, name: true },
    });
    return student;
  } catch (error) {
    console.error("Error fetching student name:", error);
    return null;
  }
}
