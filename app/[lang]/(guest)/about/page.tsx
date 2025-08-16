"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import {
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  BarChart3,
  CalendarDays,
  Users2,
  CheckCircle2,
  Quote,
} from "lucide-react";

function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-sky-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1600&auto=format&fit=crop"
            alt="Student wellbeing and support"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-violet-200/60 via-transparent to-sky-200/70" />
        </div>

        <div className="mx-auto max-w-7xl px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-violet-700 ring-1 ring-violet-200">
              <Sparkles size={14} /> Designed for DarulKubra Quran Center
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
              Supporting students’ mental wellbeing with care and clarity
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-gray-700">
              This system is purpose‑built for DarulKubra Quran Center to
              compassionately assess, track, and improve students’ mental
              status—streamlining general cases, appointments, and outcomes
              while protecting privacy and trust.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login">
                <Button color="primary" variant="solid" className="px-6 py-2">
                  Get Started
                </Button>
              </Link>
              <Link href="/en/signin">
                <Button
                  variant="flat"
                  color="secondary"
                  className="px-6 py-2 flex items-center gap-2"
                >
                  <ShieldCheck size={18} />
                  Go to login page
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About DarulKubra */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src="/c2.png"
              alt="DarulKubra students"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-violet-700/10" />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              About DarulKubra Quran Center
            </h2>
            <p className="mt-3 text-gray-600">
              DarulKubra Quran Center is dedicated to nurturing students in
              faith, character, and wellbeing. This system strengthens that
              mission by giving staff clear tools to identify needs early,
              coordinate care, and support each learner’s mental health journey.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <Users2 className="mt-0.5 text-violet-600" size={18} />
                Student‑centered assessments and follow‑ups
              </li>
              <li className="flex items-start gap-2">
                <CalendarDays className="mt-0.5 text-sky-600" size={18} />
                Organized appointments and timely interventions
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 text-emerald-600" size={18} />
                Privacy and confidentiality by design
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Students Supported",
              value: "1,200+",
              icon: Users2,
              color: "text-violet-600",
            },
            {
              label: "Monthly Sessions",
              value: "500+",
              icon: CalendarDays,
              color: "text-sky-600",
            },
            {
              label: "Care Satisfaction",
              value: "4.8/5",
              icon: HeartHandshake,
              color: "text-rose-600",
            },
            {
              label: "Improvement Rate",
              value: "65%",
              icon: BarChart3,
              color: "text-emerald-600",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur"
            >
              <div className="flex items-center gap-3">
                <s.icon className={`${s.color}`} />
                <div className="text-2xl font-bold text-gray-900">
                  {s.value}
                </div>
              </div>
              <div className="mt-1 text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Built for student mental wellbeing
          </h2>
          <p className="mt-2 text-gray-600">
            Simple tools for staff. Reassuring care for students. Measurable
            results.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: CheckCircle2,
              title: "General Case Management",
              desc: "Open and track cases with status, notes, and a clear timeline.",
              color: "text-violet-600",
            },
            {
              icon: CalendarDays,
              title: "Smart Scheduling",
              desc: "Coordinate sessions, reduce no‑shows, and stay on schedule.",
              color: "text-sky-600",
            },
            {
              icon: BarChart3,
              title: "Outcome Tracking",
              desc: "Monitor progress and solved problems to guide next steps.",
              color: "text-emerald-600",
            },
            {
              icon: ShieldCheck,
              title: "Privacy First",
              desc: "Role‑based access and secure handling of sensitive data.",
              color: "text-indigo-600",
            },
            {
              icon: HeartHandshake,
              title: "Compassionate Care",
              desc: "Support students with empathy, dignity, and consistency.",
              color: "text-rose-600",
            },
            {
              icon: Sparkles,
              title: "Modern & Simple",
              desc: "A clean interface that saves time and reduces errors.",
              color: "text-amber-600",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-violet-100 to-sky-100 opacity-60 blur-2xl transition group-hover:scale-110" />
              <f.icon className={`mb-3 ${f.color}`} />
              <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            How it works at DarulKubra
          </h2>
          <p className="mt-2 text-gray-600">
            From intake to outcomes—guided steps to support every student.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            {[
              {
                step: "01",
                title: "Identify & Register",
                desc: "Capture essential information and initial observations.",
              },
              {
                step: "02",
                title: "Open a General Case",
                desc: "Set goals, priorities, and plan the appropriate care path.",
              },
              {
                step: "03",
                title: "Schedule Sessions",
                desc: "Coordinate appointments and track session notes securely.",
              },
              {
                step: "04",
                title: "Review Progress",
                desc: "Measure outcomes and adapt support as students improve.",
              },
            ].map((it) => (
              <div key={it.step} className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white">
                  {it.step}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{it.title}</div>
                  <div className="text-sm text-gray-600">{it.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src="/c1.jpg"
              alt="Guided care process"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-violet-800/20" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-violet-100 p-3 text-violet-700">
                <Quote />
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  “This system helps our team support students more
                  effectively.”
                </div>
                <div className="text-sm text-gray-600">
                  Staff Member, DarulKubra Quran Center
                </div>
              </div>
            </div>
            <ul className="flex flex-wrap gap-3 text-xs text-gray-600">
              <li className="rounded-full bg-violet-50 px-3 py-1">
                Faster intakes
              </li>
              <li className="rounded-full bg-sky-50 px-3 py-1">
                Fewer no‑shows
              </li>
              <li className="rounded-full bg-emerald-50 px-3 py-1">
                Clear outcomes
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-violet-600 to-sky-600 px-8 py-10 text-white md:flex-row">
          <div>
            <h3 className="text-2xl font-bold">
              Ready to support your students?
            </h3>
            <p className="mt-1 text-white/90">
              Start with DarulKubra’s tailored workflow and see the difference.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/60">
        <div className="mx-auto max-w-7xl px-6 py-6 text-sm text-gray-600">
          © {new Date().getFullYear()} MindCare for DarulKubra Quran Center. All
          rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Page;
