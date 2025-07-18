"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

export async function getStudents(
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
                        // If search is a number, match wdt_ID exactly
                        ...(Number.isFinite(Number(search)) ? [{ wdt_ID: Number(search) }] : []),
                        { name: { contains: search } },
                        { ustaz: { contains: search } },
                    ],
                }
            : {};

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
            youtubeSubject: true,
            chat_id: true,
            u_control: true,
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
