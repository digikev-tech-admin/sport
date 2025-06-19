import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SingleSelect } from "../shared/singleChooseDropdown";
import { ageGroups, levels, sportsOptions } from "@/data/constants";
import { LocationDropdown } from "../shared/LocationDropdown";
import { SingleCoachDropdown } from "../shared/SingleCoachDropDown";
import { Textarea } from "../ui/textarea";
import { WeeklySchedule, WeeklyScheduleComponent } from "../shared/WeeklySchedule";
import { createPackage, getPackageById, updatePackage } from "@/api/package";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";




const PackageForm = ({ id }: { id?: string }) => {
  const router = useRouter();
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

  const [price, setPrice] = useState({
    base:"",
    tax:"",
    discount:""
  });

  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({});

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (id) {
     const fetchPackage = async () => {
      try {
        const res = await getPackageById(id);
        console.log("res", res);
        setSport(res?.sport);
        setTitle(res?.title);
        setDescription(res?.description);
        setLevel(res?.level);
        setLocationId(res?.locationId?._id);
        setCoachId(res?.coachId?._id);
        setAgeGroup(res?.ageGroup);
        setDuration(res?.duration);
        setTotalSeats(res?.seatsCount);
        setPrice({base:res?.price?.base, tax:res?.price?.tax, discount:res?.price?.discount});
        setSessionDates([
          res?.sessionDates[0] ? res.sessionDates[0].slice(0, 10) : "",
          res?.sessionDates[1] ? res.sessionDates[1].slice(0, 10) : ""
        ]);
        setWeeklySchedule(res?.weeklySchedule);
      } catch (error) {
        console.log("Error:", error);
     }
    }
    fetchPackage()

  }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        discount: Number(price.discount)
      },
      title,
      description,
      weeklySchedule
    };
    // console.log("Package Data:", packageData);
   
    try {
      if(id){
        const res = await updatePackage(id, packageData);
          toast.success("Package updated successfully");
     
      }else{
        const res = await createPackage(packageData);
        toast.success("Package created successfully");
        router.push("/packages");
        handleCancel();
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error("Failed to create package");
      
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
    setPrice({base:"", tax:"", discount:""});
    setSessionDates(["", ""]);
    setWeeklySchedule({});
    setTotalSeats("");
  };

  return (
    <div className="flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8 space-y-6 transition-all duration-300 hover:shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Sport Name</label>
            <SingleSelect
            options={sportsOptions}
            value={sport}
            onChange={setSport}
            placeholder="Select Sport"
          />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Title</label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter title"
              required
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
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Coach</label> 
          <SingleCoachDropdown
            value={coachId}
            onChange={setCoachId}
            placeholder="Select location"
          />
        </div>
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
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">Total Seats</label>
            <Input
              type="number"
              value={totalSeats}
              onChange={e => setTotalSeats(e.target.value)}
              placeholder="e.g. 30"
              min={1}
              required
            />
          </div>
         
         
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Duration (in months)</label>
            <Input
              type="number"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="e.g. 30"
              min={1}
              required
            />
          </div>
         
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Session Start Date</label>
            <Input
              type="date"
              value={sessionDates[0] || ""}
              min={today}
              onChange={e => setSessionDates([e.target.value, sessionDates[1] || ""])}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Session End Date</label>
            <Input
              type="date"
              value={sessionDates[1] || ""}
              min={today}
              onChange={e => setSessionDates([sessionDates[0] || "", e.target.value])}
              required
            />
          </div>
          
          
        </div>
        <div className="mt-6">
          <WeeklyScheduleComponent 
            value={weeklySchedule}
            onChange={setWeeklySchedule}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className=" ">
            <label className="text-sm font-bold text-gray-700">Price</label>
            <Input
              type="number"
              value={price.base}
              onChange={e => setPrice({...price, base: e.target.value})}
              placeholder="e.g. 30"
              min={0}
              required
            />
          </div>
          <div className="">
            <label className="text-sm font-bold text-gray-700">Tax</label>
            <Input
              type="number"
              value={price.tax}
              onChange={e => setPrice({...price, tax: e.target.value})}
              placeholder="e.g. 30"
              min={0}
              required
            />
          </div>
          <div className="">
            <label className="text-sm font-bold text-gray-700">Discount</label>
            <Input
              type="number"
              value={price.discount}
              onChange={e => setPrice({...price, discount: e.target.value})}
              placeholder="e.g. 30"
              min={0}
              required
            />
          </div>
          </div>

        <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Description</label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. This is a package for 30 days"
              required
            />
          </div>
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="flex-1 commonDarkBG text-white hover:bg-[#581770] transition-all duration-300"
          >
            {id ? "Update Package" : "Add Package"}
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
    </div>
  );
};

export default PackageForm;
