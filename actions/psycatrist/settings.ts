"use server";
import prisma from "@/lib/db";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { changePasswordSchema } from "@/lib/zodSchema";
export async function updatePassword(
  data: z.infer<typeof changePasswordSchema>
) {
  try {
    // Check if newPassword and confirmPassword match
    if (data.newPassword !== data.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new Error("Unauthorized");
    }

    // Update the user's password using the provided data
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: data.newPassword, // assuming changePasswordSchema has newPassword
      },
    });

    return { message: "Password updated successfully" };
  } catch (error) {
    console.error("Error updating password:", error);
    return { message: "Failed to update password" };
  }
}
