"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllPromotions, updatePromotion } from "@/api/promotion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 5;

const PromotionTable: React.FC = () => {
  const router = useRouter();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "expired"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const response = await getAllPromotions();
      console.log("Response:", response);
      setPromotions(Array.isArray(response) ? response : []);
    } catch (error: any) {
      toast.error(error || "Failed to fetch promotions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const filtered = promotions
    .filter((p) => p.code?.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => {
      if (statusFilter === "all") return true;
      const expired = p.validUntil
        ? new Date(p.validUntil).getTime() < Date.now()
        : false;
      if (statusFilter === "expired") return expired;
      return !expired && p.status === statusFilter;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const toggleStatus = async (id: string, status: string) => {
    const next = status === "active" ? "inactive" : "active";
    try {
      await updatePromotion(id, { status: next });
      await loadPromotions();
      toast.success(`Promotion ${next}`);
    } catch (e: any) {
      toast.error(e || "Failed to update status");
    }
  };

  // const handleDelete = async (id: string) => {
  //   try {
  //     await deletePromotion(id)
  //     await loadPromotions()
  //     toast.success('Promotion deleted')
  //   } catch (e: any) {
  //     toast.error(e || 'Failed to delete promotion')
  //   }
  // }

  return (
    <div className="grid gap-4">
      <div className="flex gap-3 items-center">
        <Input
          placeholder="Search codes..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-sm"
        />
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v as any);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-[#7421930D]">
            <TableRow>
              <TableHead>Sr. No.</TableHead>
              <TableHead>Coupon Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>User Limit</TableHead>
              <TableHead>Repeat Limit</TableHead>
              <TableHead>Expiry Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8}>Loading...</TableCell>
              </TableRow>
            ) : pageItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>No results</TableCell>
              </TableRow>
            ) : (
              pageItems.map((p, idx) => (
                <TableRow key={p._id}>
                  <TableCell>{startIndex + idx + 1}</TableCell>
                  <TableCell className="font-medium">{p.code}</TableCell>
                  <TableCell>
                    {p.discountType === "flatAmount"
                      ? "Fixed Amount"
                      : "Percentage"}
                  </TableCell>
                  <TableCell>
                    {p.maxUses === null || p.maxUses === undefined
                      ? "Unlimited"
                      : p.maxUses}
                  </TableCell>
                  <TableCell>
                    {p.useFrequency === null || p.useFrequency === undefined
                      ? "Unlimited"
                      : p.useFrequency}
                  </TableCell>
                  <TableCell>
                    {new Date(p.validUntil).toLocaleString("en-GB", {
                      timeZone: 'Europe/London',
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const expired = p.validUntil
                        ? new Date(p.validUntil).getTime() < Date.now()
                        : false;
                      const label = expired
                        ? "Expired"
                        : p.status?.charAt(0).toUpperCase() +
                          p.status?.slice(1);
                      const cls = expired
                        ? "bg-red-100 text-red-700"
                        : p.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700";
                      return (
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${cls}`}
                        >
                          {label}
                        </span>
                      );
                    })()}
                  </TableCell>
                  <TableCell className="text-center">
                    {(() => {
                      const expired = p.validUntil
                        ? new Date(p.validUntil).getTime() < Date.now()
                        : false;
                      if (expired) {
                        return (
                          <>
                            <div className="inline-flex items-center gap-4">
                              <span className="text-gray-400">Expired</span>
                              <button
                                className="text-blue-600"
                                onClick={() =>
                                  router.push(
                                    `/promotion/editPromotion/${p._id}`
                                  )
                                }
                              >
                                Edit
                              </button>
                            </div>
                          </>
                        );
                      }
                      return (
                        <div className="inline-flex items-center gap-4">
                          {p.status === "inactive" ? (
                            <button
                              className="text-green-600"
                              onClick={() => toggleStatus(p._id, p.status)}
                            >
                              Activate
                            </button>
                          ) : (
                            <button
                              className="text-orange-600"
                              onClick={() => toggleStatus(p._id, p.status)}
                            >
                              Deactivate
                            </button>
                          )}
                          <button
                            className="text-blue-600"
                            onClick={() =>
                              router.push(`/promotion/editPromotion/${p._id}`)
                            }
                          >
                            Edit
                          </button>
                        </div>
                      );
                    })()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div>
          Showing{" "}
          {filtered.length === 0
            ? 0
            : Math.min(filtered.length, startIndex + 1)}
          -{Math.min(filtered.length, startIndex + pageItems.length)} of{" "}
          {filtered.length}
        </div>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className={currentPage === 1 ? "opacity-50" : "text-[#742193]"}
          >
            Previous
          </button>
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            const page = Math.max(1, currentPage - 2) + i;
            return page <= totalPages ? (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2 py-1 rounded ${
                  page === currentPage
                    ? "bg-[#7421931A] text-[#742193]"
                    : "text-[#742193]"
                }`}
              >
                {page}
              </button>
            ) : null;
          })}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className={
              currentPage === totalPages ? "opacity-50" : "text-[#742193]"
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionTable;
