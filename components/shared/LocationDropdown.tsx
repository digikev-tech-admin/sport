"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
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
import { getAllLocations } from "@/api/location";

export interface LocationOption {
  id: string | number;
  name: string;
  
}

// this is a dropdown for the location 
export function LocationDropdown({ 
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
  const [locationData, setLocationData] = React.useState<LocationOption[]>([]);
  const [selectedLocation, setSelectedLocation] = React.useState<LocationOption | null>(null);

  React.useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations = await getAllLocations();
        const formattedLocations = locations.map((location: any) => ({
          id: location._id,
          name: location.address + ", " + location.city + ", " + location.state,
        }));
        setLocationData(formattedLocations);
        
        // Set the selected location based on the value (ID)
        if (value) {
          const selected = formattedLocations.find((loc: LocationOption) => loc.id === value);
          setSelectedLocation(selected || null);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, [value]);

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between truncate capitalize " 
            disabled={disabled}
          >
            {selectedLocation?.name || placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-y-auto">
                {locationData.map((opt: LocationOption) => (
                  <CommandItem
                    key={opt.id}
                    value={opt.name}
                    onSelect={() => {
                      onChange(opt.id.toString());
                      setSelectedLocation(opt);
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