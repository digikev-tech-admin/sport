import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Frown, RefreshCcw, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { ReCloudinary } from "../cloudinary";
import Image from "next/image";
import {
  createLocation,
  getLocationById,
  updateLocation,
} from "@/api/location";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import LocationMap from "../LocationMap";
import { getAllEvents } from "@/api/event";
import { getAllPackages } from "@/api/package";
import { Event } from "@/types/types";
import { Package } from "@/types/types";
import PackageCard from "../Package/packageCard";
import EventCard from "../ModuleCard";

const locationSchema = z.object({
  address: z.string().min(1, "Please add an address"),
  image: z.string().min(1, "Please add an image"),
  facilities: z.array(z.string()).min(1, "Please add at least one facility"),
  about: z.string().min(1, "Please add an about"),
  city: z.string().min(1, "Please add a city"),
  state: z.string().min(1, "Please add a state"),
  zipCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type LocationFormValues = z.infer<typeof locationSchema>;

interface FormData {
  photo: string;
}

const LocationForm = ({ id ,isEditing}: { id?: string,isEditing?:boolean }) => {
  const router = useRouter();

  const [facilities, setFacilities] = useState<string[]>([
    "Wi-Fi",
    "Payment Counter",
    "Membership Desk",
    "Gym",
    "Parking Area",
    "Restrooms",
    "Cafeteria",
    "Changing Rooms",
    "Locker Rooms",
    "Auditorium",
    "Meeting Rooms",
    "Childcare Room",
  ]);
  const [newFacility, setNewFacility] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [formData, setFormData] = useState<FormData>({ photo: "" });
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    setValue,
    watch,
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
  });

  useEffect(() => {
    const fetchEvents = async () => {
      // setLoading(true);
      try {
        const eventsData = await getAllEvents();
        console.log({ eventsData });
        const filteredEvents = eventsData.filter(
          (event: any) => event?.locationId?._id === id
        );

        const formattedEvents = filteredEvents?.map((event: any) => ({
          id: event?._id,
          title: event?.title,
          imageUrl: event?.image,
          toDate: event?.toDate,
          fromDate: event?.fromDate,
          location: event?.locationId?.city,
          sport: event?.sport,
          ageGroup: event?.ageGroup,
          interested: event?.enrolledCount,
        }));
        console.log("Formatted events:", formattedEvents);
        setEvents(formattedEvents);
      } catch (error) {
        console.error("err", error);
      }
    };
    if (id) {
      fetchEvents();
    }
  }, [id]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getAllPackages();
        const filteredPackages = response.filter(
          (pkg: any) => pkg?.locationId?._id === id
        );
        console.log("Packages fetched:", response);
        const formattedPackages = filteredPackages?.map((item: any) => ({
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
        console.log("Formatted packages:", formattedPackages);
        setPackages(formattedPackages);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    if (id) {
      fetchPackages();
    }
  }, [id]);

  const handleAddFacility = () => {
    if (newFacility.trim() && !facilities.includes(newFacility.trim())) {
      const updatedFacilities = [...facilities, newFacility.trim()];
      setFacilities(updatedFacilities);
      setValue("facilities", updatedFacilities); // Update form value
      setNewFacility("");
    }
  };

  const handleDeleteFacility = (index: number) => {
    const updatedFacilities = facilities.filter((_, i) => i !== index);
    setFacilities(updatedFacilities);
    setValue("facilities", updatedFacilities); // Update form value
  };

  useEffect(() => {
    // Initialize form with default facilities
    setValue("facilities", facilities);
  }, [facilities, setValue]);

  useEffect(() => {
    // console.log(id);
    const fetchLocation = async () => {
      if (!id) return;
      try {
        const location = await getLocationById(id);
        setFormData({ photo: location.image });
        setValue("address", location.address);
        setValue("city", location.city);
        setValue("state", location.state);
        setValue("zipCode", location.zipCode);
        setValue("about", location.about);
        setValue("image", location.image);
        if (location.latitude !== undefined)
          setValue("latitude", Number(location.latitude));
        if (location.longitude !== undefined)
          setValue("longitude", Number(location.longitude));

        // Set facilities if they exist
        if (location.facilities && location.facilities.length > 0) {
          setFacilities(location.facilities);
          setValue("facilities", location.facilities);
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };
    fetchLocation();
  }, [id, setValue]);

  // Generate Google Static Maps API URL
  const generateStaticMapUrl = (lat: number, lng: number, zoom: number = 15, size: string = "400x300") => {
    console.log("Generating static map URL for coordinates:", { lat, lng });
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("Google Maps API key not found");
      return null;
    }
    
    const baseUrl = "https://maps.googleapis.com/maps/api/staticmap";
    const params = new URLSearchParams({
      center: `${lat},${lng}`,
      zoom: zoom.toString(),
      size: size,
      markers: `color:red|${lat},${lng}`,
      key: apiKey,
    });
    
    return `${baseUrl}?${params.toString()}`;
  };

  const onSubmit = async (data: LocationFormValues) => {
    try {
      // Generate static map URL if coordinates are available
      let locationImageUrl = null;
    if (data.latitude && data.longitude) {
      locationImageUrl = generateStaticMapUrl(data.latitude, data.longitude);
      if (!locationImageUrl) {
        toast.error("Failed to generate map image. Please check API configuration.");
        return;
      }
      console.log("Generated Static Map URL:", locationImageUrl);
      console.log("Coordinates used:", { lat: data.latitude, lng: data.longitude });
    } else {
      console.log("No coordinates available for static map generation");
    }
      const submitData = {
        ...data,
        image: formData.photo,
        facilities: facilities,
        locationImageUrl, // Add the static map URL to submission
      };

      console.log("Submitting data:", submitData);

      if (id) {
        await updateLocation(id, submitData);
        toast.success("Location updated successfully");
      } else {
        await createLocation(submitData);
        toast.success("Location created successfully");
      }

      // router.push("/location");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form");
    }
  };


  // Console logging for debugging
  console.log("Current form values:", {
    latitude: watch("latitude"),
    longitude: watch("longitude"),
    address: watch("address"),
    city: watch("city"),
    state: watch("state"),
    zipCode: watch("zipCode")
  });
  
  // Log when coordinates change
  const currentLat = watch("latitude");
  const currentLng = watch("longitude");
  
  React.useEffect(() => {
    if (currentLat && currentLng) {
      console.log("Coordinates updated:", { lat: currentLat, lng: currentLng });
      const mapUrl = generateStaticMapUrl(currentLat, currentLng);
      if (mapUrl) {
        console.log("Generated map URL:", mapUrl);
      } else {
        console.warn("Failed to generate map URL: Invalid coordinates or API key");
      }
    }
  }, [currentLat, currentLng]);

  return (
    <div className="flex items-center justify-center py-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full min-w-xl bg-white rounded-xl border p-2 sm:p-8 space-y-6"
      >
        <div className="space-y-2">
          <label className="">Upload Photo</label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full border h-10 rounded-md flex items-center px-4">
              <p className="text-sm font-bold text-gray-700 opacity-70 max-w-md line-clamp-1">
                {formData.photo
                  ? formData.photo.split("/").pop()
                  : "Select a file"}
              </p>
            </div>

            <div className="flex gap-1">
              {formData.photo && (
                <div className="w-10 h-10 rounded-md overflow-hidden border">
                  <Image
                    src={formData.photo}
                    alt="Uploaded photo"
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                  />
                </div>
              )}
              <ReCloudinary
                id="profilePic"
                initialUrl={formData.photo}
                onSuccess={(res) => {
                  const imgUrl = res.url;
                  setFormData((prev: FormData) => ({ ...prev, photo: imgUrl }));
                  setValue("image", imgUrl); // Set the form value for validation
                }}
                btnClassName="border border-[#c858ba] bg-[#7421931A] text-sm !px-4  text-[#742193] p-1 rounded-lg"
                btnIcon={""}
                btnText="Choose File"
                isAlwaysBtn
                isImgPreview={false}
                disabled={!isEditing}
              />
              {formData.photo && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="border border-[#c858ba] bg-[#7421931A] text-sm  text-[#742193] p-1 rounded-lg"
                  onClick={() => {
                    setFormData((prev: FormData) => ({ ...prev, photo: "" }));
                    setValue("image", ""); // Clear the form value
                  }}
                  disabled={!isEditing}
                >
                  <Trash2 />
                </Button>
              )}
            </div>
          </div>
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}
        </div>


        <LocationMap
          value={{
            address: watch("address") || "",
            city: watch("city") || "",
            state: watch("state") || "",
            zipCode: watch("zipCode") || "",
            lat: watch("latitude"),
            lng: watch("longitude"),
          }}
          onChange={(v) => {
            if (v.address !== undefined) setValue("address", v.address);
            if (v.city !== undefined) setValue("city", v.city);
            if (v.state !== undefined) setValue("state", v.state);
            if (v.zipCode !== undefined) setValue("zipCode", v.zipCode);
            if (v.lat !== undefined) setValue("latitude", v.lat);
            if (v.lng !== undefined) setValue("longitude", v.lng);
          }}
          country={["us", "gb", "in"]}
          height={400}
        />
        <div>
          <label htmlFor="address" className="block mb-1">
            Address
          </label>
          <input
            id="address"
            type="text"
            {...register("address")}
            className="w-full p-2 border rounded"
            placeholder="Enter your address"
            disabled={!isEditing}
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="city" className="block mb-1">
            City
          </label>
          <input
            id="city"
            type="text"
            {...register("city")}
            className="w-full p-2 border rounded"
            placeholder="Enter your city"
            disabled={!isEditing}
          />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="state" className="block mb-1">
            Country
          </label>
          <input
            id="state"
            type="text"
            {...register("state")}
            className="w-full p-2 border rounded"
            placeholder="Enter your country"
            disabled={!isEditing}
          />
          {errors.state && (
            <p className="text-red-500 text-sm">{errors.state.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="zipCode" className="block mb-1">
            Post Code
          </label>
          <input
            id="zipCode"
            type="text"
            {...register("zipCode")}
            className="w-full p-2 border rounded"
            placeholder="Enter your post code"
            disabled={!isEditing}
          />
          {errors.zipCode && (
            <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Latitude</label>
            <input
              type="text"
              value={watch('latitude') || ''}
              readOnly
              className="w-full p-2 border rounded bg-gray-50"
              placeholder="Select location on map"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Longitude</label>
            <input
              type="text"
              value={watch('longitude') || ''}
              readOnly
              className="w-full p-2 border rounded bg-gray-50"
              placeholder="Select location on map"
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Static Map Preview */}
        {watch('latitude') && watch('longitude') && generateStaticMapUrl(watch('latitude')!, watch('longitude')!) ? (
  <div>
    <label className="block mb-2 text-sm font-medium">Location Map Preview</label>
    <div className="border rounded p-2 bg-gray-50">
       <Image
         src={generateStaticMapUrl(watch('latitude')!, watch('longitude')!) || ''}
         alt="Location map"
         width={400}
         height={300}
         className="w-full h-48 object-cover rounded"
         onLoad={() => console.log("Static map loaded successfully")}
         onError={() => console.error("Failed to load static map")}
       />
      <p className="text-xs text-gray-500 mt-1">
        This map will be saved as locationImageUrl in your database
      </p>
    </div>
  </div>
) : (
  <p className="text-sm text-gray-500">Select a location to see the map preview</p>
)}

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 ">
            <label className="text-sm font-bold text-gray-700">
              Facilities
            </label>
            <div className="flex flex-wrap gap-2 mb-2 mt-2">
              {facilities.map((spec, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  <span>{spec}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteFacility(index)}
                    className="text-red-500 hover:text-red-600 "
                    disabled={!isEditing}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                value={newFacility}
                onChange={(e) => setNewFacility(e.target.value)}
                placeholder="Add facility like Wi-Fi, Payment Counter, parking area etc."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFacility();
                  }
                }}
                disabled={!isEditing}
              />
              <Button
                type="button"
                onClick={handleAddFacility}
                className="commonDarkBG text-white hover:bg-[#581770]"
                disabled={!isEditing}
              >
                Add
              </Button>
            </div>
            {errors.facilities && (
              <p className="text-red-500 text-sm">
                {errors.facilities.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="about" className="block mb-1">
            About
          </label>
          <textarea
            id="about"
            {...register("about")}
            className="w-full p-2 border rounded"
            rows={4}
            disabled={!isEditing}
            placeholder="Enter your description of your location..."
          />
          <p className="text-sm text-gray-500 mt-1">
            You can include web links in your description. They will be
            automatically detected and made clickable.
          </p>
          {errors.about && (
            <p className="text-red-500 text-sm">{errors.about.message}</p>
          )}
        </div>

       

        {/* Hidden inputs to ensure lat/lng are submitted */}
        <input
          type="hidden"
          {...register("latitude", { valueAsNumber: true })}
        />
        <input
          type="hidden"
          {...register("longitude", { valueAsNumber: true })}
        />

        {id && (
          <>
            <div>
              <h3 className="text-[#742193] font-semibold mb-2 ">
                {" "}
                Associated Packages
              </h3>
              {packages?.length === 0 ? (
                <>
                  <div className="flex justify-center items-center gap-2">
                    <Frown className="darkText" />
                    <p className="text-gray-500 text-center">
                      No packages associated with this location.
                    </p>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2  gap-5 mb-5">
                  {/* lg:grid-cols-3 */}
                  {packages.map((item) => (
                    <PackageCard
                      key={item.id}
                      item={item}
                      // onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
              <button
                className=" px-4 py-2 commonDarkBG text-white hover:bg-[#581770] rounded-lg"
                onClick={() => (window.location.href = "/packages")}
              >
                View All Packages
              </button>
            </div>

            <div>
              <h3 className="text-[#742193] font-semibold  ">
                {" "}
                Associated Events
              </h3>
              {events?.length === 0 ? (
                <>
                  <div className="flex justify-center items-center gap-2">
                    <Frown className="darkText" />
                    <p className="text-gray-500 text-center">
                      No events match your search criteria.
                    </p>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4 mb-5">
                  {/* lg:grid-cols-3 */}
                  {events.map((event) => (
                    <EventCard key={event.id} module={event} />
                  ))}
                </div>
              )}

              <button
                className=" px-4 py-2 commonDarkBG text-white hover:bg-[#581770] rounded-lg"
                onClick={() => (window.location.href = "/events")}
              >
                View All Events
              </button>
            </div>
          </>
        )}

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="flex-1 commonDarkBG text-white hover:bg-[#581770] transition-all duration-300"
            disabled={!isEditing}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <RefreshCcw className="animate-spin" size={18} />
                <span>Submitting...</span>
              </div>
            ) : (
              "Submit"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 hover:bg-orange-50 border-orange-200 text-orange-500 transition-all duration-300"
            onClick={() => {
              setFormData({ photo: "" });
              reset();
              router.push("/location");
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LocationForm;
