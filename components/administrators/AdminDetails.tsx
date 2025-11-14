'use client'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchUserById, modifyUser } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { useEffect, useState } from "react";
// import ReImageKit from "../imageKit/ReImageKit";
import { Button } from "../ui/button";
import { Loader, RefreshCcw, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ReCloudinary } from "../cloudinary";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const AdminDetails = ({ id }: { id: string }) => {
  const dispatch = useAppDispatch();
  const { userById: user } = useAppSelector((state: RootState) => state.user);
  // console.log('user:', user);
  const [image, setImage] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    emergencyContact: "",
    sports: [] as string[],
    level: "occasionally",
    avatar: ""
  });
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(true);
  const router = useRouter()

  const sportsOptions = ["football", "basketball", "cricket", "tennis", "swimming"];
  // const levelOptions = [ "daily","weekly","monthly","occasionally"];


  useEffect(() => {
    if (!image && user?.avatar) {
      setImage(user?.avatar ?? "https://github.com/shadcn.png")
    }
  }, [user?.avatar, image]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
        dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
        gender: user?.gender ?? "",
        emergencyContact: user?.emergencyContact ?? "",
        sports: user?.sports ?? [],
        level: user?.level ?? "",
        avatar: user?.avatar ?? "https://github.com/shadcn.png"
      });
      setLoaded(false)
    }
  }, [user]);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [id, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSportsChange = (sport: string) => {
    setFormData((prev) => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter(s => s !== sport)
        : [...prev.sports, sport]
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    const payload = { ...formData, avatar: image ?? formData.avatar, role: 'admin' };
    setLoading(true)
    try {
      const result = await dispatch(modifyUser({ userId: user._id, userData: payload }));
      if (modifyUser.fulfilled.match(result)) {
        toast.success("User updated successfully!");
        // setTimeout(() => {
          router.push("/administrator");
        // }, 1000);
      } else {
        throw result.payload;
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update user");
    } finally {
      setLoading(false)
    }
  };

  if (loaded) return <span>Loading....</span>
  return (
    <div className="bg-white p-2 sm:p-6 rounded-lg shadow-sm ">
      <div className="space-y-6">
        <div className="flex items-start gap-6">
          <div className=" ">
            <Image
              src={image ?? "https://github.com/shadcn.png"}
              alt="Profile"
              className="w-28 h-28 rounded-3xl object-cover mt-7 "
              width={112}
              height={112}
            />

            <div className="flex gap-2 mt-3">
              <ReCloudinary 
                id="profilePic"
                initialUrl={image ?? "https://github.com/shadcn.png"}
                onSuccess={(res) => {
                  const imgUrl = res.url;
                  setImage(imgUrl);
                }}

                btnClassName='border border-[#c858ba] bg-[#7421931A] text-sm   text-[#742193] p-1 rounded-lg'
                btnIcon={<RefreshCcw />}
                btnText=""
                isAlwaysBtn
                isImgPreview={false}
              />
              <Button
                variant="secondary"
                size="icon"
                className="border border-[#c858ba] bg-[#7421931A] text-sm  text-[#742193] p-1 rounded-lg"
                onClick={() => setImage('https://github.com/shadcn.png')}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <Label htmlFor="name" className="text-[#2E2E2E] font-bold">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                className="mt-1 text-[#2E2E2E]"
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-[#2E2E2E] font-bold">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  className="mt-1 text-[#2E2E2E]"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-[#2E2E2E] font-bold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  className="mt-1 text-[#2E2E2E]"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dob" className="text-[#2E2E2E] font-bold">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              className="mt-1 text-[#2E2E2E]"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="gender" className="text-[#2E2E2E] font-bold">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="emergencyContact" className="text-[#2E2E2E] font-bold">Emergency Contact</Label>
          <Input
            id="emergencyContact"
            value={formData.emergencyContact}
            className="mt-1 text-[#2E2E2E]"
            onChange={handleChange}
          />
        </div>

        <div>
          <Label className="text-[#2E2E2E] font-bold">Sports</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {sportsOptions.map((sport) => (
              <Button
                key={sport}
                variant={formData.sports.includes(sport) ? "default" : "outline"}
                onClick={() => handleSportsChange(sport)}
                className="capitalize"
              >
                {sport}
              </Button>
            ))}
          </div>
        </div> */}

        {/* <div>
          <Label htmlFor="level" className="text-[#2E2E2E] font-bold">Subscription Level</Label>
          <Select value={formData.level} onValueChange={(value) => handleSelectChange('level', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {levelOptions.map((level) => (
                <SelectItem key={level} value={level} className="capitalize">
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
      </div>

      <div className="flex space-x-4  mt-5">
        <Button
          type="button"
          onClick={handleSubmit}
          className="bg-[#742193] hover:bg-[#57176e] text-white py-2 px-10 rounded-md transition-colors duration-200 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? <Loader className="animate-spin" /> : "Save Details"}
        </Button>
      </div>
    </div>
  );
};

export default AdminDetails; 
