"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

// A simple Button component for reusability.
const Button = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Type definition for a single patient.
type Patient = {
  id: string;
  name: string;
  problemType: string;
  diagnosis: string;
  date: string;
  status: "solved" | "pending";
};

// Props for the CustomCard component.
type CustomCardProps = {
  patientHistory: Patient[];
  onDelete?: (id: string) => void; // Optional delete handler
};

const PER_PAGE_OPTIONS = [3, 6, 9, 12];

export const CustomCard: React.FC<CustomCardProps> = ({
  patientHistory,
  onDelete,
}) => {
  const router = useRouter();
  const [perPage, setPerPage] = useState(PER_PAGE_OPTIONS[1]); // Default to 6
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'solved', 'pending'

  // Memoized filtering logic
  const filteredPatients = useMemo(() => {
    return patientHistory
      .filter((patient) => {
        if (statusFilter === "all") return true;
        return patient.status === statusFilter;
      })
      .filter((patient) => {
        const query = searchQuery.toLowerCase();
        return (
          patient.name.toLowerCase().includes(query) ||
          patient.problemType.toLowerCase().includes(query) ||
          patient.diagnosis.toLowerCase().includes(query)
        );
      });
  }, [patientHistory, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredPatients.length / perPage);
  const paginatedPatients = filteredPatients.slice(
    (page - 1) * perPage,
    page * perPage
  );

  // Reset to page 1 whenever filters change
  const handleFilterChange = () => {
    setPage(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      {/* Filters and Search Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div className="relative w-full sm:w-auto">
          <Search
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search by name, problem..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleFilterChange();
            }}
            className="w-full sm:w-64 p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              handleFilterChange();
            }}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="solved">Solved</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              handleFilterChange();
            }}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-sm"
          >
            {PER_PAGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt} per page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards Grid Section */}
      {paginatedPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {paginatedPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <h2 className="text-lg font-semibold mb-1 text-gray-800">
                  {patient.name}
                </h2>
                <p className="text-sm text-gray-600 mb-1 truncate">
                  <span className="font-medium text-gray-700">Problem:</span>{" "}
                  {patient.problemType}
                </p>
                <p className="text-sm text-gray-600 mb-1 truncate">
                  <span className="font-medium text-gray-700">Diagnosis:</span>{" "}
                  {patient.diagnosis}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium text-gray-700">Date:</span>{" "}
                  {patient.date}
                </p>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                    patient.status === "solved"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {patient.status}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
                    onClick={() => router.push(`/en/case/${patient.id}`)}
                  >
                    Details
                  </Button>
                  {onDelete && (
                    <Button
                      className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200"
                      onClick={() => onDelete(patient.id)}
                      aria-label="Delete case"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          No matching history found.
        </div>
      )}

      {/* Pagination Section */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 text-sm text-gray-700">
          <div>
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {paginatedPatients.length > 0 ? (page - 1) * perPage + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900">
              {(page - 1) * perPage + paginatedPatients.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {filteredPatients.length}
            </span>{" "}
            results
          </div>
          <div className="flex items-center gap-2">
            <Button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 bg-white border border-gray-300 hover:bg-gray-100 rounded-md flex items-center"
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="px-2 py-1 font-medium">
              Page {page} of {totalPages}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 bg-white border border-gray-300 hover:bg-gray-100 rounded-md flex items-center"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};


