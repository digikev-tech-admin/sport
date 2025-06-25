'use client'

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { modifyCoupon } from "@/redux/features/couponSlice";
import { ICoupon, AllowedModule } from "@/types/coupon";

interface UpdateCouponFormProps {
  initialData: ICoupon;
}

const allowedModules: AllowedModule[] = ['event', 'package', 'resource', 'all'];

const UpdateCouponForm = ({ initialData }: UpdateCouponFormProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ICoupon>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      toast.error("Coupon code is required!");
      return;
    }
    if (isNaN(formData.discountPercentage) || formData.discountPercentage < 0 || formData.discountPercentage > 100) {
      toast.error("Discount percentage must be between 0 and 100!");
      return;
    }
    if (!allowedModules.includes(formData.allowedModule)) {
      toast.error("Allowed module is required!");
      return;
    }
    if (isNaN(formData.useFrequency) || formData.useFrequency < 1) {
      toast.error("Use frequency must be at least 1!");
      return;
    }
    if (!formData.validFrom) {
      toast.error("Valid from date is required!");
      return;
    }
    if (formData.maxUses !== undefined && (isNaN(formData.maxUses) || formData.maxUses < 1)) {
      toast.error("Max uses must be at least 1!");
      return;
    }

    if (
      formData.discountPercentage &&
      (isNaN(Number(formData.discountPercentage)) ||
        Number(formData.discountPercentage) < 0 ||
        Number(formData.discountPercentage) > 100)
    ) {
      toast.error("Discount percent must be a valid number between 0 and 100!");
      return;
    }

    setLoading(true);
    const { _id, ...dataWithoutId } = formData;
    dispatch(modifyCoupon({ id: _id!, data: dataWithoutId }))
      .unwrap()
      .then(() => {
        // toast.success("Coupon updated successfully!");
        router.back();
      })
      .catch((error) => {
        console.error("Coupon update failed:", error);
        toast.error(error?.message || "Coupon update failed!");
      })
      .finally(() => setLoading(false));
  };

  const handleReset = () => {
    setFormData(initialData);
  };

  return (
    <div className="flex items-center justify-center py-4 bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full min-w-xl bg-white rounded-xl border px-8 py-6 space-y-6"
      >
        {/* Coupon Code */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Coupon Code</label>
          <Input
            placeholder="Enter Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-coupon-primary/20"
          />
        </div>

        {/* Discount Percentage */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Discount Percentage</label>
          <Input
            type="number"
            min={0}
            max={100}
            placeholder="0-100"
            value={formData.discountPercentage}
            onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-coupon-primary/20"
          />
        </div>

        {/* Allowed Module */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Allowed Module</label>
          <Select
            value={formData.allowedModule}
            onValueChange={(value) => setFormData({ ...formData, allowedModule: value as AllowedModule })}
          >
            <SelectTrigger className="w-full transition-all duration-200 focus:ring-2 focus:ring-coupon-primary/20">
              <SelectValue placeholder="Select module" />
            </SelectTrigger>
            <SelectContent>
              {allowedModules.map((module) => (
                <SelectItem key={module} value={module} className="capitalize cursor-pointer">{module}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Use Frequency */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Use Frequency</label>
          <Input
            type="number"
            min={1}
            placeholder="Use Frequency"
            value={formData.useFrequency}
            onChange={(e) => setFormData({ ...formData, useFrequency: Number(e.target.value) })}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-coupon-primary/20"
          />
        </div>

        {/* Valid From */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Valid From</label>
          <Input
            type="date"
            value={formData.validFrom ? new Date(formData.validFrom).toISOString().split('T')[0] : ""}
            onChange={(e) => setFormData({ ...formData, validFrom: new Date(e.target.value) })}
            className="w-full transition-all cursor-pointer duration-200 focus:ring-2 focus:ring-coupon-primary/20"
          />
        </div>

        {/* Valid Until */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Valid Until</label>
          <Input
            type="date"
            value={formData.validUntil ? new Date(formData.validUntil).toISOString().split('T')[0] : ""}
            onChange={(e) => setFormData({ ...formData, validUntil: new Date(e.target.value) })}
            className="w-full transition-all cursor-pointer duration-200 focus:ring-2 focus:ring-coupon-primary/20"
          />
        </div>

        {/* Is Active */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            className="cursor-pointer"
            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
            id="isActive"
          />
          <label htmlFor="isActive" className="text-sm font-bold text-gray-700">Active</label>
        </div>

        {/* Max Uses */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Max Uses</label>
          <Input
            type="number"
            min={1}
            placeholder="Max Uses"
            value={formData.maxUses ?? ""}
            onChange={(e) => setFormData({ ...formData, maxUses: Number(e.target.value) })}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-coupon-primary/20"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-[#742193] text-white px-4 py-2 rounded-lg transition-all duration-200 hover:bg-[#742193]/90 focus:ring-2 focus:ring-[#742193]/20 active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              "Update Coupon"
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-[#FFCA74] text-gray-800 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-[#FFCA74]/90 focus:ring-2 focus:ring-[#FFCA74]/20 active:scale-[0.98]"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCouponForm;
