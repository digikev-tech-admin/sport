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
// import { events as initialEvents } from "@/data/constants";
import Filters from "@/components/AllFilters";
import { Frown, Plus } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useRouter } from "next/navigation";
import EventCard from "@/components/ModuleCard";
import { deleteEvent, getAllEvents } from "@/api/event";
import toast from "react-hot-toast";

export interface Event {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
  location: string;
  interested: number;
  sport: string;
  ageGroup: string;
}

const Page = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const handleDelete = async (id: string) => {
    try {
      await deleteEvent(id);
      setEvents(events.filter((event) => event.id !== id));
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error((error as string) || "Error deleting event");
    }
  };
  const route = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const eventsData = await getAllEvents();
        console.log({ eventsData });
        const formattedEvents = eventsData?.map((event: any) => ({
          id: event?._id,
          title: event?.title,
          imageUrl: event?.image,
          date: event?.eventDate,
          location:
            event?.locationId?.address +
            ", " +
            event?.locationId?.city +
            ", " +
            event?.locationId?.state,
          sport: event?.sport,
          ageGroup: event?.ageGroup,
          interested: event?.enrolledCount,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("err", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleAddEvent = () => {
    // console.log("Add Module button clicked!");
    // Add your logic here (e.g., open a modal or navigate to a form)
    route.push(`/events/addEvent`);
  };

  const filteredEvents = useMemo(() => {
    return events
      .filter(
        (event) =>
          (event.title.toLowerCase().includes(search.toLowerCase()) ||
            event.sport.toLowerCase().includes(search.toLowerCase())) &&
          (selectedCategory === "all" || event.ageGroup === selectedCategory)
      )
      .sort((a, b) => {
        if (sortBy === "date") {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === "interested") {
          return b.interested - a.interested;
        }
        return 0;
      });
  }, [events, search, selectedCategory, sortBy]);

  const categories = ["all", ...new Set(events.map((e) => e.ageGroup))];

  const sortOptions = [
    { value: "date", label: "Date" },
    { value: "interested", label: "Interested" },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

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
                  <BreadcrumbPage>Events</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <SectionHeader
            title="Events"
            buttonText="Add Event"
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
                  title="Age Group"
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  categories={categories}
                  sortOptions={sortOptions}
                />
              </div>
              <div>
                <h3 className="text-[#742193] font-semibold  "> All Events</h3>
                {filteredEvents.length === 0 ? (
                  <>
                    <div className="flex justify-center items-center gap-2">
                      <Frown className="darkText" />
                      <p className="text-gray-500 text-center">
                        No events match your search criteria.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2  gap-5 mb-5">
                    {/* lg:grid-cols-3 */}
                    {filteredEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        module={event}
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
