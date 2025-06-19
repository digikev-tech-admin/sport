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
import { deletePackage, getAllPackages } from "@/api/package";
import toast from "react-hot-toast";

const Page = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("all");
  
    const route = useRouter()
  

  const handleAddEvent = () => {
    route.push(`/packages/addPackage`);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deletePackage(id);
      setPackages(packages.filter((item) => item.id !== id));  
      toast.success("Package deleted successfully");

      console.log("res", res);
    } catch (error) {
      console.log("Error:", error);
      toast.error("Failed to delete package");
    }
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getAllPackages();
        console.log("Packages fetched:", response);
        const formattedPackages = response.map((item: any) => ({
        
          id: item._id,
          sport: item.sport,
          level: item.level,
          ageGroup: item.ageGroup,
          duration: item.duration,
          startDate: item.sessionDates?.[0],
          price: item.price?.base,
          seats: item.seatsCount,
          enrolled: item.enrolledCount,
          clubs: item.locationId.address + ", " + item.locationId.city + ", " + item.locationId.state, 
        }));
        console.log("Formatted packages:", formattedPackages);
        setPackages(formattedPackages);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    fetchPackages();
  }, []);



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

        return (sportMatch || levelMatch || clubsMatch) && categoryMatch;
      })
      .sort((a, b) => {
        if (sortBy === "price") {
          // Remove $ and convert to number for sorting
          const priceA = Number(a.price ?? 0);
          const priceB = Number(b.price ?? 0);
          return priceA - priceB;
        }
        if (sortBy === "seats") {
          return b.seats - a.seats;
        }
        return 0;
      });
  }, [packages, search, selectedCategory, sortBy]);

  const categories = ["all", ...Array.from(new Set(packages.map(pkg => pkg.level)))];

  const sortOptions = [
    { value: "all", label: "All" },
    { value: "price", label: "Price" },
    { value: "seats", label: "Seats" }
  ];

  return (
    <>
      <section className="h-auto   p-7">
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
                />
              </div>
              <div>
                <h3 className="text-[#742193] font-semibold  "> All Packages</h3>
             {filteredPackages.length === 0 ? (
              <>
              <div className="flex justify-center items-center gap-2">
              <Frown className="darkText"/>
              <p className="text-gray-500 text-center">
                 No packages match your search criteria.
              </p>
              </div>
              </>
             
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2  gap-5 mb-5">
                  {/* lg:grid-cols-3 */}
                  {filteredPackages.map((item) => (
                    <PackageCard
                      key={item.id}
                      item={item}
                      onDelete={handleDelete}
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
