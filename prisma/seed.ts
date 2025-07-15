import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  // Create Users
  //   user1 hasshed passowrd
  const user1hashed = bcrypt.hashSync("admin123", 10);
  const user1 = await prisma.user.create({
    data: {
      username: "alice",
      phone: "910737199",
      password: user1hashed,
    },
  });

  // Create Students
  const student1 = await prisma.student.create({
    data: {
      name: "Ahmad",
      passcode: "pass123",
      phoneno: "60123456789",
      country: "Malaysia",
      status: "active",
      isKid: false,
      ustaz: "Ustaz Ali",
      subject: "Math",
      package: "Standard",
      youtubeSubject: "Math Basics",
      chat_id: "chat_ahmad",
      u_control: "control1",
    },
  });

  const student2 = await prisma.student.create({
    data: {
      name: "Fatimah",
      passcode: "pass456",
      phoneno: "60198765432",
      country: "Malaysia",
      status: "active",
      isKid: true,
      ustaz: "Ustazah Siti",
      subject: "Science",
      package: "Premium",
      youtubeSubject: "Science Fun",
      chat_id: "chat_fatimah",
      u_control: "control2",
    },
  });

  // Create Appointments
  await prisma.appointment.create({
    data: {
      studentId: student1.wdt_ID,
      date: new Date("2024-07-20"),
      time: "10:00",
      status: "confirmed",
    },
  });

  await prisma.appointment.create({
    data: {
      studentId: student2.wdt_ID,
      date: new Date("2024-07-21"),
      time: "14:00",
      status: "pending",
    },
  });

  // Create History
  await prisma.history.create({
    data: {
      studentId: student1.wdt_ID,
      diagnosis: "Healthy",
      observation: "No issues",
      treatment: "None",
    },
  });

  await prisma.history.create({
    data: {
      studentId: student2.wdt_ID,
      diagnosis: "Needs attention",
      observation: "Low focus",
      treatment: "Extra tutoring",
    },
  });

  // Create Progress Tracking
  await prisma.progressTracking.create({
    data: {
      studentId: student1.wdt_ID,
      progress: "Completed Module 1",
    },
  });

  await prisma.progressTracking.create({
    data: {
      studentId: student2.wdt_ID,
      progress: "Started Module 2",
    },
  });

  // Create Todo List
  await prisma.todoList.create({
    data: {
      note: "Prepare lesson for Ahmad",
    },
  });

  await prisma.todoList.create({
    data: {
      note: "Review Fatimah's progress",
    },
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
