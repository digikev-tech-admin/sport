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
import { Coach } from "@/types/types";
// import { coaches as initialCoaches } from "@/data/constants";
import Filters from "@/components/AllFilters";
import { Frown, Plus } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useRouter } from "next/navigation";
import CoachCard from "@/components/Coache/CoacheCard";
import { deleteCoach, getAllCoaches } from "@/api/coach";
import toast from "react-hot-toast";



const Page = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("all");
  const route = useRouter()




  const handleDelete = async(id: string) => {
    try {
      const response = await deleteCoach(id);
      console.log("Coach deleted:", response);
      toast.success("Coach deleted successfully");
      setCoaches(coaches.filter((coach) => coach.id !== id));
    } catch (error) {
      console.error("Error deleting coach:", error);
      toast.error("Error deleting coach");
    }
  };


    useEffect(() => {
      const fetchCoaches = async () => {
        try {
          const coaches = await getAllCoaches();
          console.log("Coaches fetched:", coaches);
          const formattedCoaches = coaches.map((coach: any) => ({
            id: coach._id,
            name: coach.name,
            imageUrl: coach.image,
            sports: coach.sports,
            clubs: coach.locationIds?.map((location: any) => location?.address+ " , " + location?.city + " , " + location?.state),
            specializations: coach.stats?.specializations || [],
            rating: 3,
            // averageRating: coach.averageRating,
            reviews: 20,
          }));
          setCoaches(formattedCoaches);
          console.log(formattedCoaches);
        } catch (error) {
          console.error("Error fetching coaches:", error);
        }
      };
      fetchCoaches();
    }, []);

  const handleAddEvent = () => {
    // console.log("Add Module button clicked!");
    // Add your logic here (e.g., open a modal or navigate to a form)
    route.push(`/coaches/addCoach`);

  };


  const filteredCoaches = useMemo(() => {
    return coaches
      .filter((coach) => {
        const searchLower = search.toLowerCase();
        const nameMatch = coach.name.toLowerCase().includes(searchLower);
        // const clubsMatch = coach.clubs.some(club => club.toLowerCase().includes(searchLower));
        const sportsMatch = coach.sports.some(sport =>
          sport.toLowerCase().includes(searchLower)
        );
        return (
          (nameMatch  || sportsMatch) &&
          (selectedCategory === "all" ||
            coach.sports.includes(selectedCategory))
        );
      })
      .sort((a, b) => {
        if (sortBy === "rating") {
          return b.rating - a.rating;
        }
        if (sortBy === "reviews") {
          return b.reviews - a.reviews;
        }
        return 0;
      });
  }, [coaches, search, selectedCategory, sortBy]);

  const allSports = coaches.flatMap(coach => coach.sports);
  const categories = ["all", ...Array.from(new Set(allSports))];

  const sortOptions = [
    { value: "all", label: "All" },
    { value: "rating", label: "Rating" },
    { value: "reviews", label: "Reviews" }
  ];

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
                  <BreadcrumbPage>Coaches</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>


           <SectionHeader
          title="Coaches"
          buttonText="Add Coach"
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
                <h3 className="text-[#742193] font-semibold  "> All Coaches</h3>
             {filteredCoaches.length === 0 ? (
              <>
              <div className="flex justify-center items-center gap-2">
              <Frown className="darkText"/>
              <p className="text-gray-500 text-center">
                 No coaches match your search criteria.
              </p>
              </div>
              </>
             
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2  gap-5 mb-5">
                  {/* lg:grid-cols-3 */}
                  {filteredCoaches.map((coach) => (
                    <CoachCard
                      key={coach.id}
                      coach={coach}
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

