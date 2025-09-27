"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteLocation, getLocationById } from "@/api/location";
import { makeLinksClickable } from "@/lib/utils";
import Image from "next/image";
import toast from "react-hot-toast";

interface Location {
  id: string;
  address: string;
  image: string;
  city: string;
  state: string;
  zipCode: string;
  about: string;
  facilities?: string[];
}

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);
  const router = useRouter();
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const locationData = await getLocationById(id);
        console.log({ locationData });
        setLocation(locationData);
      } catch (error) {
        console.error("Error fetching location:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocation();
  }, [id]);

  if (loading) {
    return (
      <section className="bg-[#f9f9f9] min-h-screen p-2 sm:p-4 xl:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#742193] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading location details...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!location) {
    return (
      <section className="bg-[#f9f9f9] min-h-screen p-2 sm:p-4 xl:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600">Location not found</p>
            <Button onClick={() => router.push("/location")} className="mt-4">
              Back to Locations
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const handleDelete = async () => {
    try {
      const response = await deleteLocation(id);
      console.log("Location deleted:", response);
      toast.success("Location deleted successfully");
      router.push("/location");
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("Error deleting location");
    }
    
  };

  return (
    <section className="bg-[#f9f9f9] min-h-screen p-2 sm:p-4 xl:p-8">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/location">Location</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Location Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-start gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Location Details
            </h1>
          </div>
          <div className="flex items-center gap-2">
          <Button
            onClick={() => handleDelete()}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
          >
            <Edit className="w-4 h-4" />
            Delete 
          </Button>
          <Button
            onClick={() => router.push(`/location/${id}`)}
            className="flex items-center gap-2 bg-[#742193] hover:bg-[#581770]"
          >
            <Edit className="w-4 h-4" />
            Edit 
          </Button>


          </div>
  
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {/* Image Section */}
          <div className="relative h-64 w-full">
            <Image
              src={location.image}
              alt={`${location.city} location`}
              fill
              className="object-cover"
            />
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-6">
            {/* Address Section */}
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-[#742193] mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {location.address}
                </h2>
              </div>
            </div>

            {/* Facilities Section */}
            <div className="">
              {/* <h3 className="text-lg font-semibold text-gray-900 mb-3">Facilities</h3> */}
              <div className="text-gray-900 leading-relaxed whitespace-pre-wrap flex flex-wrap gap-2">
                {location.facilities?.map((facility, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 rounded-full px-2 py-1 text-sm"
                  >
                    {facility}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1  gap-1 text-sm text-gray-600">
              <h2 className="text-lg font-bold text-gray-900">Address</h2>
              <div className="flex justify-start flex-col">
                <div>
                  {/* <span className="font-medium text-gray-900">City:</span> */}
                  <span className="">{location.city}</span>
                </div>
                <div>
                  <span className="">{location.state}</span>{" "}
                  <span className="ml-2">{location.zipCode}</span>
                </div>
              </div>
            </div>

            {/* About Section */}
            {/* {location.about && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Location</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {makeLinksClickable(location.about)}
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
