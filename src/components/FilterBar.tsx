
import { Button } from "@/components/ui/button";
import { Calendar, ArrowDown } from "lucide-react";

type TimeFilter = "day" | "week" | "month" | "all";

interface FilterBarProps {
  onTimeFilterChange: (filter: TimeFilter) => void;
  selectedTimeFilter: TimeFilter;
}

const FilterBar = ({ onTimeFilterChange, selectedTimeFilter }: FilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-between items-center pb-2">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedTimeFilter === "day" ? "default" : "outline"}
          size="sm"
          onClick={() => onTimeFilterChange("day")}
          className="flex items-center gap-1"
        >
          <Calendar className="h-4 w-4" />
          Hoje
        </Button>
        <Button
          variant={selectedTimeFilter === "week" ? "default" : "outline"}
          size="sm"
          onClick={() => onTimeFilterChange("week")}
        >
          Semana
        </Button>
        <Button
          variant={selectedTimeFilter === "month" ? "default" : "outline"}
          size="sm"
          onClick={() => onTimeFilterChange("month")}
        >
          Mês
        </Button>
        <Button
          variant={selectedTimeFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onTimeFilterChange("all")}
        >
          Todas
        </Button>
      </div>
      
      <Button variant="ghost" size="sm" className="flex items-center">
        <ArrowDown className="h-4 w-4 mr-2" />
        Data
      </Button>
    </div>
  );
};

export default FilterBar;
