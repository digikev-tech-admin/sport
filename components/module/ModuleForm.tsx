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
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { ReCloudinary } from "../cloudinary";
import { SingleSelect } from "../shared/singleChooseDropdown";
import { createEvent, getEventById, updateEvent } from "@/api/event";
import { LocationDropdown } from "../shared/LocationDropdown";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { formatDateTime } from "@/lib/utils";
import { ageGroups, levels, sportsOptions } from "@/data/constants";




const EventForm  = ({id}: {id: string}) => {
  const router = useRouter();
  const [eventName, setEventName] = useState("");
  const [about, setAbout] = useState("");
  const [sessionDates, setSessionDates] = useState<string[]>([]);
  const [dateInput, setDateInput] = useState("");
  const [locationId, setLocationId] = useState("");
  const [gameName, setGameName] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [level, setLevel] = useState("");
  const [ticketCost, setTicketCost] = useState("");
  const [duration, setDuration] = useState("");
  const [photo, setPhoto] = useState("");
  const [capacity, setCapacity] = useState("");
  // console.log(level);





  const handleAddSessionDate = () => {
    if (dateInput) {
      setSessionDates((prev) => [...prev, dateInput]);
      setDateInput("");
    }
  };





  useEffect(() => {
    if (id) {
    const fetchEvent = async () => {
     try {
      const event = await getEventById(id);
      setEventName(event?.title);
      setAbout(event?.description);
      setSessionDates([event?.eventDate]);
      setDuration(event?.duration);
      setLocationId(event?.locationId?._id);
      setGameName(event?.sport);
      setAgeGroup(event?.ageGroup);
      setLevel(event?.level);
      setTicketCost(event?.ticketCost);
      setCapacity(event?.capacity);
      setPhoto(event?.image);
      // console.log(event);
     } catch (error) {
      console.error("Error fetching event:", error);
      }
  };
  fetchEvent();
  } 
  }, [id]);

  const handleRemoveSessionDate = (idx: number) => {
    setSessionDates((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(eventName === "" || about === "" || sessionDates.length === 0 || photo === "" || duration === "" || gameName === "" || locationId === "" || level === "" || ticketCost === "") {
      toast.error(`Please fill ${eventName === "" ? "Event Name" : about === "" ? "About Event" : sessionDates.length === 0 ? "Session Dates" : photo === "" ? "Photo" : duration === "" ? "Duration" : gameName === "" ? "Game Name" : locationId === "" ? "Location" : level === "" ? "Level" : ticketCost === "" ? "Ticket Cost" : ""} the fields`);
      return;
    }
    const eventData = {
      title: eventName,
      description: about,
      eventDate: sessionDates[0],
      image: photo,
      locationId: locationId,
      duration: parseInt(duration),
      sport: gameName,
      ageGroup: ageGroup,
      level: level,
      ticketCost: parseInt(ticketCost),
      capacity: parseInt(capacity)
    };
  
    console.log("Event Data:", eventData);
    try {
      if (id) {
        const response = await updateEvent(id, eventData);
        toast.success("Event updated successfully");
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
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8 space-y-6 transition-all duration-300 hover:shadow-xl"
      >
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Event Name</label>
          <Input
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter event name"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">About Event</label>
          <Textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Describe the event"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Session Dates</label>
          <div className="flex gap-2">
            <Input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full"
            />
            <Button type="button" onClick={handleAddSessionDate} className="commonDarkBG text-white hover:bg-[#581770] transition-all duration-300">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {sessionDates.map((date, idx) => (
              <div key={idx} className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded">
                <span className="text-xs">{formatDateTime(date)}</span>
                <Button type="button" size="sm" variant="ghost" onClick={() => handleRemoveSessionDate(idx)}>
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>



        <div className="space-y-2">
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
        </div>









        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Duration (minutes)</label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Enter duration in minutes"
            min={1}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Game Name</label>
          <SingleSelect
            options={sportsOptions}
            value={gameName}
            onChange={setGameName}
            placeholder="Select Game"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Location</label> 
          <LocationDropdown
            value={locationId}
            onChange={setLocationId}
            placeholder="Select location"
          />
        </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 capitalize">
            <label className="text-sm font-bold text-gray-700">Age Group</label>
            <Select value={ageGroup} onValueChange={setAgeGroup}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent className="capitalize">
                {ageGroups.map((group: string) => (
                  <SelectItem key={group} value={group} className="capitalize">
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
                {levels?.map((lvl: {id: number, name: string}) => (
                  <SelectItem key={lvl.id} value={lvl.name} className="capitalize">
                    {lvl.name.charAt(0).toUpperCase() + lvl.name.slice(1)   }   
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Ticket Cost</label>
          <Input
            type="number"
            value={ticketCost}
            onChange={(e) => setTicketCost(e.target.value)}
            placeholder="Enter ticket cost"
            min={0}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Capacity</label>
          <Input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Enter capacity"
            min={0}
            required
          />
        </div>
        </div>
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="flex-1 commonDarkBG text-white hover:bg-[#581770] transition-all duration-300"
          >
            {id ? "Update Event" : "Add Event"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 hover:bg-orange-50 border-orange-200 text-orange-500 transition-all duration-300"
            onClick={() => {
              setEventName("");
              setAbout("");
              setSessionDates([]);
              setDateInput("");
              setLocationId("");
              setGameName("");
              setAgeGroup("");
              setLevel("");
              setTicketCost("");
              setDuration("");
              setCapacity("");
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
