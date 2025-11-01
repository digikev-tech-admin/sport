'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Phone, Calendar, PhoneCall, Trash2, RefreshCcw } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { registerUser } from "@/redux/features/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { ReCloudinary } from "../cloudinary";
import Image from "next/image";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  role: z.enum(["admin"]),
  isActive: z.boolean().default(true),
  emergencyContact: z.string().min(10, "Emergency contact must be at least 10 digits").optional(),
  sports: z.array(z.string()),
  level: z.enum(["daily", "weekly", "monthly", "occasionally"]),
  avatar: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

const sportsOptions = ["football", "basketball", "cricket", "tennis", "swimming"];
const levelOptions = ["daily", "weekly", "monthly", "occasionally"];

const AdminForm = () => {
  const dispatch = useAppDispatch();
  const [avatar, setAvatar] = useState("https://github.com/shadcn.png");
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sports: [],
      isActive: true,
      role: "admin",
      avatar: "https://github.com/shadcn.png",
    },
  });

  const router = useRouter();
  const selectedSports = watch("sports") || [];

  const handleSportsChange = (sport: string) => {
    const currentSports = watch("sports") || [];
    if (currentSports.includes(sport)) {
      setValue("sports", currentSports.filter(s => s !== sport));
    } else {
      setValue("sports", [...currentSports, sport]);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formDataWithAvatar = { ...data, avatar };
      const result = await dispatch(registerUser(formDataWithAvatar));
      if (registerUser.fulfilled.match(result)) {
        toast.success("Admin added successfully!");
        router.push("/administrator");
        reset();
      } else {
        throw result.payload;
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error as string || "Error adding admin");
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-admin-light/20 to-white py-4">
      <div className="w-full min-w-xl animate-fadeIn backdrop-blur-sm bg-white/80 rounded-xl border px-7 py-5 space-y-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-6">
              <div>
                <Image
                  src={avatar}
                  alt="Profile"
                  className="w-28 h-28 rounded-3xl object-cover mt-7"
                  width={112}
                  height={112}
                />

                <div className="flex gap-2 mt-3">
                  <ReCloudinary 
                    id="profilePic"
                    initialUrl={avatar}
                    onSuccess={(res) => {
                      const imgUrl = res.url;
                      setAvatar(imgUrl);
                      setValue("avatar", imgUrl);
                    }}
                    btnClassName='border border-[#c858ba] bg-[#7421931A] text-sm text-[#742193] p-1 rounded-lg'
                    btnIcon={<RefreshCcw />}
                    btnText=""
                    isAlwaysBtn
                    isImgPreview={false}
                    enableCropping={true}
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="border border-[#c858ba] bg-[#7421931A] text-sm text-[#742193] p-1 rounded-lg"
                    onClick={() => {
                      setAvatar("https://github.com/shadcn.png");
                      setValue("avatar", "https://github.com/shadcn.png");
                    }}
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
                    {...register("name")}
                    placeholder="Enter your full name"
                    className="mt-1 text-[#2E2E2E]"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-[#2E2E2E] font-bold">Phone Number</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="Enter your phone number"
                      className="mt-1 text-[#2E2E2E]"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[#2E2E2E] font-bold">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="Enter your email"
                      className="mt-1 text-[#2E2E2E]"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-[#2E2E2E] font-bold">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Enter your password"
                      className="mt-1 text-[#2E2E2E] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date of Birth */}
              <div>
                <Label htmlFor="dob" className="text-[#2E2E2E] font-bold">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    {...register("dob")}
                    placeholder="Enter your date of birth"
                    type="date"
                    className="pl-10 mt-1 text-[#2E2E2E]"
                  />
                </div>
                {errors.dob && (
                  <p className="mt-1 text-sm text-red-500">{errors.dob.message}</p>
                )}
              </div>

              {/* Gender Selection */}
              <div>
                <Label htmlFor="gender" className="text-[#2E2E2E] font-bold">Gender</Label>
                <Select onValueChange={(value) => setValue("gender", value as "male" | "female" | "other")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="relative">
              <Label htmlFor="emergencyContact" className="text-[#2E2E2E] font-bold">Emergency Contact</Label>
              <div className="relative">
                <PhoneCall className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  {...register("emergencyContact")}
                  type="tel"
                  placeholder="Enter your emergency contact"
                  className="pl-10 mt-1 text-[#2E2E2E]"
                />
              </div>
              {errors.emergencyContact && (
                <p className="mt-1 text-sm text-red-500">{errors.emergencyContact.message}</p>
              )}
            </div>

            {/* Sports Selection */}
            <div className="space-y-3">
              <Label className="text-[#2E2E2E] font-bold">Sports</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {sportsOptions.map((sport) => (
                  <label
                    key={sport}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-[#f0f0f0] transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSports.includes(sport)}
                      onChange={() => handleSportsChange(sport)}
                      className="rounded border-gray-300 text-admin-primary focus:ring-admin-primary"
                    />
                    <span className="text-sm text-gray-600 capitalize">{sport}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Level Selection */}
            <div>
              <Label htmlFor="level" className="text-[#2E2E2E] font-bold">Subscription Level</Label>
              <Select onValueChange={(value) => setValue("level", value as "daily" | "weekly" | "monthly" | "occasionally")}>
                <SelectTrigger className="w-full">
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
              {errors.level && (
                <p className="mt-1 text-sm text-red-500">{errors.level.message}</p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register("isActive")}
                className="rounded border-gray-300 text-admin-primary focus:ring-admin-primary"
              />
              <Label className="text-[#2E2E2E] font-bold">Active Status</Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#742193] hover:bg-[#57176e] text-white py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Admin"}
            </button>
            <Link href="/administrator">
              <button
                type="button"
                onClick={() => {
                  reset();
                  router.back();
                }}
                className="flex-1 bg-[#FFCA74] hover:bg-[#e7ad4e] text-[#742193] py-2 px-4 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminForm; 