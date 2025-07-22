import React from "react";
import { auth } from "@/lib/auth";
import UserLayout from "@/components/userLayout";
import { redirect } from "next/navigation";
import {
  Home,
  Calendar,
  CheckSquare,
  Activity,
  User,
  Settings,
  CastIcon,
} from "lucide-react";

// Updated menu with new items and suitable icons
const menu = [
  { label: "Dashboard", url: "/dashboard", icon: <Home /> },
  { label: "Students", url: "/students", icon: <User /> },
  { label: "Track", url: "/track", icon: <Activity /> },
  { label: "Appointment", url: "/appointment", icon: <Calendar /> },
  { label: "Task", url: "/task", icon: <CheckSquare /> },
  { label: "Case", url: "/case", icon: <CastIcon /> },
  //   { label: "Notifications", url: "/notification", icon: <Bell /> },
  { label: "Profile", url: "/profile", icon: <User /> },
  { label: "Settings", url: "/settings", icon: <Settings /> },
];

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // if the login user is not admin then redirect to page is forbidden page or 404 page
  if (!session || !session.user) {
    redirect("/en/forbidden");
  }

  const isManager = true;

  return (
    <div className="overflow-hidden h-svh w-svw">
      <UserLayout menu={menu} isManager={isManager}>
        {children}
      </UserLayout>
    </div>
  );
}
