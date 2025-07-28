"use client";
import React, { useState, useEffect } from "react";
import useAction from "@/hooks/useActions";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { getGraphData, getYear } from "@/actions/psycatrist/dashboard";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronDown, Loader2 } from "lucide-react";

function Graph() {
  // State for the selected year, defaulting to the current year
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  // Fetch the list of available years from the database
  const [yearsResponse] = useAction(getYear, [true, () => {}]);

  // Fetch graph data based on the selected year
  const [graphData, , isLoadingGraph] = useAction(
    getGraphData,
    [true, () => {}],
    selectedYear
  );

  // When years are fetched, set the default selected year to the latest one available
  useEffect(() => {
    if (yearsResponse?.data && yearsResponse.data.length > 0) {
      const latestYear = Math.max(...yearsResponse.data);
      setSelectedYear(latestYear);
    }
  }, [yearsResponse]);

  // Handler for when a new year is selected from the dropdown
  const handleYearChange = (keys: string | Set<string> | { anchorKey?: string; currentKey?: string }) => {
    // Handle SharedSelection type from @heroui/react
    let yearKey: string | undefined;
    if (typeof keys === "string") {
      yearKey = keys;
    } else if (keys instanceof Set) {
      yearKey = Array.from(keys)[0];
    } else if (typeof keys === "object" && keys !== null) {
      yearKey = keys.currentKey ?? keys.anchorKey;
    }
    if (yearKey) {
      setSelectedYear(Number(yearKey));
    }
  };

  const years = yearsResponse?.data || [];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Case Summary - {selectedYear}
        </h3>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="flat" className="capitalize">
              {selectedYear}
              <ChevronDown size={16} className="ml-2" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Select Year"
            selectedKeys={new Set([selectedYear.toString()])}
            selectionMode="single"
            onSelectionChange={handleYearChange}
            items={years.map((year) => ({
              key: year.toString(),
              label: year.toString(),
            }))}
          >
            {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
          </DropdownMenu>
        </Dropdown>
      </div>

      {isLoadingGraph ? (
        <div className="flex justify-center items-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={graphData?.data ?? []}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              name="Total Cases"
              stroke="#8884d8"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="solved"
              name="Solved"
              stroke="#82ca9d"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="pending"
              name="Pending"
              stroke="#ffc658"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default Graph;
