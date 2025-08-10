import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  className?: string;
}

export const PaginationControls = ({
  page,
  setPage,
  totalPages,
  className = "",
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const goToPreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const goToNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <Pagination className={`mt-6 flex justify-center items-center gap-4 ${className}`}>
      <PaginationContent className="flex items-center gap-3">
        <PaginationItem>
          <PaginationPrevious
            onClick={goToPreviousPage}
            aria-label="Previous page"
            className={`p-2 rounded-md transition-colors ${
              page === 1
                ? "pointer-events-none opacity-40"
                : "bg-purple-600 text-white hover:bg-purple-500 hover:text-gray-400"
            }`}
          />
        </PaginationItem>

        <PaginationItem>
          <span className="px-4 py-2 text-sm font-semibold text-purple-700 dark:text-purple-300 select-none">
            Page {page} of {totalPages}
          </span>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            onClick={goToNextPage}
            aria-label="Next page"
            className={`p-2 rounded-md transition-colors ${
              page === totalPages
                ? "pointer-events-none opacity-40"
                : "bg-purple-600 text-white hover:bg-purple-500 hover:text-gray-400"
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
