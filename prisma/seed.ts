import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  console.log("Starting the seeding process...");

  // 1. Seed Patient Types
  const patientTypeAdult = await prisma.patientType.upsert({
    where: { type: "Adult" },
    update: {},
    create: {
      type: "Adult",
      description: "Adult patient type",
    },
  });

  const patientTypeChild = await prisma.patientType.upsert({
    where: { type: "Child" },
    update: {},
    create: {
      type: "Child",
      description: "Child patient type",
    },
  });
  console.log("Patient types seeded.");

  // 2. Create Users
  const user1hashed = bcrypt.hashSync("admin123", 10);
  await prisma.user.upsert({
    where: { phone: "910737199" },
    update: {},
    create: {
      username: "alice",
      phone: "910737199",
      password: user1hashed,
    },
  });
  console.log("Users seeded.");

  // 3. Create Students
  const student1 = await prisma.student.upsert({
    where: { passcode: "pass123" },
    update: {},
    create: {
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

  const student2 = await prisma.student.upsert({
    where: { passcode: "pass456" },
    update: {},
    create: {
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
  console.log("Students seeded.");

  // 4. Create StudentGeneralCase for each student
  const case1 = await prisma.studentGeneralCase.create({
    data: {
      studentId: student1.wdt_ID,
      status: "open",
    },
  });

  const case2 = await prisma.studentGeneralCase.create({
    data: {
      studentId: student2.wdt_ID,
      status: "open",
    },
  });

  // 5. Create History for each case (with unique priority per student)
  const history1 = await prisma.history.create({
    data: {
      studentId: student1.wdt_ID,
      studentGeneralCaseId: case1.id,
      patientTypeData: patientTypeAdult.id,
      solved: true,
      priority: 1,
      diagnosis: {
        create: { description: "Generalized Anxiety Disorder" },
      },
      observation: {
        create: { description: "Showing signs of stress and restlessness." },
      },
      treatment: {
        create: {
          description: "Weekly therapy sessions and mindfulness exercises.",
        },
      },
    },
  });

  await prisma.history.create({
    data: {
      studentId: student1.wdt_ID,
      studentGeneralCaseId: case1.id,
      patientTypeData: patientTypeAdult.id,
      solved: false,
      priority: 2,
      diagnosis: {
        create: { description: "Mild Depression" },
      },
      observation: {
        create: { description: "Low mood, lack of motivation." },
      },
      treatment: {
        create: { description: "Cognitive behavioral therapy." },
      },
    },
  });

  const history3 = await prisma.history.create({
    data: {
      studentId: student2.wdt_ID,
      studentGeneralCaseId: case2.id,
      patientTypeData: patientTypeChild.id,
      solved: false,
      priority: 1,
      diagnosis: {
        create: {
          description: "Attention-Deficit/Hyperactivity Disorder (ADHD)",
        },
      },
      observation: {
        create: {
          description: "Difficulty focusing during lessons, easily distracted.",
        },
      },
      treatment: {
        create: {
          description: "Behavioral therapy and structured learning plan.",
        },
      },
    },
  });

  await prisma.history.create({
    data: {
      studentId: student2.wdt_ID,
      studentGeneralCaseId: case2.id,
      patientTypeData: patientTypeChild.id,
      solved: true,
      priority: 2,
      diagnosis: {
        create: { description: "Mild Anxiety" },
      },
      observation: {
        create: { description: "Occasional nervousness in class." },
      },
      treatment: {
        create: { description: "Relaxation techniques and parent counseling." },
      },
    },
  });

  console.log("Histories with details seeded.");

  // 6. Create Appointments linked to history (case)
  await prisma.appointment.create({
    data: {
      caseId: history1.id,
      date: new Date("2024-07-20T10:00:00Z"),
      time: "10:00",
      status: "confirmed",
    },
  });

  await prisma.appointment.create({
    data: {
      caseId: history3.id,
      date: new Date("2024-07-21T14:00:00Z"),
      time: "14:00",
      status: "pending",
    },
  });
  console.log("Appointments seeded.");

  // 7. Create Progress Tracking
  await prisma.progressTracking.create({
    data: {
      studentId: student1.wdt_ID,
      progress: "Completed Module 1 on anxiety management.",
    },
  });

  await prisma.progressTracking.create({
    data: {
      studentId: student2.wdt_ID,
      progress: "Showing improvement in focus, started Module 2.",
    },
  });
  console.log("Progress tracking seeded.");

  // 8. Create Todo List
  await prisma.todoList.create({
    data: {
      note: "Prepare lesson plan for Ahmad's next session.",
      status: "pending",
    },
  });

  await prisma.todoList.create({
    data: {
      note: "Review Fatimah's progress report with her parents.",
      status: "completed",
    },
  });
  console.log("Todo list seeded.");

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error("An error occurred during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Prisma client disconnected.");
  });
