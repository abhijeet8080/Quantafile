import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext
} from "@/components/ui/pagination";

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

export const PaginationControls = ({ page, setPage, totalPages }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const goToPreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const goToNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <Pagination className="mt-6 justify-center">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={goToPreviousPage}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        <PaginationItem>
          <span className="px-4 py-2 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            onClick={goToNextPage}
            className={page === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
