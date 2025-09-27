"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getAllCoaches } from "@/api/coach";

export interface CoachOption {
  id: string | number;
  name: string;
}

// this is a dropdown for the location 
export function SingleCoachDropdown({ 
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  disabled = false,
}: {
  value: string;
  onChange: (selected: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [coachData, setCoachData] = React.useState<CoachOption[]>([]);
  const [selectedCoach, setSelectedCoach] = React.useState<CoachOption | null>(null);

  React.useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const coaches = await getAllCoaches();
        const formattedCoaches = coaches.map((coach: any) => ({
          id: coach._id,
          name: coach.name,
        }));
        setCoachData(formattedCoaches);
        
        // Set the selected location based on the value (ID)
        if (value) {
          const selected = formattedCoaches.find((coach: CoachOption) => coach.id === value);
          setSelectedCoach(selected || null);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchCoaches();
  }, [value]);

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between truncate capitalize" 
            disabled={disabled}
          >
            {selectedCoach?.name || placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-y-auto">
                {coachData.map((opt: CoachOption) => (
                  <CommandItem
                    key={opt.id}
                    value={opt.name}
                    onSelect={() => {
                      onChange(opt.id.toString());
                      setSelectedCoach(opt);
                      setOpen(false);
                    }}
                    disabled={disabled}
                  >
                    <span className="truncate">{opt.name}</span>
                    <Check
                      className={cn(
                        "ml-auto",
                        value === opt.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
} 