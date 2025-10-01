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
import Filters from "@/components/AllFilters";
import { Frown, Plus } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useRouter } from "next/navigation";
import { deleteLocation, getAllLocations } from "@/api/location";
import LocationCard from "@/components/location/LocationCard";
import toast from "react-hot-toast";

interface Location {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  image: string;
  about: string;
  title: string;
}

const Page = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("all");

  const route = useRouter();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations = await getAllLocations();
        // console.log(locations);
        setLocations(locations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteLocation(id);
      toast.success("Location deleted successfully");
      setLocations(locations.filter((location) => location.id !== id));
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("Error deleting location");
    }
  };

  const handleAddLocation = () => {
    // console.log("Add Module button clicked!");
    // Add your logic here (e.g., open a modal or navigate to a form)
    route.push(`/location/addLocation`);
  };

  const filteredLocations = useMemo(() => {
    return locations
      .filter((location) => {
        const searchLower = search.toLowerCase();
        const addressMatch = location.address
          .toLowerCase()
          .includes(searchLower);
        const cityMatch = location.city.toLowerCase().includes(searchLower);
        const stateMatch = location.state.toLowerCase().includes(searchLower);
        return (
          (addressMatch || cityMatch || stateMatch) &&
          (selectedCategory === "all" || location.city === selectedCategory)
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "city_asc":
            return a.city.localeCompare(b.city);
          case "city_desc":
            return b.city.localeCompare(a.city);
          case "state_asc":
            return a.state.localeCompare(b.state);
          case "state_desc":
            return b.state.localeCompare(a.state);
          default:
            return 0;
        }
      });
  }, [locations, search, selectedCategory, sortBy]);

  const allCities = locations.map((location) => location.city);
  const categories = ["all", ...Array.from(new Set(allCities))];

  const sortOptions = [
    { value: "all", label: "All" },
    { value: "city_asc", label: "City (A-Z)" },
    { value: "city_desc", label: "City (Z-A)" },
    { value: "state_asc", label: "State (A-Z)" },
    { value: "state_desc", label: "State (Z-A)" },
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
                  <BreadcrumbPage>Location</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <SectionHeader
            title="Location"
            buttonText="Add Location"
            onButtonClick={handleAddLocation}
            icon={<Plus />}
            className="mb-4"
          />

          <div className=" h-12 mt-4">
            <div className="min-w-xl mx-auto">
              {/* <div className="mb-8 space-y-4">
                <Filters
                  search={search}
                  setSearch={setSearch}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  categories={categories}
                  sortOptions={sortOptions}
                  title="City"
                />
              </div> */}
              <div>
                <h3 className="text-[#742193] font-semibold  ">
                  {" "}
                  All Locations
                </h3>
                {filteredLocations.length === 0 ? (
                  <>
                    <div className="flex justify-center items-center gap-2">
                      <Frown className="darkText" />
                      <p className="text-gray-500 text-center">
                        No locations match your search criteria.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2  gap-5 mb-5">
                    {/* lg:grid-cols-3 */}
                    {filteredLocations.map((location) => (
                      <LocationCard
                        key={location.id}
                        location={location}
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
