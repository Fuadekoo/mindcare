"use server";
import prisma from "@/lib/db";

export async function getTrack(
  search?: string,
  page: number = 1,
  pageSize: number = 10
) {
  try {
    // Build search filter for students
    const where = {
      status: { in: ["Active", "Not yet"] }, // <-- Add this line
      // StudentGeneralCase: {
      //   some: {},
      // },
      ...(search
        ? {
            OR: [
              ...(isNaN(Number(search)) ? [] : [{ wdt_ID: Number(search) }]),
              { name: { contains: search } },
            ],
          }
        : {}),
    };

    // Get the total count of students matching the search for pagination
    const totalRows = await prisma.student.count({
      where,
    });
    const totalPages = Math.ceil(totalRows / pageSize);

    // Fetch paginated students and their case history in one query
    const studentsWithHistory = await prisma.student.findMany({
      where,
      select: {
        wdt_ID: true,
        name: true,
        StudentGeneralCase: {
          select: {
            id: true,
          },
        },
        history: {
          select: {
            solved: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            createdAt: "desc", // Order by date to easily find the last visit
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // Process the fetched data to create the desired output structure
    const data = studentsWithHistory.map((student) => {
      const totalGeneralCase = student.StudentGeneralCase.length;
      const totalProblems = student.history.length;
      const solved = student.history.filter((h) => h.solved).length;
      const pending = totalProblems - solved;
      const lastVisit =
        student.history.length > 0
          ? student.history[0].updatedAt.toISOString().split("T")[0]
          : null;

      return {
        id: student.wdt_ID,
        name: student.name,
        totalGeneralCase,
        totalProblems,
        solved,
        pending,
        lastVisit,
      };
    });

    return {
      data,
      pagination: {
        currentPage: page,
        totalPages,
        itemsPerPage: pageSize,
        totalRecords: totalRows,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching tracks:", error);
    return { error: "Failed to fetch tracks" };
  }
}
