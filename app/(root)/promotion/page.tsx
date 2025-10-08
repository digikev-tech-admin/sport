"use client";

import React, { useState, Suspense } from "react";
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

// import toast from "react-hot-toast";
import Loader from "@/components/shared/Loader";
import PromotionTable from "@/components/promotion/PromotionTable";

const Page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <PromotionPage />
    </Suspense>
  );
};

const PromotionPage = () => {
  // console.log({coupons});

  const [activeTab, setActiveTab] = useState<"promotions" | "promotions_cards">(
    "promotions"
  );

  const router = useRouter();



  const handleAddPromotion = () => {
    router.push(
      `${
        activeTab === "promotions"
          ? "/promotion/addPromotion"
          : "/promotion/addPromotionCard"
      }`
    );
  };

  return (
    <section className="bg-[#f9f9f9] h-50 p-2 sm:p-4 xl:p-8">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Promotion Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="h2 mt-4">Promotion Details</h1>

      <div className="flex justify-between items-center ">
        <div className="w-[40%]">
          <div className="flex flex-row justify-evenly gap-10 ">
            <button
              className={`font-bold text-center w-[50%] p-1 ${
                activeTab === "promotions"
                  ? "border-b-2 border-[#742193] text-[#742193]"
                  : "text-black"
              }`}
              onClick={() => setActiveTab("promotions")}
            >
              Promotions Table
            </button>

            <button
              className={`font-bold text-center w-[50%] p-1 ${
                activeTab === "promotions_cards"
                  ? "border-b-2 border-[#742193] text-[#742193]"
                  : "text-black"
              }`}
              onClick={() => setActiveTab("promotions_cards")}
            >
              Promotions Cards
            </button>
          </div>
        </div>
        <div>
          <SectionHeader
            buttonText={
              activeTab === "promotions"
                ? "Add New Promotion"
                : "Add New Promotion Card"
            }
            onButtonClick={handleAddPromotion}
            icon={<Plus />}
            className="mb-4"
          />
        </div>
      </div>

      {activeTab === "promotions" && (
        <div className="min-w-xl mx-auto">
          <PromotionTable />
        </div>
      )}

      {activeTab === "promotions_cards" && (
        <div className="min-w-xl mx-auto ">
                <h1>Under Development</h1>

          {/* <h2 className="darkText font-semibold mb-5">All Coupons</h2> */}
          <div className="grid grid-cols-1 lg:grid-cols-2  gap-4">
            {/* {coupons?.length > 0 ? (
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
          )} */}
          </div>
        </div>
      )}
    </section>
  );
};

export default Page;
