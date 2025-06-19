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

export interface MultiSelectOption {
  id: string | number;
  name: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
}: {
  options: MultiSelectOption[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
}) {
  const [open, setOpen] = React.useState(false);

  // Options not yet selected
  const availableOptions = options.filter(
    (opt) => !value.includes(opt.name)
  );

  return (
    <div>
      {/* Selected tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((val) => (
          <span
            key={val}
            className="flex items-center bg-purple-100 text-[#742193] rounded-full px-3 py-1 text-sm font-medium"
          >
            {val}
            <button
              type="button"
              className="ml-2 text-gray-400 hover:text-red-500"
              onClick={() => onChange(value.filter((v) => v !== val))}
            >
              <X className="w-4 h-4" />
            </button>
          </span>
        ))}
      </div>
      {/* Dropdown */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between" 
          >
            {placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {availableOptions.map((opt) => (
                  <CommandItem
                    key={opt.id}
                    value={opt.name}
                    onSelect={() => {
                      onChange([...value, opt.name]);
                      setOpen(false);
                    }}
                  >
                    {opt.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        value.includes(opt.name) ? "opacity-100" : "opacity-0"
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