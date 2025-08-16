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

export const generalCaseSchema = z.object({
  studentId: z.number().int(),
});
export type GeneralCaseType = z.infer<typeof generalCaseSchema>;

export const caseSchema = z.object({
  studentGeneralCaseId: z
    .string()
    .min(1, "Student general case ID is required."),
  studentId: z.number(),
  problemTypeId: z.string().min(3, "Problem type is required."),
  note: z.string().optional(),
});
export type CaseType = z.infer<typeof caseSchema>;

export const case3Schema = z.object({
  studentGeneralCaseId: z
    .string()
    .min(1, "Student general case ID is required."),
  problemTypeId: z.string().min(3, "Problem type is required."),
  note: z.string().optional(),
});
export type Case3Type = z.infer<typeof case3Schema>;

// This schema is used for appointment creation and updates
export const appointmentSchema = z.object({
  caseId: z.string().min(1, "Case ID is required."),
  date: z.string().min(1, "Date is required."),
  time: z.string().min(1, "Time is required."),
});
export type AppointmentType = z.infer<typeof appointmentSchema>;

export const patientTypeSchema = z.object({
  type: z.string().min(1, "Type is required"),
  description: z.string().optional(),
});
export type PatientType = z.infer<typeof patientTypeSchema>;
