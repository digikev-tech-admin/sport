"use client";

import React, { useState, Suspense, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import PlanCard from "@/components/plan&Billing/PlanCard";
import CouponCard from "@/components/plan&Billing/CouponCard";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { fetchCoupons, removeCoupon } from "@/redux/features/couponSlice";
import { fetchPlans, removePlan } from "@/redux/features/planSlice";
import toast from "react-hot-toast";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlanBillingPage />
    </Suspense>
  );
};

const PlanBillingPage = () => {
  const dispatch = useAppDispatch();
  const { plans, status: planStatus } = useAppSelector((state: RootState) => state.plan);
  const { coupons, status: couponsStatus } = useAppSelector((state: RootState) => state.coupon);


  // console.log({coupons});

  const [activeTab, setActiveTab] = useState<"plans" | "coupons">("coupons");

  const router = useRouter();

  useEffect(() => {
    if (activeTab === "plans" && !plans.length && planStatus === 'idle') {
      dispatch(fetchPlans());
    }
  }, [activeTab, dispatch, plans, planStatus]);

  useEffect(() => {
    if (activeTab === "coupons" && !coupons.length && couponsStatus === 'idle') {
      dispatch(fetchCoupons());
    }
  }, [activeTab, dispatch, coupons, couponsStatus]);

  const handleAddCoupon = () => {
    router.push(`${activeTab === "plans" ? "/plan-billing/addPlan" : "/plan-billing/addCoupon"}`);
  };

  const handleEdit = (action: 'plan' | 'coupon', id: string) => {
    if (action === "plan") {
      router.push(`/plan-billing/editPlan/${id}`);
    } else {
      router.push(`/plan-billing/editCoupon?id=${id}`);
    }
  };

  const handleDelete = (action: 'plan' | 'coupon', id: string) => {
    if (!id) {
      toast.error("Invalid ID provided!");
      return;
    }

    const thunk = action === "plan" ? removePlan : removeCoupon;

    dispatch(thunk(id))
      .unwrap()
      .then(() => {
        console.log(`${action === "plan" ? "Plan" : "Coupon"} deleted successfully!`);
      })
      .catch((error) => {
        console.error(`Failed to delete ${action}:`, error);
        toast.error(`Failed to delete ${action === "plan" ? "Plan" : "Coupon"}!`);
      });
  };

  return (
    <section className="bg-[#f9f9f9] h-50 p-7">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Subscription</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="h2 mt-4">Subscription</h1>

      <div className="flex justify-between items-center ">
        <div className="w-[40%]">
          <div className="flex flex-row justify-evenly gap-10 ">
            <button
              className={`font-bold text-center w-[50%] p-1 ${activeTab === "plans"
                ? "border-b-2 border-[#742193] text-[#742193]"
                : "text-black"
                }`}
              onClick={() => setActiveTab("plans")}
            >
              Plans
            </button>

            <button
              className={`font-bold text-center w-[50%] p-1 ${activeTab === "coupons"
                ? "border-b-2 border-[#742193] text-[#742193]"
                : "text-black"
                }`}
              onClick={() => setActiveTab("coupons")}
            >
              Coupons
            </button>
          </div>
        </div>
        <div>

          <SectionHeader
            buttonText={activeTab === "plans" ? "Add Plan" : "Add Coupon"}
            onButtonClick={handleAddCoupon}
            icon={<Plus />}
            className="mb-4"
          />
        </div>
      </div>

      {activeTab === "plans" && (
        <div className="min-w-xl mx-auto grid grid-cols-1 gap-4">
          <h2 className="darkText font-semibold -mb-1">All Plans</h2>
          {plans?.length > 0 ? (
            plans.map((plan) => (
              <PlanCard
                key={plan._id}
                title={plan.name}
                monthlyPrice={Number(plan.monthlyPrice)}
                yearlyPrice={Number(plan.yearlyPrice)}
                details={plan?.details ?? []}
                onEdit={() => handleEdit("plan", plan._id)}
                onDelete={() => handleDelete("plan", plan._id)}
              />
            ))
          ) : (
            <p className="text-gray-500">No plans found.</p>
          )}
        </div>
      )}

      {activeTab === "coupons" && (
        <div className="min-w-xl mx-auto ">
          <h2 className="darkText font-semibold -mb-1">All Coupons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
          {coupons?.length > 0 ? (
            coupons.map((coupon) => (
              <CouponCard
                key={coupon?._id}
                title={coupon?.code}
                discount={Number(coupon?.discountPercentage ?? "0")}
                isActive={coupon?.isActive ?? false}
                usedCount={coupon?.usedCount ?? 0}
                maxUses={coupon?.maxUses ?? 0}
                allowedModule={coupon?.allowedModule ?? "all"}
                onEdit={() => handleEdit("coupon", coupon?._id ?? "")}
                onDelete={() => handleDelete("coupon", coupon?._id ?? "")}
              />
            ))
          ) : (
            <p className="text-gray-500">No coupons found.</p>
          )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Page;
