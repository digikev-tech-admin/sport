import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RefreshCcw, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { ReCloudinary } from "../cloudinary";
import Image from "next/image";
import { createLocation, getLocationById, updateLocation } from "@/api/location";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const locationSchema = z.object({
  address: z.string().min(1, "Please add an address"),
  image: z.string().min(1, "Please add an image"),
  about: z.string().min(1, "Please add an about"),
  city: z.string().min(1, "Please add a city"),
  state: z.string().min(1, "Please add a state"),
  zipCode: z.string().min(1, "Please add a zip code"),
});

type LocationFormValues = z.infer<typeof locationSchema>;

interface FormData {
  photo: string;
}

const LocationForm = ({ id }: { id?: string }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({ photo: "" });
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    setValue,
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
  });


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
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };
    fetchLocation();
  }, [id]);

  const onSubmit = async (data: LocationFormValues) => {
    try {
      const submitData = {
        ...data,
        image: formData.photo
      };

      if (id) {
        await updateLocation(id, submitData);
        toast.success("Location updated successfully");
      } else {
        await createLocation(submitData);
        toast.success("Location created successfully");
      }
      
      router.push('/location');
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form");
    }
  };

  return (
    <div className="flex items-center justify-center py-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full min-w-xl bg-white rounded-xl border p-8 space-y-6"
      >
        <div>
          <label htmlFor="address" className="block mb-1">
            Address
          </label>
          <input
            id="address"
            type="text"
            {...register("address")}
            className="w-full p-2 border rounded"
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
          />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="state" className="block mb-1">
            State
          </label>
          <input
            id="state"
            type="text"
            {...register("state")}
            className="w-full p-2 border rounded"
          />
          {errors.state && (
            <p className="text-red-500 text-sm">{errors.state.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="zipCode" className="block mb-1">
            Zip Code
          </label>
          <input
            id="zipCode"
            type="text"
            {...register("zipCode")}
            className="w-full p-2 border rounded"
          />
          {errors.zipCode && (
            <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Upload Photo
          </label>
          <div className="flex items-center gap-4">
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

        <div>
          <label htmlFor="about" className="block mb-1">
            About
          </label>
          <textarea
            id="about"
            {...register("about")}
            className="w-full p-2 border rounded"
            rows={4}
          />
          {errors.about && (
            <p className="text-red-500 text-sm">{errors.about.message}</p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="flex-1 commonDarkBG text-white hover:bg-[#581770] transition-all duration-300"
            disabled={isSubmitting}
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
