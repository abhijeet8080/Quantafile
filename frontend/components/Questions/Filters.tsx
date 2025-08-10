import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { FiltersState } from "@/app/explore/page";
import CalendarDateRangePicker from "./CalendarDateRangePicker";

export const Filters = ({
  filters,
  onFilterChange,
}: {
  filters: FiltersState;
  onFilterChange: (filters: Partial<FiltersState>) => void;
}) => {
  const [keyword, setKeyword] = useState(filters.keyword || "");
  const [sortBy, setSortBy] = useState(filters.sortBy || "");
  const [status, setStatus] = useState(filters.status || "");
  const [minVotes, setMinVotes] = useState(
    filters.minVotes !== undefined ? String(filters.minVotes) : ""
  );
  const [maxVotes, setMaxVotes] = useState(
    filters.maxVotes !== undefined ? String(filters.maxVotes) : ""
  );
  const [userId, setUserId] = useState(filters.userId || "");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: filters.startDate ? new Date(filters.startDate) : undefined,
    to: filters.endDate ? new Date(filters.endDate) : undefined,
  });

  // Optional: Sync with filters prop on mount or when it changes
  useEffect(() => {
    setKeyword(filters.keyword || "");
    setSortBy(filters.sortBy || "");
    setStatus(filters.status || "");
    setMinVotes(filters.minVotes !== undefined ? String(filters.minVotes) : "");
    setMaxVotes(filters.maxVotes !== undefined ? String(filters.maxVotes) : "");
    setUserId(filters.userId || "");
    setDateRange({
      from: filters.startDate ? new Date(filters.startDate) : undefined,
      to: filters.endDate ? new Date(filters.endDate) : undefined,
    });
  }, [filters]);

  const isVoteRangeValid =
    minVotes === "" ||
    maxVotes === "" ||
    (parseInt(minVotes) <= parseInt(maxVotes));

  const handleApplyFilters = () => {
    if (!isVoteRangeValid) return;

    onFilterChange({
      keyword,
      sortBy: sortBy as
        | "newest"
        | "mostVoted"
        | "mostAnswered"
        | "trending"
        | "oldest",
      status,
      startDate: dateRange?.from?.toISOString(),
      endDate: dateRange?.to?.toISOString(),
      minVotes: minVotes ? parseInt(minVotes) : undefined,
      maxVotes: maxVotes ? parseInt(maxVotes) : undefined,
      userId,
    });
  };

 

  return (
    <div className="grid gap-4 mb-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Keyword Search */}
      <Input
        placeholder="Search by keyword, title, or tags"
        value={keyword}
        aria-label="Search keyword"
        onChange={(e) => setKeyword(e.target.value)}
      />

      {/* Answer Status Filter */}
      <Select
        value={status}
        onValueChange={setStatus}
        aria-label="Filter by status"
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="answered">Answered</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort Options */}
      <Select
        value={sortBy}
        onValueChange={setSortBy}
        aria-label="Sort questions by"
      >
        <SelectTrigger>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="mostVoted">Most Voted</SelectItem>
          <SelectItem value="mostAnswered">Most Answered</SelectItem>
          <SelectItem value="trending">Trending</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
        </SelectContent>
      </Select>

      {/* Vote Range */}
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Min Votes"
          value={minVotes}
          aria-label="Minimum votes filter"
          onChange={(e) => setMinVotes(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Max Votes"
          value={maxVotes}
          aria-label="Maximum votes filter"
          onChange={(e) => setMaxVotes(e.target.value)}
        />
      </div>
      {!isVoteRangeValid && (
        <p className="text-red-600 text-sm col-span-full">
          Min votes cannot be greater than max votes.
        </p>
      )}

      {/* Date Range Picker */}
      <CalendarDateRangePicker date={dateRange} setDate={setDateRange} />

      {/* Filter by User (Optional) */}
      <Input
        placeholder="User ID (admin only)"
        value={userId}
        aria-label="Filter by user ID"
        onChange={(e) => setUserId(e.target.value)}
      />

      <div className="col-span-full flex gap-2">
        <Button
          onClick={handleApplyFilters}
          disabled={!isVoteRangeValid}
          className="flex-grow"
        >
          Apply Filters
        </Button>
        
      </div>
    </div>
  );
};
