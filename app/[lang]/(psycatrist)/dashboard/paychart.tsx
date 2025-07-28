"use client";
import React, { useMemo } from "react";
import { appointmentDashboard } from "@/actions/psycatrist/dashboard";
import useAction from "@/hooks/useActions";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

type TooltipPayload = ReadonlyArray<string>;

type Coordinate = {
  x: number;
  y: number;
};

type PieSectorData = {
  percent?: number;
  name?: string | number;
  midAngle?: number;
  middleRadius?: number;
  tooltipPosition?: Coordinate;
  value?: number;
  paddingAngle?: number;
  dataKey?: string;
  payload?: string | number;
  tooltipPayload?: ReadonlyArray<TooltipPayload>;
};

type GeometrySector = {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
};

type PieLabelProps = PieSectorData &
  GeometrySector & {
    tooltipPayload?: ReadonlyArray<TooltipPayload>;
  };

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="font-semibold"
    >
      {`${((percent ?? 0) * 100).toFixed(0)}%`}
    </text>
  );
};

function PayChart() {
  const [appointmentResponse, , isLoading] = useAction(appointmentDashboard, [
    true,
    () => {},
  ]);

  const chartData = useMemo(() => {
    if (!appointmentResponse) return [];

    const { total = 0, pending = 0, rejected = 0 } = appointmentResponse;
    const confirmed = Math.max(0, total - pending - rejected);

    return [
      { name: "Confirmed", value: confirmed },
      { name: "Pending", value: pending },
      { name: "Rejected", value: rejected },
    ].filter((d) => d.value > 0);
  }, [appointmentResponse]);

  const COLORS = {
    Confirmed: "#00C49F",
    Pending: "#FFBB28",
    Rejected: "#FF8042",
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-gray-500">No appointment data available.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center">
      <h3 className="mb-4 text-lg font-semibold text-gray-700">
        Appointment Status
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={COLORS[entry.name as keyof typeof COLORS]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PayChart;
