import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Select tags",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckboxChange = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  if (!options) {
    return <></>;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="text-left truncate">
          {selected.length > 0 ? selected.join(", ") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-4 rounded-lg shadow-lg">
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div key={option} className="flex items-center gap-2">
              <Checkbox
                id={option}
                checked={selected.includes(option)}
                onCheckedChange={() => handleCheckboxChange(option)}
              />
              <label htmlFor={option} className="text-sm">
                {option}
              </label>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="mt-2 w-full text-red-600"
          onClick={handleClearAll}
        >
          Clear All
        </Button>
      </PopoverContent>
    </Popover>
  );
};
