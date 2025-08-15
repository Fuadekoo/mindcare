"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  RotateCcw,
  Home,
  Copy,
  ChevronDown,
  ChevronUp,
  Bug,
} from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Log for monitoring
    console.error(error);
  }, [error]);

  const detailsText = useMemo(() => {
    const lines = [
      `Name: ${error?.name || "Error"}`,
      `Message: ${error?.message || "Unknown error"}`,
      error?.digest ? `Digest: ${error.digest}` : null,
      "",
      "Stack:",
      error?.stack || "No stack available.",
    ].filter(Boolean);
    return lines.join("\n");
  }, [error]);

  const copyDetails = async () => {
    try {
      await navigator.clipboard.writeText(detailsText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-900 dark:to-black">
      {/* Decorative animated blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-rose-400/25 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-amber-400/25 blur-3xl animate-pulse" />
      {/* Subtle radial highlights */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(244,63,94,0.08),transparent_40%),radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.08),transparent_40%)]" />

      <main className="relative z-10 mx-auto flex min-h-[100dvh] max-w-3xl items-center justify-center p-6">
        <div className="w-full rounded-2xl border border-white/30 bg-white/60 p-8 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-gray-900/50">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-600 to-amber-600 text-white shadow-lg animate-float">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <h1 className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-600">
            Something went wrong
          </h1>

          <p className="mt-3 text-center text-base sm:text-lg text-gray-800 dark:text-gray-100">
            {error?.message || "An unexpected error occurred."}
          </p>
          {error?.digest && (
            <p className="mt-1 text-center text-xs text-gray-500">
              Digest: <code className="font-mono">{error.digest}</code>
            </p>
          )}

          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-rose-600 to-amber-600 px-4 py-2 text-white shadow-md transition hover:opacity-90"
            >
              <RotateCcw className="h-4 w-4" />
              Try again
            </button>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2 text-rose-700 shadow-sm transition hover:bg-rose-50 dark:border-white/10 dark:bg-gray-800 dark:text-rose-300 dark:hover:bg-gray-700"
            >
              <ChevronLeftIcon />
              Go back
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-white px-4 py-2 text-amber-700 shadow-sm transition hover:bg-amber-50 dark:border-white/10 dark:bg-gray-800 dark:text-amber-300 dark:hover:bg-gray-700"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <button
              onClick={copyDetails}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              title="Copy error details"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied" : "Copy details"}
            </button>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setShowDetails((s) => !s)}
              className="mx-auto flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              aria-expanded={showDetails}
              aria-controls="error-details"
            >
              <Bug className="h-4 w-4" />
              {showDetails ? (
                <>
                  Hide technical details <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Show technical details <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
            <div
              id="error-details"
              className={`overflow-hidden transition-all duration-300 ${
                showDetails ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <pre className="mt-3 w-full overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs leading-relaxed text-gray-800 dark:border-white/10 dark:bg-gray-900 dark:text-gray-200">
                {detailsText}
              </pre>
            </div>
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

function ChevronLeftIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
