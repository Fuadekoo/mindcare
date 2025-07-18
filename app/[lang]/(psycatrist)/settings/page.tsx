"use client";
import React, { useState } from "react";
import { Button, Input } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

// Zod schema for password validation
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // Set the error on the confirmPassword field
  });

function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: z.infer<typeof changePasswordSchema>) => {
    setIsLoading(true);
    console.log(data); // For demonstration

    // Simulate API call
    setTimeout(() => {
      // Replace with your actual API logic
      // For example, check if data.currentPassword is correct
      if (data.currentPassword === "password123") {
        addToast({
          title: "Success",
          description: "Your password has been updated successfully.",
          //   type: "success",
        });
        reset(); // Clear form fields on success
      } else {
        addToast({
          title: "Error",
          description: "The current password you entered is incorrect.",
          //   type: "error",
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>

        {/* Change Password Card */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-1">
            Change Password
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Update your password for enhanced security.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                label="Current Password"
                type="password"
                {...register("currentPassword")}
                // error={errors.currentPassword?.message}
                disabled={isLoading}
                className="w-full"
              />
            </div>
            <div>
              <Input
                label="New Password"
                type="password"
                {...register("newPassword")}
                // error={errors.newPassword?.message}
                disabled={isLoading}
                className="w-full"
              />
            </div>
            <div>
              <Input
                label="Confirm New Password"
                type="password"
                {...register("confirmPassword")}
                // error={errors.confirmPassword?.message}
                disabled={isLoading}
                className="w-full"
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                color="primary"
                disabled={isLoading}
                className="min-w-[150px]"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
