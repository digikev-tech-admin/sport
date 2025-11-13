import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SingleSelect } from "../shared/singleChooseDropdown";
import {
  ageGroups,
  formatPaymentLabel,
  levels,
  paymentMethodOptions,
  sportsOptions,
} from "@/data/constants";
import { LocationDropdown } from "../shared/LocationDropdown";
import { SingleCoachDropdown } from "../shared/SingleCoachDropDown";
import { Textarea } from "../ui/textarea";
import {
  WeeklySchedule,
  WeeklyScheduleComponent,
} from "../shared/WeeklySchedule";
import { createPackage, getPackageById, updatePackage } from "@/api/package";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ButtonLoader from "../shared/ButtonLoader";
import Loader from "../shared/Loader";
import { RefreshCcw, Trash2 } from "lucide-react";
import { ReCloudinary } from "../cloudinary";
import Image from "next/image";
import PackageUserTable from "./PackageUserTable";
import { getUsersByPackageId } from "@/api/notification";
import { MultiSelect } from "../Coache/ClubMultiSelect";

const PackageForm = ({
  id,
  isEditing,
  setIsEditing,
}: {
  id?: string;
  isEditing?: boolean;
  setIsEditing?: (isEditing: boolean) => void;
}) => {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [sport, setSport] = useState("");
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("");
  const [locationId, setLocationId] = useState("");
  const [coachId, setCoachId] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [duration, setDuration] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [description, setDescription] = useState("");
  const [sessionDates, setSessionDates] = useState<string[]>(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [dateError, setDateError] = useState(false);
  const [price, setPrice] = useState({
    base: "",
    tax: "",
    discount: "",
  });

  const [filterName, setFilterName] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({});
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  // const [paymentDueDate, setPaymentDueDate] = useState("");
  const [filterPaymentOptions, setFilterPaymentOptions] = useState<string[]>(
    []
  );
  // Payment method options
  
  const today = new Date().toISOString().slice(0, 10);
  const [sortOption, setSortOption] = useState("default");

  const calculateDurationInMonths = (startISO: string, endISO: string) => {
    const start = new Date(startISO);
    const end = new Date(endISO);
    const diffMs = end.getTime() - start.getTime();
    if (Number.isNaN(diffMs) || diffMs <= 0) return "";
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const monthsDecimal = diffDays / 30; // approx months with decimals
    return monthsDecimal.toFixed(1);
  };
  const sessionDurationInMonths = useMemo(() => {
    if (!sessionDates[0] || !sessionDates[1]) return null;
    const diff = calculateDurationInMonths(sessionDates[0], sessionDates[1]);
    const numericDiff = parseFloat(diff);
    return Number.isNaN(numericDiff) ? null : numericDiff;
  }, [sessionDates]);

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

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    const newSessionDates = [newStartDate, sessionDates[1] || ""];
    setSessionDates(newSessionDates);

    // If both dates are set, validate them
    if (
      newStartDate &&
      sessionDates[1] &&
      new Date(newStartDate) >= new Date(sessionDates[1])
    ) {
      toast.error("Session Start Date must be earlier than Session End Date");
      setDateError(true);
      setDuration("");
    } else {
      setDateError(false);
      // Auto-calculate duration in months when both dates are valid
      if (
        newStartDate &&
        newSessionDates[1] &&
        new Date(newStartDate) < new Date(newSessionDates[1])
      ) {
        setDuration(
          calculateDurationInMonths(newStartDate, newSessionDates[1])
        );
      } else {
        setDuration("");
      }
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    const newSessionDates = [sessionDates[0] || "", newEndDate];
    setSessionDates(newSessionDates);

    // If both dates are set, validate them
    if (
      sessionDates[0] &&
      newEndDate &&
      new Date(sessionDates[0]) >= new Date(newEndDate)
    ) {
      toast.error("Session Start Date must be earlier than Session End Date");
      setDateError(true);
      setDuration("");
    } else {
      setDateError(false);
      // Auto-calculate duration in months when both dates are valid
      if (
        newSessionDates[0] &&
        newEndDate &&
        new Date(newSessionDates[0]) < new Date(newEndDate)
      ) {
        setDuration(calculateDurationInMonths(newSessionDates[0], newEndDate));
      } else {
        setDuration("");
      }
    }
  };

  useEffect(() => {
    if (id) {
      const fetchPackage = async () => {
        setLoading(true);
        try {
          const res = await getPackageById(id);
          console.log("res", res);
          setSport(res?.sport);
          setTitle(res?.title);
          setProfileImage(res?.image || null);
          setDescription(res?.description);
          setLevel(res?.level);
          setLocationId(res?.locationId?._id);
          setCoachId(res?.coachId?._id);
          setAgeGroup(res?.ageGroup);
          setDuration(res?.duration);
          setTotalSeats(res?.seatsCount);
          setPrice({
            base: res?.price?.base,
            tax: res?.price?.tax,
            discount: res?.price?.discount,
          });
          setSessionDates([
            res?.sessionDates[0] ? res.sessionDates[0].slice(0, 10) : "",
            res?.sessionDates[1] ? res.sessionDates[1].slice(0, 10) : "",
          ]);
          setWeeklySchedule(res?.weeklySchedule);
          setPaymentMethods(res?.paymentMethods || []);
          // setPaymentDueDate(
          //   res?.paymentDueDate
          //     ? format(new Date(res.paymentDueDate), "yyyy-MM-dd'T'HH:mm")
          //     : ""
          // );
          const packageUsers = await getUsersByPackageId(id);
          console.log("Package Users Response:", packageUsers);
          const users = packageUsers?.map((item: any, index: number) => ({
            _id: item._id,
            id: index + 1,
            userId: item.userId?._id,
            date: item?.createdAt,
            name: item.userId.name || "N/A",
            email: item.userId.email || "N/A",
            phone: item.userId.phone || "N/A",
            avatar: item.userId.avatar || "https://github.com/shadcn.png",
            status: item.status || "pending",
            profileName: item?.profileId?.name || item.userId.name || "N/A",
            level: item?.packageId?.level || res?.level || "N/A",
            ageGroup: item?.packageId?.ageGroup || res?.ageGroup || "N/A",
            price: item?.amount || "N/A",
            basePrice:
              item?.packageId?.price?.base || res?.price?.base || "N/A",
            paymentMethod: item?.paymentMethod || "Credit Card",
          }));
          // console.log("Package Users Response:", users);
          setUsers(users);
        } catch (error) {
          console.log("Error:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPackage();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that Session Start Date is earlier than Session End Date
    if (
      sessionDates[0] &&
      sessionDates[1] &&
      new Date(sessionDates[0]) >= new Date(sessionDates[1])
    ) {
      toast.error("Session Start Date must be earlier than Session End Date");
      setDateError(true);
      return;
    }
    setDateError(false);

    setIsSubmitting(true);
    const packageData = {
      coachId,
      locationId,
      sport: sport,
      ageGroup,
      level,
      duration: Number(duration),
      sessionDates,
      seatsCount: Number(totalSeats),
      price: {
        base: Number(price.base),
        tax: Number(price.tax),
        discount: Number(price.discount),
      },
      title,
      description,
      weeklySchedule,
      image: profileImage || "https://github.com/shadcn.png",
      paymentMethods: paymentMethods,
      // paymentDueDate: paymentDueDate,
    };
    // console.log("Package Data:", packageData);

    try {
      if (id) {
        await updatePackage(id, packageData);
        toast.success("Package updated successfully");
        router.push(`/packages/${id}?/#package`);
        setIsEditing?.(false);
      } else {
        await createPackage(packageData);
        toast.success("Package created successfully");
        router.push("/packages");
        handleCancel();
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error("Failed to create package");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (id && isEditing) {
      if (setIsEditing) {
        window.location.href = `/packages/${id}?/#package`;
        setIsEditing(false);
        return;
      }
    }
    setSport("");
    setTitle("");
    setDescription("");
    setLevel("");
    setLocationId("");
    setCoachId("");
    setAgeGroup("");
    setDuration("");
    setPrice({ base: "", tax: "", discount: "" });
    setSessionDates(["", ""]);
    setWeeklySchedule({});
    setTotalSeats("");
    setProfileImage(null);
    setPaymentMethods([]);
    router.back();
  };

  const handleUserUpdate = (id: string, updates: any) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, ...updates } : u))
    );
  };

  const sortUsers = (list: any[]) => {
    const sortable = [...list];

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

  useEffect(() => {
    const uniquePaymentMethods = Array.from(
      new Set(users.map((u: any) => u.paymentMethod))
    );

    // Optional: sort alphabetically
    uniquePaymentMethods.sort();

    setFilterPaymentOptions(uniquePaymentMethods);
    if (!filterPayment) {
      setFilterPayment("all");
    }
  }, [users, filterPayment]);

  const getFilteredUsers = () => {
    const filtered = users
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
    <div id="package" className="flex items-center justify-center p-1 sm:p-4">
      {loading && id ? (
        <Loader />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-1 sm:p-8 space-y-6 transition-all duration-300 hover:shadow-xl"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
            <div className="flex flex-col items-center w-full sm:w-auto">
              <div>
                <Image
                  src={profileImage || "https://github.com/shadcn.png"}
                  alt="Profile"
                  className="w-48 h-32 rounded-2xl object-cover mt-2"
                  width={192}
                  height={128}
                />

                <div className="flex gap-2 mt-2 justify-center">
                  <ReCloudinary
                    id="profilePic"
                    initialUrl={profileImage || "https://github.com/shadcn.png"}
                    onSuccess={(res) => {
                      const imgUrl = res.url;
                      setProfileImage(imgUrl);
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
                      setProfileImage(null);
                    }}
                    disabled={!isEditing}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-bold text-gray-700">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                  required
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-bold text-gray-700">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. This is a package for 30 days"
                  required
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Coach</label>
              <SingleCoachDropdown
                value={coachId}
                onChange={setCoachId}
                placeholder="Select coach"
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Sport Name
              </label>
              <SingleSelect
                options={sportsOptions}
                value={sport}
                onChange={setSport}
                placeholder="Select Sport"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2 capitalize">
              <label className="text-sm font-bold text-gray-700">
                Age Group
              </label>
              <Select
                value={ageGroup}
                onValueChange={setAgeGroup}
                disabled={!isEditing}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent className="capitalize">
                  {ageGroups.map((group: string) => (
                    <SelectItem
                      key={group}
                      value={group}
                      className="capitalize"
                    >
                      {group.charAt(0).toUpperCase() + group.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Level</label>
              <Select
                value={level}
                onValueChange={setLevel}
                disabled={!isEditing}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent className="capitalize">
                  {levels?.map((lvl: { id: number; name: string }) => (
                    <SelectItem
                      key={lvl.id}
                      value={lvl.name}
                      className="capitalize"
                    >
                      {lvl.name.charAt(0).toUpperCase() + lvl.name.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                Total Seats
              </label>
              <Input
                type="number"
                value={totalSeats}
                onChange={(e) => setTotalSeats(e.target.value)}
                placeholder="e.g. 30"
                min={1}
                required
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Session Start Date
              </label>
              <Input
                type="date"
                value={sessionDates[0] || ""}
                min={id ? undefined : today}
                onChange={handleStartDateChange}
                className={
                  dateError ? "border-red-500 focus:border-red-500" : ""
                }
                required
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Session End Date
              </label>
              <Input
                type="date"
                value={sessionDates[1] || ""}
                min={id ? undefined : today}
                onChange={handleEndDateChange}
                className={
                  dateError ? "border-red-500 focus:border-red-500" : ""
                }
                required
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Duration (in months)
              </label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Auto-calculated from dates (editable)"
                step={0.1}
                min={0.1}
                disabled={!isEditing}
              />
            </div>
          </div>
          {dateError && (
            <p className="text-red-500 text-sm mt-1">
              Session Start Date must be earlier than Session End Date
            </p>
          )}
          <div className="mt-6">
            <WeeklyScheduleComponent
              value={weeklySchedule}
              onChange={setWeeklySchedule}
              disabled={!isEditing}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div className=" ">
              <label className="text-sm font-bold text-gray-700">
                Price(£)
              </label>
              <Input
                type="number"
                value={price.base}
                onChange={(e) => setPrice({ ...price, base: e.target.value })}
                placeholder="e.g. £30"
                min={0}
                required
                disabled={!isEditing}
              />
            </div>
            <div className="">
              <label className="text-sm font-bold text-gray-700">Tax(£)</label>
              <Input
                type="number"
                value={price.tax}
                onChange={(e) => setPrice({ ...price, tax: e.target.value })}
                placeholder="e.g. £30"
                min={0}
                required
                disabled={!isEditing}
              />
            </div>
            <div className="">
              <label className="text-sm font-bold text-gray-700">
                Discount(£)
              </label>
              <Input
                type="number"
                value={price.discount}
                onChange={(e) =>
                  setPrice({ ...price, discount: e.target.value })
                }
                placeholder="e.g. £30"
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
                Select one or more payment methods that will be accepted for this
                package
              </p>
              {/* {isEditing &&
                sessionDurationInMonths !== null &&
                sessionDurationInMonths <= 2 && (
                  <p className="text-xs text-orange-500 mt-1">
                    Monthly Mandate is available only when the session duration is
                    longer than 2 months.
                  </p>
                )} */}
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
                Users Enrolled in this Package
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

              {users.length === 0 ? (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    No users enrolled in this package
                  </p>
                </div>
              ) : (
                <div className="mt-2">
                  <PackageUserTable
                    users={getFilteredUsers()}
                    onEdit={(id) => console.log(`Edit user ${id}`)}
                    disabled={!canEditPaymentMethods}
                    availablePaymentMethodOptions={availablePaymentMethodOptions}
                    onUserUpdate={handleUserUpdate}
                  />
                </div>
              )}
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
                "Update Package"
              ) : (
                "Add Package"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 hover:bg-orange-50 border-orange-200 text-orange-500 transition-all duration-300"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PackageForm;
