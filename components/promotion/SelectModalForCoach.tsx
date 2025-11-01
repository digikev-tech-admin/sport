'use client';

import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface CoachSelectItem {
  id: string;
  name: string;
  imageUrl?: string;
}

interface CoachSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coaches: CoachSelectItem[];
  initialId: string;
  onSave: (id: string) => void;
}

const CoachSelectModal: React.FC<CoachSelectModalProps> = ({
  open,
  onOpenChange,
  coaches,
  initialId,
  onSave,
}) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [localSelectedId, setLocalSelectedId] = useState(initialId);

  // Filter by search
  const filtered = useMemo(() => {
    let list = coaches;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((coach) =>
        coach.name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [coaches, search]);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setLocalSelectedId(initialId);
  }, [initialId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[80vw] !max-w-[80vw] rounded-xl p-6 top-[5vh] translate-y-0 max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Select Coach</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Search Bar */}
          <div className="grid gap-3 md:grid-cols-1">
            <SearchBar value={search} onChange={setSearch}  />
          </div>

          {/* Selected Preview */}
          {localSelectedId && (
            <div className="text-sm">
              <span className="font-medium mr-2">Selected:</span>
              <span>{coaches.find(c => c.id === localSelectedId)?.name || ''}</span>
            </div>
          )}

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-[#7421930D]">
                <TableRow>
                  <TableHead className="w-20">Sr. No.</TableHead>
                  <TableHead className="min-w-[250px]">Coach</TableHead>
                  <TableHead className="text-right w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((coach, idx) => {
                  const isSelected = localSelectedId === coach.id;
                  return (
                    <TableRow
                      key={coach.id}
                      className={
                        (isSelected ? "bg-[#7421930A] " : "") +
                        "hover:bg-accent/40"
                      }
                    >
                      <TableCell className="w-20">
                        {startIndex + idx + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={coach.imageUrl} alt={coach.name} />
                            <AvatarFallback>
                              {coach.name?.charAt(0).toUpperCase() ?? "C"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-base">{coach.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setLocalSelectedId(isSelected ? '' : coach.id);
                          }}
                        >
                          <span
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
                              isSelected ? "bg-green-200" : "bg-green-100"
                            }`}
                          >
                            {isSelected ? (
                              <Check className="h-4 w-4 text-green-700" />
                            ) : (
                              <Plus className="h-4 w-4 text-green-700" />
                            )}
                          </span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {coaches.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((p) => Math.max(1, p - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer text-[#742193] hover:text-[#57176e] hover:border hover:border-[#7421931A] hover:bg-[#7421931A]"
                      }
                    />
                  </PaginationItem>

                  {currentPage > 3 && (
                    <>
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setCurrentPage(1)}
                          isActive={currentPage === 1}
                          className="cursor-pointer text-[#742193] hover:text-[#57176e]"
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      {currentPage > 4 && <PaginationEllipsis />}
                    </>
                  )}

                  {Array.from(
                    { length: Math.min(5, totalPages) },
                    (_, i) => {
                      const pageNumber = Math.max(1, currentPage - 2) + i;
                      return pageNumber <= totalPages ? (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNumber)}
                            isActive={currentPage === pageNumber}
                            className={
                              currentPage === pageNumber
                                ? "text-[#742193] border border-[#7421931A] bg-[#7421931A]"
                                : "cursor-pointer text-[#742193] hover:text-[#57176e]"
                            }
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      ) : null;
                    }
                  )}

                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && <PaginationEllipsis />}
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setCurrentPage(totalPages)}
                          isActive={currentPage === totalPages}
                          className="cursor-pointer text-[#742193] hover:text-[#57176e]"
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer text-[#742193] hover:text-[#57176e] hover:border hover:border-[#7421931A] hover:bg-[#7421931A]"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => { onSave(localSelectedId); onOpenChange(false); }}
              className="bg-[#742193] hover:bg-[#742193]/90"
            >
              Save selection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoachSelectModal;