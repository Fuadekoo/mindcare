"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useAction from "@/hooks/useActions";
import { authenticate } from "@/actions/common/authentication";
import { Input } from "@heroui/input";
import { Button } from "@heroui/react";
import Loading from "@/components/loading";
import { addToast } from "@heroui/toast";
// import Link from "next/link";
import Image from "next/image";

function LoginPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });
  const [, action, loading] = useAction(authenticate, [
    ,
    (response) => {
      if (response) {
        addToast({
          title: "Login",
          description: response.message,
        });
        // window.location.reload();
      } else {
        addToast({
          title: "Login",
          description: "Login successful!",
        });
      }
    },
  ]);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-primary-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-[calc(80vh-4rem)] max-w-4xl bg-white rounded-lg shadow-lg p-8 m-2">
        <div className="rounded-3xl flex items-center justify-center m-2 overflow-hidden hidden lg:flex">
          <Image
            src="/mindcare.png"
            alt="Login Illustration"
            width={300}
            height={500}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="grid border-rounded shadow-2xs w-full m-1">
          <h1 className="text-2xl font-bold text-center text-primary-900">
            DARELKUBRA MINDCARE
          </h1>
          <form onSubmit={handleSubmit(action)} className="space-y-5">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-primary-900 mb-1"
              >
                Phone Number
              </label>
              <Input
                id="phone"
                type="phone"
                variant="bordered"
                placeholder="Phone Number"
                {...register("phone")}
                className="w-full text-primary-900"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-primary-900 mb-1"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                variant="bordered"
                placeholder="Password"
                {...register("password")}
                className="w-full text-primary-900"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              isDisabled={loading}
              color="primary"
              variant="solid"
              type="submit"
              className="w-full"
            >
              {loading ? <Loading /> : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
