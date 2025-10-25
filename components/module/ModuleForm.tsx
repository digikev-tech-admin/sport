import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader, RefreshCcw, Trash2 } from "lucide-react";
import Image from "next/image";
import { ReCloudinary } from "../cloudinary";
import { SingleSelect } from "../shared/singleChooseDropdown";
import { createEvent, getEventById, updateEvent } from "@/api/event";
import { LocationDropdown } from "../shared/LocationDropdown";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// import { formatDateTime } from "@/lib/utils";
import { ageGroups, dummyUsers, levels, sportsOptions } from "@/data/constants";
import { format } from "date-fns";
import ButtonLoader from "../shared/ButtonLoader";
import PackageUserTable from "../Package/PackageUserTable";
import { getUsersByEventId } from "@/api/notification";

const EventForm = ({ id, isEditing, setIsEditing }: { id: string; isEditing: boolean, setIsEditing?: (isEditing: boolean) => void }) => {
  const router = useRouter();
  const [eventName, setEventName] = useState("");
  const [about, setAbout] = useState("");
  // const [sessionDates, setSessionDates] = useState<string[]>([]);
  // const [dateInput, setDateInput] = useState("");
  const [locationId, setLocationId] = useState("");
  const [gameName, setGameName] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [level, setLevel] = useState("");
  const [ticketCost, setTicketCost] = useState("");
  const [duration, setDuration] = useState("");
  const [photo, setPhoto] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [newSpecialization, setNewSpecialization] = useState("");
  const [eventUsers, setEventUsers] = useState<any[]>([]);
  const [dateError, setDateError] = useState(false);
  const handleAddSpecialization = () => {
    if (
      newSpecialization.trim() &&
      !specializations.includes(newSpecialization.trim())
    ) {
      setSpecializations([...specializations, newSpecialization.trim()]);
      setNewSpecialization("");
    }
  };

  const handleDeleteSpecialization = (index: number) => {
    setSpecializations(specializations.filter((_, i) => i !== index));
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFromDate = e.target.value;
    setFromDate(newFromDate);
    
    // If both dates are set, validate them
    if (newFromDate && toDate && new Date(newFromDate) >= new Date(toDate)) {
      toast.error("From Date must be earlier than To Date");
      setDateError(true);
    } else {
      setDateError(false);
    }
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToDate = e.target.value;
    setToDate(newToDate);
    
    // If both dates are set, validate them
    if (fromDate && newToDate && new Date(fromDate) >= new Date(newToDate)) {
      toast.error("From Date must be earlier than To Date");
      setDateError(true);
    } else {
      setDateError(false);
    }
  };
  // console.log(level);

  // const handleAddSessionDate = () => {
  //   if (dateInput) {
  //     setSessionDates((prev) => [...prev, dateInput]);
  //     setDateInput("");
  //   }
  // };

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        setLoading(true);
        try {
          const event = await getEventById(id);
          // console.log({event});
          setEventName(event?.title);
          setAbout(event?.description);
          setFromDate(
            event?.fromDate
              ? format(new Date(event.fromDate), "yyyy-MM-dd'T'HH:mm")
              : ""
          );
          setToDate(
            event?.toDate
              ? format(new Date(event.toDate), "yyyy-MM-dd'T'HH:mm")
              : ""
          );

          setDuration(event?.duration);
          setLocationId(event?.locationId?._id);
          setGameName(event?.sport);
          setAgeGroup(event?.ageGroup);
          setLevel(event?.level);
          setTicketCost(event?.ticketCost);
          setCapacity(event?.capacity);
          setPhoto(event?.image);
          setSpecializations(event?.tags);
          const eventUsers = await getUsersByEventId(id);
          // console.log("Event Users Response:", eventUsers);
          const users = eventUsers?.map((item: any, index: number) => ({
            _id: item._id,
            id: index + 1,
            name: item.userId.name || "N/A",
            email: item.userId.email || "N/A",
            phone: item.userId.phone || "N/A",
            avatar: item.userId.avatar || "https://github.com/shadcn.png",
            status: item.userId.isActive || "N/A",
            profileName: item?.profileId?.name || "N/A",
            level: item?.eventId?.level || "N/A",
            ageGroup: item?.eventId?.ageGroup || "N/A",
            price: item?.amount || "N/A",
            basePrice: item?.eventId?.ticketCost || "N/A",
            paymentMethod: item?.paymentMethod || "N/A",
          }));
          // console.log("Event Users Response:", users);
          setEventUsers(users);
          // console.log(event);
        } catch (error) {
          console.error("Error fetching event:", error);
        }
        setLoading(false);
      };
      fetchEvent();
    }
  }, [id]);

  // const handleRemoveSessionDate = (idx: number) => {
  //   setSessionDates((prev) => prev.filter((_, i) => i !== idx));
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      eventName === "" ||
      about === "" ||
      fromDate === "" ||
      toDate === "" ||
      photo === "" ||
      duration === "" ||
      gameName === "" ||
      locationId === "" ||
      level === "" ||
      ticketCost === ""
    ) {
      toast.error(
        `Please fill ${
          eventName === ""
            ? "Event Name"
            : about === ""
            ? "About Event"
            : fromDate === ""
            ? "From Date"
            : toDate === ""
            ? "To Date"
            : photo === ""
            ? "Photo"
            : duration === ""
            ? "Duration"
            : gameName === ""
            ? "Game Name"
            : locationId === ""
            ? "Location"
            : level === ""
            ? "Level"
            : ticketCost === ""
            ? "Ticket Cost"
            : ""
        } the field`
      );
      return;
    }

    // Validate that From Date is earlier than To Date
    if (fromDate && toDate && new Date(fromDate) >= new Date(toDate)) {
      toast.error("From Date must be earlier than To Date");
      setDateError(true);
      return;
    }
    setDateError(false);
    const eventData = {
      title: eventName,
      description: about,
      fromDate: fromDate,
      toDate: toDate,
      image: photo,
      locationId: locationId,
      duration: parseInt(duration),
      sport: gameName,
      ageGroup: ageGroup,
      level: level,
      ticketCost: parseInt(ticketCost),
      capacity: parseInt(capacity),
      tags: specializations,
    };

    console.log("Event Data:", eventData);
    try {
      setIsSubmitting(true);
      if (id) {
        const response = await updateEvent(id, eventData);
        toast.success("Event updated successfully");
          setIsEditing?.(false);
        
        router.push(`/events/${id}/#event`);
        console.log("Event updated:", response);
      } else {
        const response = await createEvent(eventData);
        router.push("/events");
        toast.success("Event created successfully");
        console.log("Event created:", response);
      }
    } catch (error: any) {
      console.error("Error updating event:", error);
      toast.error(error || "Error updating event");
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log({ dates: toDate, fromDate });

  return (
    <div id="event" className="flex items-center justify-center p-1 sm:p-4">
      {loading && id ? (
        <Loader />
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-2 sm:p-8 space-y-6 transition-all duration-300 hover:shadow-xl"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
              {/* Image upload and preview */}
              <div className="flex flex-col items-center w-full sm:w-auto">
                <div>
                  <Image
                    src={photo || "https://github.com/shadcn.png"}
                    alt="Profile"
                    className="w-48 h-32 rounded-2xl object-cover mt-2"
                    width={192}
                    height={128}
                  />

                  <div className="flex gap-2 mt-2 justify-center">
                    <ReCloudinary
                      id="profilePic"
                      initialUrl={photo || "https://github.com/shadcn.png"}
                      onSuccess={(res) => {
                        const imgUrl = res.url;
                        setPhoto(imgUrl);
                      }}
                      btnClassName="border border-[#c858ba] bg-[#7421931A] text-sm text-[#742193] p-1 rounded-lg"
                      btnIcon={<RefreshCcw />}
                      btnText=""
                      isAlwaysBtn
                      isImgPreview={false}
                      disabled={!isEditing}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="border border-[#c858ba] bg-[#7421931A] text-sm text-[#742193] p-1 rounded-lg"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setPhoto("");
                      }}
                      disabled={!isEditing}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-1 gap-4 w-full">
                <div className="space-y-2 ">
                  <label className="text-sm font-bold text-gray-700">
                    Event Name
                  </label>
                  <Input
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Enter event name"
                    required
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2 ">
                  <label className="text-sm font-bold text-gray-700">
                    About Event
                  </label>
                  <Textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Describe the event"
                    required
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                From - To Date and Time
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="datetime-local"
                  value={fromDate}
                  onChange={handleFromDateChange}
                  className={`w-full ${dateError ? 'border-red-500 focus:border-red-500' : ''}`}
                  disabled={!isEditing}
                  min={!id ? new Date().toISOString().slice(0, 16) : undefined}
                />
                <Input
                  type="datetime-local"
                  value={toDate}
                  onChange={handleToDateChange}
                  className={`w-full ${dateError ? 'border-red-500 focus:border-red-500' : ''}`}
                  disabled={!isEditing}
                  min={!id ? new Date().toISOString().slice(0, 16) : undefined}
                />
              </div>
              {dateError && (
                <p className="text-red-500 text-sm mt-1">
                  From Date must be earlier than To Date
                </p>
              )}
            </div>

            {/* <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Upload Photo
          </label>
          <div className="flex items-center gap-4">
            <div className="w-full border h-10 rounded-md flex items-center px-4">
              <p className="text-sm font-bold text-gray-700 opacity-70 max-w-md line-clamp-1">
                {photo
                  ? photo.split("/").pop()
                  : "Select a file"}
              </p>
            </div>

            <div className="flex gap-1">
              {photo && (    
                <div className="w-10 h-10 rounded-md overflow-hidden border">
                  <Image
                    src={photo}
                    alt="Uploaded photo"
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                  />
                </div>
              )}
              <ReCloudinary
                id="profilePic"
                initialUrl={photo} 
                onSuccess={(res) => {
                  const imgUrl = res.url;
                  setPhoto(imgUrl);
                }}
                btnClassName="border border-[#c858ba] bg-[#7421931A] text-sm !px-4  text-[#742193] p-1 rounded-lg"
                btnIcon={""}
                btnText="Choose File"
                isAlwaysBtn
                isImgPreview={false}
              />
              {photo && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="border border-[#c858ba] bg-[#7421931A] text-sm  text-[#742193] p-1 rounded-lg"
                  onClick={() => {
                    setPhoto("");
                  }}
                >
                  <Trash2 />
                </Button>
              )}
            </div>
          </div>
        </div> */}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Duration (minutes)
              </label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter duration in minutes"
                min={1}
                required
                disabled={!isEditing}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Game Name
                </label>
                <SingleSelect
                  options={sportsOptions}
                  value={gameName}
                  onChange={setGameName}
                  placeholder="Select Game"
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Location
                </label>
                <LocationDropdown
                  value={locationId}
                  onChange={setLocationId}
                  placeholder="Select location"
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 capitalize">
                <label className="text-sm font-bold text-gray-700">
                  Age Group
                </label>
                <Select value={ageGroup} onValueChange={setAgeGroup}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent className="capitalize">
                    {ageGroups.map((group: string) => (
                      <SelectItem
                        key={group}
                        value={group}
                        className="capitalize"
                        disabled={!isEditing}
                      >
                        {group.charAt(0).toUpperCase() + group.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Level</label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent className="capitalize">
                    {levels?.map((lvl: { id: number; name: string }) => (
                      <SelectItem
                        key={lvl.id}
                        value={lvl.name}
                        className="capitalize"
                        disabled={!isEditing}
                      >
                        {lvl.name.charAt(0).toUpperCase() + lvl.name.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="col-span-2">
              <label className="text-sm font-bold text-gray-700">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2 mt-2">
                {specializations.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{spec}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSpecialization(index)}
                      className="text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSpecialization();
                    }
                  }}
                  disabled={!isEditing}
                />
                <Button
                  type="button"
                  onClick={handleAddSpecialization}
                  className="commonDarkBG text-white hover:bg-[#581770]"
                  disabled={!isEditing}
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Ticket Cost
                </label>
                <Input
                  type="number"
                  value={ticketCost}
                  onChange={(e) => setTicketCost(e.target.value)}
                  placeholder="Enter ticket cost"
                  min={0}
                  required
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Capacity
                </label>
                <Input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="Enter capacity"
                  min={0}
                  required
                  disabled={!isEditing}
                />
              </div>
            </div>

            {id && !isEditing && (
            <>
              <h1 className="text-sm font-bold text-gray-700 mt-2">
                Users Enrolled in this Event
              </h1>
              <div className="mt-2"> {eventUsers.length > 0 ? (
                <PackageUserTable
                  users={eventUsers || []}
                  onEdit={(id) => console.log(`Edit user ${id}`)}
                  onDelete={(id) => console.log(`Delete user ${id}`)}
                  disabled={!isEditing}
                />
              ) : (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">No users enrolled in this event</p>
                </div>
              )}
              </div>
            </>
          )}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 commonDarkBG text-white hover:bg-[#581770] transition-all duration-300"
                disabled={!isEditing}
              >
                {isSubmitting && id ? (
                  <ButtonLoader text="Updating..." />
                ) : isSubmitting ? (
                  <ButtonLoader text="Adding..." />
                ) : id ? (
                  "Update Event"
                ) : (
                  "Add Event"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 hover:bg-orange-50 border-orange-200 text-orange-500 transition-all duration-300"
                onClick={() => {
                  if (id && isEditing) {
                  if (setIsEditing) {
                    setIsEditing(false);
                    router.push(`/events/${id}?/#event`);
                    return;
                  }
                  }
                  setEventName("");
                  setAbout("");
                  setFromDate("");
                  setToDate("");
                  setSpecializations([]);
                  setNewSpecialization("");
                  setLocationId("");
                  setGameName("");
                  setAgeGroup("");
                  setLevel("");
                  setTicketCost("");
                  setDuration("");
                  setCapacity("");
                 
                  router.back();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default EventForm;
