import { useEffect, useMemo, useState } from "react";
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
import {
  ageGroups,
  formatPaymentLabel,
  levels,
  paymentMethodOptions,
  sportsOptions,
} from "@/data/constants";
import { format } from "date-fns";
import ButtonLoader from "../shared/ButtonLoader";
import PackageUserTable from "../Package/PackageUserTable";
import { getUsersByEventId } from "@/api/notification";
import { MultiSelect } from "../Coache/ClubMultiSelect";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";




const EventForm = ({
  id,
  isEditing,
  setIsEditing,
}: {
  id: string;
  isEditing: boolean;
  setIsEditing?: (isEditing: boolean) => void;
}) => {
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
  const [showLiveEventWarning, setShowLiveEventWarning] = useState(false);
  const [hasCheckedLiveStatus, setHasCheckedLiveStatus] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  // const [paymentDueDate, setPaymentDueDate] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterPaymentOptions, setFilterPaymentOptions] = useState<string[]>(
    []
  );
  const [sortOption, setSortOption] = useState("default");
  const calculateDurationInMonths = (startISO: string, endISO: string) => {
    const start = new Date(startISO);
    const end = new Date(endISO);
    const diffMs = end.getTime() - start.getTime();
    if (Number.isNaN(diffMs) || diffMs <= 0) return "";
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const monthsDecimal = diffDays / 30;
    return monthsDecimal.toFixed(1);
  };

  const calculateDurationInMinutes = (fromISO: string, toISO: string) => {
    const start = new Date(fromISO);
    const end = new Date(toISO);
    const diffMs = end.getTime() - start.getTime();
    if (Number.isNaN(diffMs) || diffMs <= 0) return "";
    const minutes = Math.ceil(diffMs / (1000 * 60));
    return minutes.toString();
  };
  const sessionDurationInMonths = useMemo(() => {
    if (!fromDate || !toDate) return null;
    const diff = calculateDurationInMonths(fromDate, toDate);
    const numericDiff = parseFloat(diff);
    return Number.isNaN(numericDiff) ? null : numericDiff;
  }, [fromDate, toDate]);
  const canEditPaymentMethods =
    sessionDurationInMonths === null || sessionDurationInMonths > 2;

  const availablePaymentMethodOptions = useMemo(() => {
    if (canEditPaymentMethods) return paymentMethodOptions;
    return paymentMethodOptions.filter(
      (option) => option.name !== "Monthly Mandate"
    );
  }, [canEditPaymentMethods]);

  useEffect(() => {
    if (!canEditPaymentMethods && paymentMethods.includes("Monthly Mandate")) {
      setPaymentMethods((prev) =>
        prev.filter((method) => method !== "Monthly Mandate")
      );
    }
  }, [canEditPaymentMethods, paymentMethods]);
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
      setDuration("");
    } else {
      setDateError(false);
      if (newFromDate && toDate && new Date(newFromDate) < new Date(toDate)) {
        setDuration(calculateDurationInMinutes(newFromDate, toDate));
      }
    }
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToDate = e.target.value;
    setToDate(newToDate);

    // If both dates are set, validate them
    if (fromDate && newToDate && new Date(fromDate) >= new Date(newToDate)) {
      toast.error("From Date must be earlier than To Date");
      setDateError(true);
      setDuration("");
    } else {
      setDateError(false);
      if (fromDate && newToDate && new Date(fromDate) < new Date(newToDate)) {
        setDuration(calculateDurationInMinutes(fromDate, newToDate));
      }
    }
  };
  // console.log(level);

  // const handleAddSessionDate = () => {
  //   if (dateInput) {
  //     setSessionDates((prev) => [...prev, dateInput]);
  //     setDateInput("");
  //   }
  // };

  // Handle editing state change - show warning if event is live
  useEffect(() => {
    // Only check when isEditing becomes true and we haven't checked yet
    if (id && isEditing && fromDate && !hasCheckedLiveStatus) {
      // Check if event is live (start date has been reached)
      const eventStartDate = new Date(fromDate);
      const eventEndDate = toDate ? new Date(toDate) : null;
      const now = new Date();
      const isLive = eventEndDate
        ? now >= eventStartDate && now <= eventEndDate
        : now >= eventStartDate;

      if (isLive) {
        // Event is live and user is trying to edit - show warning
        setShowLiveEventWarning(true);
        // Temporarily prevent editing
        if (setIsEditing) {
          setIsEditing(false);
        }
      } else {
        // Event is not live, allow editing without warning
        setHasCheckedLiveStatus(true);
      }
    }

    // Reset check status when editing is turned off
    if (!isEditing) {
      setHasCheckedLiveStatus(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, fromDate, toDate, id, hasCheckedLiveStatus]);

  

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
          setPaymentMethods(event?.paymentMethods || []);
          // setPaymentDueDate(
          //   event?.paymentDueDate
          //     ? format(new Date(event.paymentDueDate), "yyyy-MM-dd'T'HH:mm")
          //     : ""
          // );

          const eventUsers = await getUsersByEventId(id);
          console.log("Event Users Response:", eventUsers);
          const users = eventUsers?.map((item: any, index: number) => ({
            _id: item._id,
            id: index + 1,
            userId: item.userId._id,
            date: item?.createdAt,
            name: item.userId.name || "N/A",
            email: item.userId.email || "N/A",
            phone: item.userId.phone || "N/A",
            avatar: item.userId.avatar || "https://github.com/shadcn.png",
            status: item.status || "N/A",
            fcmToken: item.userId.fcmToken || "N/A",
            profileName: item?.profileId?.name || item.userId.name || "N/A",
            level: event?.level || "N/A",
            ageGroup: event?.ageGroup || "N/A",
            price: item?.amount || "0",
            basePrice: (event?.ticketCost ?? 0).toString(),
            paymentMethod: item?.paymentMethod || "Credit Card",
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

  // Handle warning dialog confirmation
  const handleConfirmEdit = () => {
    setShowLiveEventWarning(false);
    // Set flag first to prevent re-checking when isEditing becomes true
    setHasCheckedLiveStatus(true);
    // Now enable editing - useEffect won't trigger warning because hasCheckedLiveStatus is true
    if (setIsEditing) {
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setShowLiveEventWarning(false);
    setHasCheckedLiveStatus(false);
  };

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
      // paymentDueDate: paymentDueDate,
      paymentMethods: paymentMethods,
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

  const handleUserUpdate = (id: string, updates: any) => {
    setEventUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, ...updates } : u))
    );
  };

  const sortUsers = (users: any[]) => {
    const sortable = [...users];

    const getNumber = (value: string | number | null | undefined) => {
      if (typeof value === "number") return value;
      if (!value) return 0;
      const numeric = parseFloat(String(value).replace(/[^\d.-]/g, ""));
      return Number.isNaN(numeric) ? 0 : numeric;
    };

    switch (sortOption) {
      case "name-asc":
        return sortable.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "", undefined, {
            sensitivity: "base",
          })
        );
      case "name-desc":
        return sortable.sort((a, b) =>
          (b.name || "").localeCompare(a.name || "", undefined, {
            sensitivity: "base",
          })
        );
      case "date-newest":
        return sortable.sort(
          (a, b) =>
            new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
        );
      case "date-oldest":
        return sortable.sort(
          (a, b) =>
            new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
        );
      case "amount-low-high":
        return sortable.sort((a, b) => getNumber(a.price) - getNumber(b.price));
      case "amount-high-low":
        return sortable.sort((a, b) => getNumber(b.price) - getNumber(a.price));
      default:
        return sortable;
    }
  };

  // console.log({ dates: toDate, fromDate });

  useEffect(() => {
    const uniquePaymentMethods = Array.from(
      new Set(eventUsers.map((u: any) => u.paymentMethod))
    );
  
    // Optional: sort alphabetically
    uniquePaymentMethods.sort();
  
    setFilterPaymentOptions(uniquePaymentMethods);
    if (!filterPayment) {
      setFilterPayment("all");
    }
  }, [eventUsers, filterPayment]);
  

  const getFilteredUsers = () => {
    const filtered = eventUsers
      .filter((u) => u.name?.toLowerCase().includes(filterName.toLowerCase()))
      .filter((u) =>
        filterPayment && filterPayment !== "all"
          ? u.paymentMethod === filterPayment
          : true
      )
      .filter((u) =>
        filterDate
          ? new Date(u.date).toISOString().slice(0, 10) === filterDate
          : true
      );

    return sortUsers(filtered);
  };

  return (
    <div id="event" className="flex items-center justify-center p-1 sm:p-4">
      <AlertDialog open={showLiveEventWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Warning: Event is Live</AlertDialogTitle>
            <AlertDialogDescription>
              {eventName} is already live. Are you sure you want to change the
              details?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelEdit}>No</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmEdit}
              className="commonDarkBG text-white hover:bg-[#581770]"
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                      enableCropping={true}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  From Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={fromDate}
                  onChange={handleFromDateChange}
                  className={`w-full ${
                    dateError ? "border-red-500 focus:border-red-500" : ""
                  }`}
                  disabled={!isEditing}
                  min={!id ? new Date().toISOString().slice(0, 16) : undefined}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  To Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={toDate}
                  onChange={handleToDateChange}
                  className={`w-full ${
                    dateError ? "border-red-500 focus:border-red-500" : ""
                  }`}
                  disabled={!isEditing}
                  min={!id ? new Date().toISOString().slice(0, 16) : undefined}
                />
              </div>
              {dateError && (
                <div className="md:col-span-2">
                  <p className="text-red-500 text-sm mt-1">
                    From Date must be earlier than To Date
                  </p>
                </div>
              )}
            </div>

            {/* Keeping upload section commented as-is */}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Duration (minutes)
              </label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Auto-calculated from dates (editable)"
                min={1}
                step={1}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="">
                <label className="text-sm font-bold text-gray-700">
                  Payment Methods
                </label>
                <MultiSelect
                  options={availablePaymentMethodOptions}
                  value={paymentMethods}
                  onChange={setPaymentMethods}
                  placeholder="Select payment methods"
                  searchPlaceholder="Search payment methods..."
                  disabled={!isEditing}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Select one or more payment methods that will be accepted for
                  this event.
                </p>
              </div>
              {/* <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Payment due date
                </label>
                <Input
                  type="datetime-local"
                  value={paymentDueDate}
                  onChange={(e) => setPaymentDueDate(e.target.value)}
                  min={!id ? new Date().toISOString().slice(0, 16) : undefined}
                  required
                  disabled={!isEditing}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Users must complete payment before this deadline
                </p>
              </div> */}
            </div>

            {id && !isEditing && (
              <>
                <h1 className="text-sm font-bold text-gray-700 mt-2">
                  Users Enrolled in this Event
                </h1>

                {/* Filter Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4 bg-gray-50 p-3 rounded-lg">
                  {/* Filter by Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">
                      Filter by Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Search name..."
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                    />
                  </div>

                  {/* Filter by Payment Method */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">
                      Payment Method
                    </label>
                    <Select
                      value={filterPayment}
                      onValueChange={setFilterPayment}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All methods" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>

                        {filterPaymentOptions.map((method) => (
                          <SelectItem key={method} value={method}>
                            {formatPaymentLabel(method)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filter by Joining Date */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Join Date</label>
                    <Input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                    />
                  </div>

                  {/* Sort Users */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Sort Users</label>
                    <Select value={sortOption} onValueChange={setSortOption}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">All</SelectItem>
                        <SelectItem value="name-asc">Name (A → Z)</SelectItem>
                        <SelectItem value="name-desc">Name (Z → A)</SelectItem>
                        <SelectItem value="date-newest">Join Date (Newest)</SelectItem>
                        <SelectItem value="date-oldest">Join Date (Oldest)</SelectItem>
                        <SelectItem value="amount-low-high">Amount (Low → High)</SelectItem>
                        <SelectItem value="amount-high-low">Amount (High → Low)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="text-sm mt-7 bg-[#742193] hover:!bg-[#57176e] text-[#ffffff]"
                    onClick={() => {
                      setFilterName("");
                      setFilterPayment("all");
                      setFilterDate("");
                      setSortOption("default");
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>

                <div className="mt-2">
                  {" "}
                  {eventUsers.length > 0 ? (
                    <PackageUserTable
                      users={getFilteredUsers()}
                      onEdit={(id) => console.log(`Edit user ${id}`)}
                      disabled={!canEditPaymentMethods}
                      onUserUpdate={handleUserUpdate}
                      availablePaymentMethodOptions={availablePaymentMethodOptions}
                      // canEditPaymentMethods={canEditPaymentMethods}
                    />
                  ) : (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        No users enrolled in this event
                      </p>
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
                  setPaymentMethods([]);

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
