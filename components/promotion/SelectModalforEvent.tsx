'use client'

import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
// import SortSelect from "@/components/SortSelect";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export interface EventSelectItem {
  id: string;
  title: string;
  imageUrl: string;
  location?: string;
  fromDate: string;
  toDate: string;
  ageGroup?: string;
  sport?: string;
  interested?: number;
}

interface EventSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: EventSelectItem[];
  initialId: string;
  onSave: (id: string) => void;
}

const EventSelectModal: React.FC<EventSelectModalProps> = ({ open, onOpenChange, events, initialId, onSave }) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy] = useState("date");
  const [localSelectedId, setLocalSelectedId] = useState(initialId);

  const categories = useMemo(() => {
    const set = new Set<string>(["all"]);
    events.forEach((e) => e.ageGroup && set.add(e.ageGroup));
    return Array.from(set);
  }, [events]);

  const locationOptions = useMemo(() => {
    const set = new Set<string>(["all"]);
    events.forEach((e) => e.location && set.add(e.location));
    return Array.from(set);
  }, [events]);

  const filteredEvents = useMemo(() => {
    let list = events;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) => e.title.toLowerCase().includes(q) || e.sport?.toLowerCase().includes(q));
    }
    if (selectedCategory !== "all") {
      list = list.filter((e) => e.ageGroup === selectedCategory);
    }
    if (selectedLocation !== "all") {
      list = list.filter((e) => e.location === selectedLocation);
    }
    return list.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.toDate).getTime() - new Date(a.toDate).getTime();
      }
      return 0;
    });
  }, [events, search, selectedCategory, selectedLocation, sortBy]);

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset local when initial changes (e.g., reopen)
  useEffect(() => {
    setLocalSelectedId(initialId);
  }, [initialId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[80vw]  !max-w-[80vw] rounded-xl p-6 top-[5vh] translate-y-0 max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Select Event</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              {/* <div className="text-xs text-muted-foreground mb-1">Search</div> */}
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <div>
              {/* <div className="text-xs text-muted-foreground mb-1">Level</div> */}
              <CategoryFilter title="Age Group" value={selectedCategory} onChange={setSelectedCategory} subscriptionOptions={categories} />
            </div>
            <div>
              <CategoryFilter title="Location" value={selectedLocation} onChange={setSelectedLocation} subscriptionOptions={locationOptions} />
            </div>
            {/* <div>
              <div className="text-xs text-muted-foreground mb-1">Sort By</div>
              <SortSelect value={sortBy} onChange={setSortBy} />
            </div> */}
          </div>

          {localSelectedId && (
            <div className="text-sm">
              <span className="font-medium mr-2">Selected:</span>
              <span>{events.find(e => e.id === localSelectedId)?.title || ''}</span>
            </div>
          )}

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-[#7421930D]">
                <TableRow>
                  <TableHead className="w-20">Sr. No.</TableHead>
                  <TableHead className="min-w-[200px]">Name</TableHead>
                  <TableHead className="min-w-[180px]">Location</TableHead>
                  <TableHead className="min-w-[180px]">Age Group</TableHead>
                  <TableHead className="min-w-[180px]">Date</TableHead>
                  <TableHead className="text-right w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((ev, idx) => {
                  const isSelected = localSelectedId === ev.id;
                  return (
                    <TableRow key={ev.id} className={(isSelected ? 'bg-[#7421930A] ' : '') + 'hover:bg-accent/40'}>
                      <TableCell className="w-20">{startIndex + idx + 1}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={ev.imageUrl} alt={ev.title} />
                            <AvatarFallback>{ev.title?.charAt(0) ?? 'E'}</AvatarFallback>
                          </Avatar>
                          <span>{ev.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>{ev.location}</TableCell>
                      <TableCell>{ev.ageGroup}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{new Date(ev.fromDate).toLocaleDateString('en-GB')}</span>
                          <span className="text-xs text-muted-foreground">{new Date(ev.toDate).toLocaleDateString('en-GB')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setLocalSelectedId(isSelected ? '' : ev.id)
                          }}
                        >
                          <span className={(isSelected ? 'bg-green-200 ' : 'bg-green-100 ') + 'inline-flex h-8 w-8 items-center justify-center rounded-full'}>
                            {isSelected ? <Check  className="text-green-700" /> : <Plus className="text-green-700" />}
                          </span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {events.length > ITEMS_PER_PAGE && <div className="flex justify-center">
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
          }

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={() => { onSave(localSelectedId); onOpenChange(false); }} className="bg-[#742193] hover:bg-[#742193]/90">Save selection</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventSelectModal;