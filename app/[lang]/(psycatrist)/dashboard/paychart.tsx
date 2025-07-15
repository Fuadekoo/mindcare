"use client";
import { Doughnut } from "react-chartjs-2";
import React from "react";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

export function PayChart() {
    const data = {
        labels: ["Revenue", "Income", "Expense"],
        datasets: [
            {
                data: [60, 25, 15],
                backgroundColor: ["#2563eb", "#22c55e", "#a855f7"],
                borderWidth: 0,
            },
        ],
    };
    const options = {
        cutout: "70%",
        plugins: {
            legend: { display: false },
        },
    };
    return (
        <div className="bg-white rounded-xl shadow p-2 flex flex-col items-center" style={{ maxWidth: 160 }}>
            <div className="font-semibold mb-1 text-xs">Monthly Transaction</div>
            <Doughnut data={data} options={options} width={80} height={80} />
            <div className="flex gap-1 mt-2 text-[10px]">
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                    Revenue
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                    Income
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                    Expense
                </span>
            </div>
        </div>
    );
}
