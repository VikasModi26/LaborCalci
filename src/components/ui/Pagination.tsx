import React from "react";

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

export default function Pagination({ page, setPage, totalPages }: PaginationProps) {
  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-3 py-1 border border-gray-950 dark:border-gray-300 rounded-md text-sm text-gray-950 dark:text-gray-300 disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
      <button
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-3 py-1 border border-gray-950 dark:border-gray-300 rounded-md text-sm text-gray-950 dark:text-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
