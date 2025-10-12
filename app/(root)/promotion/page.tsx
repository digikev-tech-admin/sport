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
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

// import toast from "react-hot-toast";
import Loader from "@/components/shared/Loader";
import PromotionTable from "@/components/promotion/PromotionTable";
import PromotionGroup from "@/components/promotion/PromotionGroup";
import { getAllCarouselCards } from "@/api/promotion";
import { PromotionGroup as PromotionGroupType } from "@/types/promotion";

const Page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <PromotionPage />
    </Suspense>
  );
};

const PromotionPage = () => {
  const [promotionGroups, setPromotionGroups] = useState<PromotionGroupType[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<"promotions" | "promotions_cards">(
    "promotions"
  );

  const router = useRouter();

  // Handle URL tab parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'promotions_cards') {
      setActiveTab('promotions_cards');
    } else if (tab === 'promotions') {
      setActiveTab('promotions');
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const groups = await getAllCarouselCards();
        console.log(groups);
        setPromotionGroups(groups);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);



  const handleAddPromotion = () => {
    router.push(
      `${
        activeTab === "promotions"
          ? "/promotion/addPromotion"
          : "/promotion/addPromotionCard"
      }`
    );
  };

  const handleEditGroup = (groupId: string) => {
    // TODO: Implement edit group functionality
    router.push(`/promotion/editPromotionCard/${groupId}`);
    console.log("Edit group:", groupId);
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
              onClick={() => {
                setActiveTab("promotions");
                router.push("/promotion?tab=promotions");
              }}
            >
              Promotions Table
            </button>

            <button
              className={`font-bold text-center w-[50%] p-1 ${
                activeTab === "promotions_cards"
                  ? "border-b-2 border-[#742193] text-[#742193]"
                  : "text-black"
              }`}
              onClick={() => {
                setActiveTab("promotions_cards");
                router.push("/promotion?tab=promotions_cards");
              }}
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
        <div className="min-w-xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader />
            </div>
          ) : promotionGroups.length > 0 ? (
            <div className="space-y-6">
              {promotionGroups.map((group) => (
                <PromotionGroup
                  key={group._id}
                  group={group}
                  onEditGroup={() => handleEditGroup(group._id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No promotion groups found.</p>
              <p className="text-gray-400 text-sm mt-2">
                Create your first promotion group to get started.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Page;
