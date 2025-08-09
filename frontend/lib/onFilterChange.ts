import { FiltersState } from "@/app/explore/page";

export const onFilterChange = (
  updatedFilters: Partial<FiltersState>,
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>
) => {
  setFilters((prev) => ({
    ...prev,
    ...updatedFilters,
    page: 1,
  }));
};
