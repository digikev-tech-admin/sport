"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Package } from "@/types/types";
// import { packages as initialPackages } from "@/data/constants";
import Filters from "@/components/AllFilters";
import { Frown, Plus } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useRouter } from "next/navigation";
import PackageCard from "@/components/Package/packageCard";
import { getAllPackages } from "@/api/package";
// import toast from "react-hot-toast";

const Page = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("all");
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("all");

  const route = useRouter();

  const handleAddEvent = () => {
    route.push(`/packages/addPackage`);
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getAllPackages();
        console.log("Packages fetched:", response);
        const formattedPackages = response?.map((item: any) => ({
          id: item?._id,
          title: item?.title,
          sport: item?.sport,
          level: item?.level,
          ageGroup: item?.ageGroup,
          duration: item?.duration,
          startDate: item?.sessionDates?.[0],
          endDate: item?.sessionDates?.[1],
          coachName: item?.coachId?.name,
        
          price: item?.price?.base,
          seats: item?.seatsCount,
          enrolled: item?.enrolledCount,
          locationId: item?.locationId?._id,
          clubs:
            item?.locationId?.address +
            ", " +
            item?.locationId?.city +
            ", " +
            item?.locationId?.state,
        }));
        // console.log("Formatted packages:", formattedPackages);
        setPackages(formattedPackages);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    fetchPackages();
  }, []);

  const categories = [
    "all",
    ...Array.from(new Set(packages.map((pkg) => pkg.level))),
  ];

  const sports = [
    "all",
    ...Array.from(new Set(packages.map((pkg) => pkg.sport)))
  ];

  const ageGroups = [
    "all",
    "kids",
    "teens",
    "adults"
  ];

  const sortOptions = [
    { value: "all", label: "All" },
    { value: "price-asc", label: "Price (Low to High)" },
    { value: "price-desc", label: "Price (High to Low)" },
    { value: "startDate-asc", label: "Start Date (Earliest First)" },
    { value: "startDate-desc", label: "Start Date (Latest First)" },
  ];

  const filteredPackages = useMemo(() => {
    return packages
      .filter((item) => {
        const searchLower = search.toLowerCase();
        const sportMatch = item.sport.toLowerCase().includes(searchLower);
        const levelMatch = item.level.toLowerCase().includes(searchLower);
        const clubsMatch = item.clubs.toLowerCase().includes(searchLower);

        // Category filter by level
        const categoryMatch =
          selectedCategory === "all" ||
          item.level.toLowerCase() === selectedCategory.toLowerCase();

        // Sport filter
        const sportFilterMatch =
          selectedSport === "all" ||
          item.sport.toLowerCase() === selectedSport.toLowerCase();

        // Age group filter
        const ageGroupFilterMatch =
          selectedAgeGroup === "all" ||
          item.ageGroup.toLowerCase() === selectedAgeGroup.toLowerCase();

        return (
          (sportMatch || levelMatch || clubsMatch) &&
          categoryMatch &&
          sportFilterMatch &&
          ageGroupFilterMatch
        );
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") {
          const priceA = Number(a.price ?? 0);
          const priceB = Number(b.price ?? 0);
          return priceA - priceB;
        }
        if (sortBy === "price-desc") {
          const priceA = Number(a.price ?? 0);
          const priceB = Number(b.price ?? 0);
          return priceB - priceA;
        }
        if (sortBy === "startDate-asc") {
          const dateA = new Date(a.startDate).getTime();
          const dateB = new Date(b.startDate).getTime();
          return dateA - dateB;
        }
        if (sortBy === "startDate-desc") {
          const dateA = new Date(a.startDate).getTime();
          const dateB = new Date(b.startDate).getTime();
          return dateB - dateA;
        }
        if (sortBy === "seats") {
          return b.seats - a.seats;
        }
        return 0;
      });
  }, [packages, search, selectedCategory, sortBy, selectedSport, selectedAgeGroup]);

  return (
    <>
      <section className="h-auto   p-2 sm:p-4 xl:p-8">
        <div className="">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Packages</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <SectionHeader
            title="Packages"
            buttonText="Add Package"
            onButtonClick={handleAddEvent}
            icon={<Plus />}
            className="mb-4"
          />

          <div className=" h-12 mt-4">
            <div className="min-w-xl mx-auto">
              <div className="mb-8 space-y-4">
                <Filters
                  search={search}
                  setSearch={setSearch}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  categories={categories}
                  sortOptions={sortOptions}
                  selectedSport={selectedSport}
                  setSelectedSport={setSelectedSport}
                  sports={sports}
                  selectedAgeGroup={selectedAgeGroup}
                  setSelectedAgeGroup={setSelectedAgeGroup}
                  ageGroups={ageGroups}
                  noOfFilters={5}
                  title="Level"
                />
              </div>
              <div>
                <h3 className="text-[#742193] font-semibold  ">
                  {" "}
                  All Packages
                </h3>
                {filteredPackages.length === 0 ? (
                  <>
                    <div className="flex justify-center items-center gap-2">
                      <Frown className="darkText" />
                      <p className="text-gray-500 text-center">
                        No packages match your search criteria.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2  gap-5 mb-5">
                    {/* lg:grid-cols-3 */}
                    {filteredPackages.map((item) => (
                      <PackageCard
                        key={item.id}
                        item={item}
                        // onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
