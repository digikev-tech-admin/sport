// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import toast from "react-hot-toast";
// import { createAnatomy, getAnatomyById, updateAnatomy } from "@/api/anatomy/anatomy";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Trash2 } from "lucide-react";
// import { ReCloudinary } from "./cloudinary";
// // import ReImageKit from "../imageKit/ReImageKit";

// interface FormData {
//   anatomyName: string;
//   category: string;
//   description: string;
//   sortDescription: string;
//   imageUrl: string;
//   //   photo: File | null;
//   notes: File | null;
// }

// const AnatomyForm = ({
//   isEdit,
// }: {
//   isEdit?: boolean;
// }) => {
//   const searchParams = useSearchParams();
//   const anatomyId = searchParams.get("id");
//   const router = useRouter();

//   const [formData, setFormData] = useState<FormData>({
//     anatomyName: "",
//     category: "",
//     description: "",
//     sortDescription: "",
//     imageUrl: "",
//     // photo: null,
//     notes: null,
//   });

//   const categories = [
//     "Circulatory System",
//     "Respiratory System",
//     "Digestive System",
//     "Nervous System",
//     "Skeletal System",
//   ];

//   useEffect(() => {
//     if (isEdit && anatomyId) {
//       const fetchAnatomy = async () => {
//         try {
//           const res = await getAnatomyById(anatomyId);
//           console.log({ res });

//           if (res) {
//             setFormData({
//               anatomyName: res?.title || "",
//               category: res?.category || "",
//               description: res?.description || "",
//               sortDescription: res?.keywordsAndTags
//                 ? res?.keywordsAndTags.join(", ")
//                 : "",
//               imageUrl: res?.imageUrl || "",
//               notes: null,
//             });
//           }
//         } catch (error) {
//           console.error("Failed to fetch anatomy details", error);
//         }
//       };

//       fetchAnatomy();
//     }
//   }, [isEdit, anatomyId]);


//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };


//   const handleCategoryChange = (value: string) => {
//     setFormData((prev) => ({ ...prev, category: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     if (!formData?.anatomyName || !formData?.category || !formData?.description || !formData?.imageUrl) {
//       toast.error("Please fill all the fields");
//       return;
//     }
//     e.preventDefault();
//     const formattedData = {
//       title: formData?.anatomyName,
//       views: "0",
//       imageUrl: formData?.imageUrl,
//       description: formData?.description,
//       category: formData?.category,
//       keywordsAndTags: formData?.sortDescription
//         ? formData?.sortDescription.split(",").map((tag) => tag.trim())
//         : [],
//     };
//     try {
//       if (isEdit) {
//         await updateAnatomy(String(anatomyId), formattedData);
//         toast.success("Anatomy updated successfully!");
//         router.push("/anatomy");

//       } else {
//         await createAnatomy(formattedData);
//         router.push("/anatomy");
//         toast.success("Anatomy added successfully!");
//         setFormData({
//           anatomyName: "",
//           category: "",
//           description: "",
//           sortDescription: "",
//           imageUrl: "",
//           notes: null,
//         });
//       }
//       console.log({formattedData});
      
//     } catch (error) {
//       console.error("Error creating anatomy:", error);
//       toast.error("Failed to add anatomy");
//     }
//   };

//   return (
//     <div className=" flex items-center justify-center py-4">
//       <form
//         onSubmit={handleSubmit}
//         className="w-full min-w-xl bg-white rounded-xl border px-8 py-5 space-y-4"
//       >
//         <div className="grid grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <label className="text-sm  font-bold text-gray-700">
//               Anatomy Name
//             </label>
//             <Input
//               name="anatomyName"
//               value={formData?.anatomyName ?? ''}
//               onChange={handleInputChange}
//               placeholder="Enter Anatomy name"
//               className="w-full transition-all duration-300 focus:ring-2 focus:ring-purple-200"
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-bold text-gray-700">Category</label>
//             <Select onValueChange={handleCategoryChange}>
//               <SelectTrigger className="w-full transition-all duration-300 focus:ring-2 focus:ring-purple-200">
//                 <SelectValue
//                   placeholder="Select category"
//                   className="font-medium"
//                 />
//               </SelectTrigger>
//               <SelectContent>
//                 {categories?.map((category) => (
//                   <SelectItem key={category} value={category}>
//                     {category}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <div className="space-y-2">
//           <label className="text-sm font-bold text-gray-700">Description</label>
//           <Input
//             name="description"
//             value={formData?.description ?? ''}
//             onChange={handleInputChange}
//             placeholder="Enter Description..."
//             className="w-full transition-all duration-300 focus:ring-2 focus:ring-purple-200"
//           />
//         </div>

//         <div className="space-y-2">
//           <label className="text-sm font-bold text-gray-700">
//             Keywords and Tags
//           </label>
//           <Input
//             name="sortDescription"
//             value={formData?.sortDescription ?? ''}
//             onChange={handleInputChange}
//             placeholder="Enter Sort Description..."
//             className="w-full transition-all duration-300 focus:ring-2 focus:ring-purple-200"
//           />
//         </div>

//         <div className="space-y-2">
//           <label className="text-sm font-bold text-gray-700">Upload Photo</label>
//           <div className="flex items-center gap-4">
//             <div className="w-full border h-10 rounded-md flex items-center px-4">
//               <p className="text-sm font-bold text-gray-700 opacity-70 max-w-md line-clamp-1">{formData?.imageUrl ? formData?.imageUrl.split('/').pop() : 'Select a file'}</p>
//             </div>

//             <div className="flex gap-1">
//               <ReCloudinary
//                 id="profilePic"
//                 initialUrl={formData?.imageUrl ?? ''}
//                 onSuccess={(res:any) => {
//                   const imgUrl = res.url;
//                   setFormData((prev) => ({ ...prev, imageUrl: imgUrl }));
//                 }}

//                 btnClassName='border border-[#c858ba] bg-[#7421931A] text-sm !px-4  text-[#742193] p-1 rounded-lg'
//                 btnIcon={''}
//                 btnText="Choose File"
//                 isAlwaysBtn
//                 isImgPreview={false}
//               />
//               {formData?.imageUrl && <Button
//                 variant="secondary"
//                 size="icon"
//                 className="border border-[#c858ba] bg-[#7421931A] text-sm  text-[#742193] p-1 rounded-lg"
//                 onClick={() => setFormData((prev) => ({ ...prev, imageUrl: '' }))}
//               >
//                 <Trash2 />
//               </Button>}
//             </div>
//           </div>
//         </div>
//         <div className="flex gap-4 pt-4">
//           <Button
//             type="submit"
//             className="flex-1 commonDarkBG text-white hover:bg-[#581770] transition-all duration-300"
//           >
//             {`${isEdit ? "Save Changes " : "Add Anatomy"}`}
//           </Button>
//           <Button
//             type="button"
//             variant="outline"
//             className="flex-1 hover:bg-orange-50 border-orange-200 text-orange-500 transition-all duration-300"
//             onClick={() =>
//               setFormData({
//                 anatomyName: "",
//                 category: "",
//                 description: "",
//                 sortDescription: "",
//                 imageUrl:
//                   "https://ik.imagekit.io/txbnfqayd/Heart_O6xTassr2.png",
//                 notes: null,
//               })
//             }
//           >
//             Cancel
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AnatomyForm;
