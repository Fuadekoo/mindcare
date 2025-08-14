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
        StudentGeneralCase: {
          // where: { status: "open" },
          select: {
            id: true,
            status: true,
          },
          // orderBy: {
          //   createdAt: "desc", // Order by date to easily find the last case
          // },
        },
        history: {
          select: {
            id: true,
            solved: true,
            priority: true,
            appointment: {
              select: { id: true, status: true },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: {
            createdAt: "asc", // Order by date to easily find the last visit
          },
        },
      },
      // orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const adaptedData = data.map((student) => ({
      ...student,
      // Flatten all appointments from all histories into a top-level appointment array
      appointment: (student.history || []).map((h) => h.appointment || []),
      // Optionally, always make StudentGeneralCase an array for frontend consistency
      StudentGeneralCase: student.StudentGeneralCase
        ? [student.StudentGeneralCase]
        : [],
    }));

    // console.log("Students fetched:", data);
    // console.table(data.map((item) => item.history.map((h) => h.appointment)));
    // console.table(adaptedData.map((item) => item.appointment));
    // console.log("Adapted students:", adaptedData);

    return {
      data: adaptedData,
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
