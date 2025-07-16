"use client";
import { TimerIcon } from "lucide-react";
import React from "react";

function DateTimeDisplay() {
  return (
    <div className="flex items-center gap-2 px-4 py-1 rounded-lg text-primary-900 font-semibold text-base">
      <TimerIcon />
      {new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })}
    </div>
  );
}

export default DateTimeDisplay;
