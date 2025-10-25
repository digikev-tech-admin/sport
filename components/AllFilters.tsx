"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltersProps {
  search: string;
  setSearch: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  title?: string;
  categories: string[];
  sortOptions: { value: string; label: string }[];
  selectedSport?: string;
  setSelectedSport?: (value: string) => void;
  sports?: string[];
  selectedAgeGroup?: string;
  setSelectedAgeGroup?: (value: string) => void;
  ageGroups?: string[];
  selectedClub?: string;
  setSelectedClub?: (value: string) => void;
  clubs?: string[];
  selectedCoach?: string;
  setSelectedCoach?: (value: string) => void;
  coaches?: string[];
  noOfFilters?: number;
}

const Filters: React.FC<FiltersProps> = ({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
  title,
  sortOptions,
  selectedSport,
  setSelectedSport,
  sports,
  selectedAgeGroup,
  setSelectedAgeGroup,
  ageGroups,
  selectedClub,
  setSelectedClub,
  clubs,
  selectedCoach,
  setSelectedCoach,
  coaches,
  noOfFilters = 3,
}) => {
  return (
    <div className={`grid grid-cols-1 gap-4 ${noOfFilters === 3 ? "md:grid-cols-3" : "md:grid-cols-7"}`}>
      <div>
        <h3 className="text-[#742193] font-semibold text-sm">Search</h3>
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-[#742193] focus:outline-none focus:ring-0 "
        />
      </div>


      <div>
        <h3 className="text-[#742193] font-semibold text-sm">{title || "Category"}</h3>
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          
        >
          <SelectTrigger className="border-[#742193] focus:outline-none focus:ring-0">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category} onClick={(e) => e.stopPropagation()}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {noOfFilters > 3 && (
        <>
      <div>
        <h3 className="text-[#742193] font-semibold text-sm">{"Sport"}</h3>
        <Select
          value={selectedSport}
          onValueChange={setSelectedSport}
          
        >
          <SelectTrigger className="border-[#742193] focus:outline-none focus:ring-0">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {sports?.map((category) => (
              <SelectItem key={category} value={category} onClick={(e) => e.stopPropagation()}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-[#742193] font-semibold text-sm">{ "Age Group"}</h3>
        <Select
          value={selectedAgeGroup}
          onValueChange={setSelectedAgeGroup}
          
        >
          <SelectTrigger className="border-[#742193] focus:outline-none focus:ring-0">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {ageGroups?.map((category) => (
              <SelectItem key={category} value={category} onClick={(e) => e.stopPropagation()}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
            </SelectContent>
          </Select>
        </div>
        {clubs && setSelectedClub && selectedClub !== undefined && (
          <div>
            <h3 className="text-[#742193] font-semibold text-sm">{"Club"}</h3>
            <Select value={selectedClub} onValueChange={setSelectedClub}>
              <SelectTrigger className="border-[#742193] focus:outline-none focus:ring-0">
                <SelectValue placeholder="Select club" />
              </SelectTrigger>
              <SelectContent>
                {clubs.map((club) => (
                  <SelectItem key={club} value={club} onClick={(e) => e.stopPropagation()}>
                    {club.charAt(0).toUpperCase() + club.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {coaches && setSelectedCoach && selectedCoach !== undefined && (
          <div>
            <h3 className="text-[#742193] font-semibold text-sm">{"Coach"}</h3>
            <Select value={selectedCoach} onValueChange={setSelectedCoach}>
              <SelectTrigger className="border-[#742193] focus:outline-none focus:ring-0">
                <SelectValue placeholder="Select coach" />
              </SelectTrigger>
              <SelectContent>
                {coaches.map((coach) => (
                  <SelectItem key={coach} value={coach} onClick={(e) => e.stopPropagation()}>
                    {coach.charAt(0).toUpperCase() + coach.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        </>
      )}
    

      <div>
        <h3 className="text-[#742193] font-semibold text-sm">Sort By</h3>
        <Select
          value={sortBy}
          onValueChange={setSortBy}
        >
          <SelectTrigger className="border-[#742193] focus:outline-none focus:ring-0">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(({ value, label }) => (
              <SelectItem key={value} value={value} onClick={(e) => e.stopPropagation()}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

    </div>
  );
};

export default Filters;
