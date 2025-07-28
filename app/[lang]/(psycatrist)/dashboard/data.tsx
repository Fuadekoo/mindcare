"use client";
import React from "react";
import useAction from "@/hooks/useActions";
import { getTodayAppointments } from "@/actions/psycatrist/appointment";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZES = [1, 10, 25, 50, 100];

function Data() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [appointmentsResponse, , isLoadingAppointments] = useAction(
    getTodayAppointments,
    [true, () => {}],
    page,
    pageSize
  );

  const rows =
    (appointmentsResponse?.data || []).map((item: any) => ({
      key: String(item.id),
      id: String(item.id),
      patient: item.student?.name ?? "N/A",
      time: item.time ?? "N/A",
    })) || [];

  const pagination = appointmentsResponse?.pagination;

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to the first page
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Today's Appointments
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            disabled={isLoadingAppointments}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoadingAppointments ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="border border-gray-200 rounded-lg">
            <Table aria-label="Today's Appointments">
              <TableHeader>
                <TableColumn className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </TableColumn>
                <TableColumn className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </TableColumn>
              </TableHeader>
              <TableBody
                items={rows}
                emptyContent={"No appointments found for today."}
              >
                {(item) => (
                  <TableRow
                    key={item.key}
                    className="hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                  >
                    <TableCell className="px-6 py-4 text-sm text-gray-800">
                      {item.patient}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-800">
                      {item.time}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination controls */}
          {pagination && pagination.totalRecords > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 text-sm text-gray-700">
              <div>
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {Math.min((page - 1) * pageSize + 1, pagination.totalRecords)}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-900">
                  {Math.min(page * pageSize, pagination.totalRecords)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {pagination.totalRecords}
                </span>{" "}
                results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={
                    !pagination.hasPreviousPage || isLoadingAppointments
                  }
                  className="p-2 bg-white border border-gray-300 hover:bg-gray-100 rounded-md disabled:opacity-50 flex items-center"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-2 font-medium">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.hasNextPage || isLoadingAppointments}
                  className="p-2 bg-white border border-gray-300 hover:bg-gray-100 rounded-md disabled:opacity-50 flex items-center"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Data;
