"use server";
import prisma from "@/lib/db";
import { z } from "zod";
import { auth } from "@/lib/auth";

export async function getProfile() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile");
  }
}
