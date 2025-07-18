import { z } from "zod";

export const loginSchema = z.object({
  phone: z.string().min(9, "phone number is too short"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
export type LoginType = z.infer<typeof loginSchema>;

export const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(8, "Old password must be at least 8 characters long"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters long"),
  confirmPassword: z
    .string()
    .min(8, "Confirm password must be at least 8 characters long"),
});
export type ChangePasswordType = z.infer<typeof changePasswordSchema>;

export const taskSchema = z.object({
  note: z.string().min(1, "Note is required"),
});
export type TaskType = z.infer<typeof taskSchema>;

export const caseSchema = z.object({
  studentId: z.number().min(1, "Student ID is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["open", "in-progress", "closed"], {
    errorMap: () => ({ message: "Status must be one of open, in-progress, or closed" }),
  }),
});
export type CaseType = z.infer<typeof caseSchema>;
