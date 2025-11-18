'use client'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchUserById, modifyUser, registerUser } from "@/redux/features/userSlice";
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
import { getProfilesByUserId } from "@/api/user/user";

const PersonalDetails = ({ id }: { id?: string }) => {
  const dispatch = useAppDispatch();
  const [profiles, setProfiles] = useState([]);
  console.log('profiles:', profiles);
  const { userById: user } = useAppSelector((state: RootState) => state.user);
  // console.log('user:', user);
  const [image, setImage] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    gender: "",
    emergencyContact: "",
    sports: [] as string[],
    level: "",
    avatar: "https://github.com/shadcn.png"
  });
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(!!id);
  const router = useRouter()

  const sportsOptions = ["football", "basketball", "cricket", "tennis", "swimming"];
  // const levelOptions = [ "daily","weekly","monthly","occasionally"];



  useEffect(()=>{
    const fetchProfiles = async () => {
      if(!id) return;
      try {
          const profiles = await getProfilesByUserId(id ?? '');
          console.log('profiles:', profiles);
          const formattedProfiles = profiles.map((profile: any) => ({
            id: profile?._id,
            name: profile?.name || 'N/A',
            relation: profile?.relation || 'N/A',
          }));
          setProfiles(formattedProfiles);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    }
    fetchProfiles();
  },[id])


  useEffect(() => {
    if (user?.avatar) {
      setImage(user.avatar);
    } else if (!id) {
      setImage("https://github.com/shadcn.png");
    }
  }, [user?.avatar, id]);

  useEffect(() => {
    if (id && user) {
      setFormData({
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
        password:  "",
        dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
        gender: user?.gender ?? "",
        emergencyContact: user?.emergencyContact ?? "",
        sports: user?.sports ?? [],
        level: user?.level ?? "",
        avatar: user?.avatar ?? "https://github.com/shadcn.png"
      });
      setLoaded(false)
    }
  }, [user, id]);

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
    if (id && !user) return;

    const { password, ...rest } = formData;
    const basePayload = { ...rest, avatar: image || formData.avatar, role: 'user' };
    setLoading(true)
    try {
    if (id) {
        const userId = user?._id;
        if (!userId) {
          toast.error("User details not loaded yet.");
          return;
        }
        const result = await dispatch(modifyUser({ userId, userData: basePayload }));
        if (modifyUser.fulfilled.match(result)) {
          // toast.success("User updated successfully!");
          router.back();
        } else {
          throw result.payload;
        }
      } else {
        const result = await dispatch(registerUser({ ...basePayload, password }));
        if (registerUser.fulfilled.match(result)) {
          toast.success("User registered successfully!");
          setTimeout(() => {
            router.push("/users");
          }, 1000);
        } else {
          throw result.payload;
        }
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update user");
    } finally {
      setLoading(false)
    }
  };

  if (loaded) return <span>Loading....</span>
  if(!id){

  }
  return (
    <div className="bg-white p-2 sm:p-6 rounded-lg shadow-sm ">
      <div className="space-y-6">
        <div className="flex items-start gap-6">
          <div className=" ">
            <Image
              src={image || "https://github.com/shadcn.png"}
              alt="Profile"
              className="w-28 h-28 rounded-3xl object-cover mt-7 "
              width={112}
              height={112}
            />

            <div className="flex gap-2 mt-3">
              <ReCloudinary 
                id="profilePic"
                initialUrl={image || "https://github.com/shadcn.png"}
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
                placeholder="Enter your name"
                className="mt-1 text-[#2E2E2E]"
                onChange={handleChange}
              />
            </div>
            {!id && (
              <div>
              <Label htmlFor="password" className="text-[#2E2E2E] font-bold">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                placeholder="Enter your password"
                className="mt-1 text-[#2E2E2E]"
                onChange={handleChange}
              />
            </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-[#2E2E2E] font-bold">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  placeholder="Enter your phone number"
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
                  placeholder="Enter your email"
                  className="mt-1 text-[#2E2E2E]"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dob" className="text-[#2E2E2E] font-bold">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              placeholder="Select your date of birth"
              className="mt-1 text-[#2E2E2E]"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="gender" className="text-[#2E2E2E] font-bold">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your gender" />
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
            placeholder="Enter your emergency contact"
            className="mt-1 text-[#2E2E2E]"
            onChange={handleChange}
          />
        </div>

        <div>
          <Label className="text-[#2E2E2E] font-bold">Select Sports</Label>
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
        </div>

        {/* <div>
          <Label htmlFor="level" className="text-[#2E2E2E] font-bold">Subscription Level</Label>
          <Select value={formData.level} onValueChange={(value) => handleSelectChange('level', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select your subscription level" />
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

      {/* Profiles Section */}
      { id && <div className="mt-8">
        <h3 className="text-lg font-semibold text-[#2E2E2E]">Profiles</h3>
        {profiles.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {profiles.map((profile: any) => (
              <div
                key={profile.id}
                className="rounded-lg border border-[#7421931A] bg-[#F9F5FC] p-4 shadow-sm"
              >
                <p className="text-sm font-medium text-[#742193]">{profile.relation}</p>
                <p className="mt-1 text-base font-semibold text-[#2E2E2E]">{profile.name}</p>
                <p className="mt-2 text-xs text-[#6B6B6B]">Profile ID: {profile.id}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-[#6B6B6B]">No profiles linked to this user yet.</p>
        )}
      </div>
      }

      <div className="flex space-x-4  mt-5">
        <Button
          type="button"
          onClick={handleSubmit}
          className="bg-[#742193] hover:bg-[#57176e] text-white py-2 px-10 rounded-md transition-colors duration-200 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? <Loader className="animate-spin" /> : id ? "Update User" : "Register User"}
        </Button>
      </div>
    </div>
  );
};

export default PersonalDetails;
