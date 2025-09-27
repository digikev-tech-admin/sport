import { useEffect, useState } from "react";
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
import { ageGroups, dummyUsers, levels, sportsOptions } from "@/data/constants";
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

const PackageForm = ({
  id,
  isEditing,
}: {
  id?: string;
  isEditing?: boolean;
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

  const [price, setPrice] = useState({
    base: "",
    tax: "",
    discount: "",
  });

  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({});

  const today = new Date().toISOString().slice(0, 10);

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
    };
    // console.log("Package Data:", packageData);

    try {
      if (id) {
        await updatePackage(id, packageData);
        toast.success("Package updated successfully");
      } else {
        await createPackage(packageData);
        toast.success("Package created successfully");
        handleCancel();
      }
      router.push("/packages");
    } catch (error) {
      console.log("Error:", error);
      toast.error("Failed to create package");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
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
    router.back();
  };

  return (
    <div className="flex items-center justify-center p-1 sm:p-4">
      {loading && id ? (
        <Loader />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-1 sm:p-8 space-y-6 transition-all duration-300 hover:shadow-xl"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
            <div className="flex flex-col items-center w-full sm:w-40">
              <div>
                <Image
                  src={profileImage || "https://github.com/shadcn.png"}
                  alt="Profile"
                  className="w-26 h-26 sm:h-36 sm:w-36 rounded-3xl object-cover mt-2"
                  width={112}
                  height={112}
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

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Duration (in months)
              </label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
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
                onChange={(e) =>
                  setSessionDates([e.target.value, sessionDates[1] || ""])
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
                onChange={(e) =>
                  setSessionDates([sessionDates[0] || "", e.target.value])
                }
                required
                disabled={!isEditing}
              />
            </div>
          </div>
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

          {id && (
            <>
              <h1 className="text-sm font-bold text-gray-700 mt-2">
                Users Enrolled in this Package
              </h1>
              <div className="mt-2">
                <PackageUserTable
                  users={dummyUsers}
                  onEdit={(id) => console.log(`Edit user ${id}`)}
                  onDelete={(id) => console.log(`Delete user ${id}`)}
                  disabled={!isEditing}
                />
              </div>
            </>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 commonDarkBG text-white hover:bg-[#581770] transition-all duration-300"
              disabled={isSubmitting}
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
