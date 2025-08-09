import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [status, setStatus] = useState("");
  
  const [minVotes, setMinVotes] = useState("");
  const [maxVotes, setMaxVotes] = useState("");
  const [userId, setUserId] = useState("");
const [dateRange, setDateRange] = useState<DateRange | undefined>(); 
  const handleApplyFilters = () => {
    onFilterChange({
  keyword,
  sortBy: sortBy as "newest" | "mostVoted" | "mostAnswered" | "trending" | "oldest",
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
        onChange={(e) => setKeyword(e.target.value)}
      />

      {/* Answer Status Filter */}
      <Select value={status} onValueChange={setStatus}>
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
      <Select value={sortBy} onValueChange={setSortBy}>
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
          onChange={(e) => setMinVotes(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Max Votes"
          value={maxVotes}
          onChange={(e) => setMaxVotes(e.target.value)}
        />
      </div>

      {/* Date Range Picker */}
      <CalendarDateRangePicker date={dateRange} setDate={setDateRange} />

      {/* Filter by User (Optional: only if admin/mod view) */}
      <Input
        placeholder="User ID (optional)"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      <div className="col-span-full">
        <Button onClick={handleApplyFilters} className="w-full">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};
