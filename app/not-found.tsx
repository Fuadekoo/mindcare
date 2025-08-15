"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-br from-violet-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-900 dark:to-black">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-violet-400/25 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-sky-400/25 blur-3xl animate-pulse" />

      {/* Subtle radial highlights */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.08),transparent_40%),radial-gradient(ellipse_at_bottom,rgba(14,165,233,0.08),transparent_40%)]" />

      <main className="relative z-10 mx-auto flex min-h-[100dvh] max-w-3xl items-center justify-center p-6">
        <div className="w-full rounded-2xl border border-white/30 bg-white/60 p-8 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-gray-900/50">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-sky-600 text-white shadow-lg animate-float">
            <Search className="h-8 w-8" />
          </div>

          <h1 className="text-center text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-sky-600 drop-shadow-sm">
            404
          </h1>
          <p className="mt-3 text-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Page not found
          </p>
          <p className="mx-auto mt-2 max-w-xl text-center text-gray-600 dark:text-gray-400">
            The page you’re looking for doesn’t exist or may have been moved.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-white px-4 py-2 text-violet-700 shadow-sm transition hover:bg-violet-50 dark:border-white/10 dark:bg-gray-800 dark:text-violet-300 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Go back
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-sky-600 px-4 py-2 text-white shadow-md transition hover:opacity-90"
            >
              <Home className="h-4 w-4" />
              Go home
            </Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
