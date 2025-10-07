'use client'

import React, { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
// import SortSelect from "@/components/SortSelect";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { formatDateTimeForPackage } from "@/lib/utils";

export interface PackageSelectItem {
  id: string;
  title: string;
  imageUrl?: string;
  clubs?: string;
  ageGroup?: string;
  coachName?: string;
  startDate?: string;
  endDate?: string;
  price?: number;
}

interface PackageSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packages: PackageSelectItem[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

const PackageSelectModal: React.FC<PackageSelectModalProps> = ({ open, onOpenChange, packages, selectedIds, setSelectedIds }) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCoach, setSelectedCoach] = useState("all");
  const [selectedClub, setSelectedClub] = useState("all");
  const [sortBy] = useState("date");

  const categories = useMemo(() => {
    const set = new Set<string>(["all"]);
    packages.forEach((p) => p.ageGroup && set.add(p.ageGroup));
    return Array.from(set);
  }, [packages]);

  const coachOptions = useMemo(() => {
    const set = new Set<string>(["all"]);
    packages.forEach((p) => p.coachName && set.add(p.coachName));
    return Array.from(set);
  }, [packages]);

  const clubOptions = useMemo(() => {
    const set = new Set<string>(["all"]);
    packages.forEach((p) => p.clubs && set.add(p.clubs));
    return Array.from(set);
  }, [packages]);

  const filtered = useMemo(() => {
    let list = packages;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.ageGroup === selectedCategory);
    }
    if (selectedCoach !== "all") {
      list = list.filter((p) => p.coachName === selectedCoach);
    }
    if (selectedClub !== "all") {
      list = list.filter((p) => p.clubs === selectedClub);
    }
    return list.sort((a, b) => {
      if (sortBy === "date") {
        const ad = a.startDate ? new Date(a.startDate).getTime() : 0;
        const bd = b.startDate ? new Date(b.startDate).getTime() : 0;
        return bd - ad;
      }
      return 0;
    });
  }, [packages, search, selectedCategory, selectedCoach, selectedClub, sortBy]);

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[80vw]  !max-w-[80vw] rounded-xl p-6 top-[5vh] translate-y-0 max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Select Packages</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <div>
              <CategoryFilter title="Age Group" value={selectedCategory} onChange={setSelectedCategory} subscriptionOptions={categories} />
            </div>
            <div>
              <CategoryFilter title="Coach" value={selectedCoach} onChange={setSelectedCoach} subscriptionOptions={coachOptions} />
            </div>
            <div>
              <CategoryFilter title="Club" value={selectedClub} onChange={setSelectedClub} subscriptionOptions={clubOptions} />
            </div>
            {/* <div>
              <SortSelect value={sortBy} onChange={setSortBy} />
            </div> */}
          </div>

          {selectedIds.length > 0 && (
            <div className="text-sm">
              <span className="font-medium mr-2">Selected:</span>
              {packages.filter(p => selectedIds.includes(p.id)).map(p => (
                <span key={p.id} className="mr-2">{p.title}</span>
              ))}
            </div>
          )}

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-[#7421930D]">
                <TableRow>
                  <TableHead className="w-20">Sr. No.</TableHead>
                  {/* <TableHead className="min-w-[220px]">Image</TableHead> */}
                  <TableHead className="min-w-[220px]">Name</TableHead>
                  <TableHead className="min-w-[180px]">Club</TableHead>
                  <TableHead className="min-w-[180px]">Coach</TableHead>
                  <TableHead className="min-w-[140px]">Age Group</TableHead>
                  <TableHead className="min-w-[200px]">Date</TableHead>
                  <TableHead className="text-right w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((pkg, idx) => {
                  const isSelected = selectedIds.includes(pkg.id);
                  return (
                    <TableRow key={pkg.id} className={(isSelected ? 'bg-[#7421930A] ' : '') + 'hover:bg-accent/40'}>
                      <TableCell className="w-20">{startIndex + idx + 1}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={pkg.imageUrl} alt={pkg.title} />
                            <AvatarFallback>{pkg.title?.charAt(0) ?? 'P'}</AvatarFallback>
                          </Avatar>
                          <span>{pkg.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>{pkg.clubs || 'N/A'}</TableCell>
                      <TableCell>{pkg.coachName || 'N/A'}</TableCell>
                      <TableCell>{pkg.ageGroup || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>
                            {(pkg.startDate ? formatDateTimeForPackage(pkg.startDate) : '—')} - {(pkg.endDate ? formatDateTimeForPackage(pkg.endDate) : '—')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setSelectedIds(isSelected ? selectedIds.filter(id => id !== pkg.id) : [...selectedIds, pkg.id])
                          }}
                        >
                          <span className={(isSelected ? 'bg-green-200 ' : 'bg-green-100 ') + 'inline-flex h-8 w-8 items-center justify-center rounded-full'}>
                            {isSelected ? <Check className="text-green-700" /> : <Plus className="text-green-700" />}
                          </span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {packages.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer text-[#742193] hover:text-[#57176e] hover:border hover:border-[#7421931A] hover:bg-[#7421931A]"} />
                  </PaginationItem>
                  {currentPage > 3 && (
                    <>
                      <PaginationItem>
                        <PaginationLink onClick={() => setCurrentPage(1)} isActive={currentPage === 1} className="cursor-pointer text-[#742193] hover:text-[#57176e]">1</PaginationLink>
                      </PaginationItem>
                      {currentPage > 4 && <PaginationEllipsis />}
                    </>
                  )}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = Math.max(1, currentPage - 2) + i;
                    return pageNumber <= totalPages ? (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink onClick={() => setCurrentPage(pageNumber)} isActive={currentPage === pageNumber} className={currentPage === pageNumber ? "text-[#742193] border border-[#7421931A] bg-[#7421931A]" : "cursor-pointer text-[#742193] hover:text-[#57176e]"}>
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    ) : null;
                  })}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && <PaginationEllipsis />}
                      <PaginationItem>
                        <PaginationLink onClick={() => setCurrentPage(totalPages)} isActive={currentPage === totalPages} className="cursor-pointer text-[#742193] hover:text-[#57176e]">{totalPages}</PaginationLink>
                      </PaginationItem>
                    </>
                  )}
                  <PaginationItem>
                    <PaginationNext onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer text-[#742193] hover:text-[#57176e] hover:border hover:border-[#7421931A] hover:bg-[#7421931A]"} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={() => onOpenChange(false)} className="bg-[#742193] hover:bg-[#742193]/90">Save selection</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackageSelectModal;


