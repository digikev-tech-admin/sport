import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { MultiSelect } from "./ClubMultiSelect";
import { MultipleLocationDropdown } from "../shared/MultipleLocationDrodown";
import { getAllLocations } from "@/api/location";
import { LocationOption } from "../shared/LocationDropdown";
import { RefreshCcw, Trash2 } from "lucide-react";
import { ReCloudinary } from "../cloudinary";
import { createCoach, getCoachById, updateCoach } from "@/api/coach";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Package } from "@/types/types";
import { getAllPackages } from "@/api/package";

// const clubOptions = [
//   { id: 1, name: "Elite Ortho Club" },
//   { id: 2, name: "Sunrise Fitness Club" },
//   { id: 3, name: "Downtown Tennis Center" },
//   { id: 4, name: "Ace Sports Club" },
// ];

const sportsOptions = [
  "Racket Ball",
  "Squash",
  "Tennis",
  "Badminton",
  "Yoga",
  "Pilates",
  "Football",
  "Baseball",
  "Basketball",
  "Volleyball",
  "Aerobics"
];

const sportsOptionsObj = sportsOptions.map((name, idx) => ({ id: idx, name }));

interface FormattedPackage {
  id: string;
  name: string;
}

const CoacheForm = ({ id }: { id?: string }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [clubs, setClubs] = useState<Array<{ id: string; name: string }>>([]);
  const [sports, setSports] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [certificationText, setCertificationText] = useState("");
  const [certificationFile, setCertificationFile] = useState<File | null>(null);
  const [certificateName, setCertificateName] = useState("");
  const [certificateImage, setCertificateImage] = useState<string | null>(null);
  const [certificateImageName, setCertificateImageName] = useState<string>("");
  const [certificates, setCertificates] = useState<Array<{ name: string; image: string }>>([]);
  const [locationData, setLocationData] = useState<LocationOption[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [newSpecialization, setNewSpecialization] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [packages, setPackages] = useState<FormattedPackage[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<Array<{ id: string; name: string }>>([]);

  

  const handleAddSpecialization = () => {
    if (newSpecialization.trim() && !specializations.includes(newSpecialization.trim())) {
      setSpecializations([...specializations, newSpecialization.trim()]);
      setNewSpecialization("");
    }
  };




  const handleDeleteSpecialization = (index: number) => {
    setSpecializations(specializations.filter((_, i) => i !== index));
  };

  const handleAddCertificate = () => {
    if (certificateName.trim() && certificateImage) {
      setCertificates([...certificates, { name: certificateName.trim(), image: certificateImage }]);
      setCertificateName("");
      setCertificateImage(null);
    }
  };

  const handleDeleteCertificate = (index: number) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };


  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getAllPackages();
        // console.log("Packages fetched:", response);
        const formattedPackages = response?.map((item: any) => ({
          id: item?._id,
          name: `${item?.sport} - ${item?.locationId?.address}, ${item?.locationId?.city}, ${item?.locationId?.state}`,
        }));
        // console.log("Formatted packages:", formattedPackages);
        setPackages(formattedPackages);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    fetchPackages();
  }, []);



  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations = await getAllLocations();
        const formattedLocations = locations.map((location: any) => ({
          id: location._id,
          name: location.address + ", " + location.city + ", " + location.state,
        }));
        setLocationData(formattedLocations);
        
      
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchCoach = async () => {
       try {
        const response = await getCoachById(id);
        // console.log("Coach fetched:", response);
        const formattedLocations = response.locationIds.map((location: any) => ({
          id: location._id,
          name: location.address + ", " + location.city + ", " + location.state,
        }));

        const formattedPackages = response?.packageIds?.map((item: any) => ({
          id: item?._id,
          name: `${item?.sport} - ${item?.locationId?.address}, ${item?.locationId?.city}, ${item?.locationId?.state}`,
        }));

        setName(response.name);
        setPhoneNumber(response.phoneNumber || "");
        setEmergencyContact(response.emergencyContact || "");
        setProfileImage(response.image || null);
        setBio(response.aboutMe);
        setClubs(formattedLocations);
        setSports(response.sports);
        setExperience(response.stats.yearsOfExperience.toString());
        setCertificates(response.stats.certifications);
        setSpecializations(response.stats.specializations);
        setSelectedPackages(formattedPackages);
        
        // Handle packages if they exist in the response
        // if (response.packageIds && response.packageIds.length > 0) {
        //   const selectedPkgs = response.packageIds.map((pkgId: string) => {
        //     const pkg = packages.find(p => p.id === pkgId);
        //     return { id: pkgId, name: pkg?.name || pkgId };
        //   });
        //   setSelectedPackages(selectedPkgs);
        // }
       } catch (error) {
        console.error("Error fetching coach:", error);
       }
      }
      fetchCoach();
    }
  }, [id]);
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(name === "" || bio === "" || clubs.length === 0 || sports.length === 0 || experience === "" || phoneNumber === "" || emergencyContact === "") {
      toast.error(`Please fill all the ${name === "" ? "name" : bio === "" ? "bio" : clubs.length === 0 ? "clubs" : sports.length === 0 ? "sports" : experience === "" ? "experience" : phoneNumber === "" ? "phone number" : "emergency contact"} fields`);
      return;
    }
    const coachData = {
      name,
      phoneNumber,
      emergencyContact,
      locationIds: clubs.map(club => club.id),
      packageIds: selectedPackages.map(pkg => pkg.id),
      sports,
      aboutMe: bio,
      image: profileImage || "https://github.com/shadcn.png",
      stats: {
        yearsOfExperience: parseInt(experience) || 0,
        certifications: certificates.map(cert => ({
          name: cert.name,
          image: cert.image
        })),
        specializations
      }
    };
    // console.log("Coach Data:", coachData);
    try {
      if(id) {
        await updateCoach(id, coachData);
        // console.log("Coach updated:", response);
        toast.success("Coach updated successfully");
        router.push("/coaches");
        
      } else {
        await createCoach(coachData);
        // console.log("Coach created:", response);
        toast.success("Coach created successfully");
        router.push("/coaches");
        setName("");
              setPhoneNumber("");
              setEmergencyContact("");
        setProfileImage(null);
        setBio("");
        setClubs([]);
        setSports([]);
        setExperience("");
        setCertificationText("");
        setCertificationFile(null);
        setCertificateName("");
        setCertificateImage(null);
        setCertificates([]);
        setSpecializations([]);
        setNewSpecialization("");
        setSelectedPackages([]);
      }
    } catch (error) {
      console.error("Error creating coach:", error);
      toast.error("Error creating coach");
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8 space-y-6 transition-all duration-300 hover:shadow-xl"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
          {/* Image upload and preview */}
          <div className="flex flex-col items-center w-full sm:w-40">
          <div>
              <Image
                  src={profileImage || "https://github.com/shadcn.png"}
                  alt="Profile"
                  className="w-30 h-30 rounded-3xl object-cover mt-7"
                  width={112}
                  height={112}
               />

                <div className="flex gap-2 mt-3">
                  <ReCloudinary 
                    id="profilePic"
                    initialUrl={profileImage || "https://github.com/shadcn.png"}
                    onSuccess={(res) => {
                      const imgUrl = res.url;
                      setProfileImage(imgUrl);
                    }}
                    btnClassName='border border-[#c858ba] bg-[#7421931A] text-sm text-[#742193] p-1 rounded-lg'
                    btnIcon={<RefreshCcw />}
                    btnText=""
                    isAlwaysBtn
                    isImgPreview={false}
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
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
          </div>
          {/* Name, Email, Phone */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-bold text-gray-700">Full Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter coach name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Phone Number</label>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Emergency Contact</label>
              <Input
                type="tel"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="Enter emergency contact number"
                required
              />
            </div>
            {/* <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Mobile Number</label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
              />
            </div> */}
            <div className="col-span-2">
            <label className="text-sm font-bold text-gray-700">Experience (years)</label>
            <Input
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Years of experience"
              min={0}
              required
            />
          </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Bio</label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a short bio"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Club/Location</label>
          <MultipleLocationDropdown
            value={clubs.map(club => club.name)}
            options={locationData}
            onChange={(selectedNames) => {
              const selectedClubs = selectedNames.map(name => {
                const location = locationData.find(loc => loc.name === name);
                return { id: String(location?.id || ""), name: location?.name || "" };
              });
              setClubs(selectedClubs);
            }}
            placeholder="Select club(s)..."
            searchPlaceholder="Search club..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Sports</label>
          <MultiSelect
            options={sportsOptionsObj}
            value={sports}
            onChange={setSports}
            placeholder="Select sport(s)..."
            searchPlaceholder="Search sport..."
          />
        </div>
        </div>
        {id && <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Packages</label>
          <MultipleLocationDropdown
            value={selectedPackages.map(pkg => pkg.name)}
            options={packages}
            onChange={(selectedNames) => {
              const selectedPkgs = selectedNames.map(name => {
                const pkg = packages.find(p => p.name === name);
                return { id: String(pkg?.id || ""), name: pkg?.name || "" };
              });
              setSelectedPackages(selectedPkgs);
            }}
            placeholder="Select package(s)..."
            searchPlaceholder="Search package..."
          />
        </div>
        }
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-sm font-bold text-gray-700">Specializations</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {specializations.map((spec, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  <span>{spec}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteSpecialization(index)}
                    className="text-red-500 hover:text-red-600"
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
                placeholder="Add specialization"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSpecialization();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddSpecialization}
                className="commonDarkBG text-white hover:bg-[#581770]"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Certifications</label>
            <div className="space-y-4">
              {/* List of added certificates */}
              {certificates.map((cert, index) => (
                <div key={index} className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-700">{cert.name}</p>
                  </div>
                  <div className="w-16 h-16 relative">
                    <Image
                      src={cert.image}
                      alt={cert.name}
                      className="rounded-lg object-cover"
                      fill
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteCertificate(index)}
                  >
                    <Trash2 className="h-5 w-5 " />
                  </Button>
                </div>
              ))}

              {/* Add new certificate form */}
              <div className="flex flex-col gap-3 p-4 border border-gray-200 rounded-lg">
                <Input
                  type="text"
                  value={certificateName}
                  onChange={(e) => setCertificateName(e.target.value)}
                  placeholder="Certificate name"
                  maxLength={30}
                />
                {certificateName.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {certificateName.length}/30 characters
                  </p>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <ReCloudinary
                      id="certificateImage"
                      initialUrl={certificateImage || ""}
                      onSuccess={(res) => {
                        setCertificateImage(res.url);
                        setCertificateImageName(res.original_filename || "Certificate Image");
                      }}
                      btnClassName="border border-[#c858ba] bg-[#7421931A] text-sm text-[#742193] p-2 rounded-lg w-full"
                      btnIcon={<RefreshCcw className="h-4 w-4" />}
                      btnText={certificateImageName || "Upload Certificate Image"}
                      isAlwaysBtn
                      isImgPreview={false}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddCertificate}
                    className="commonDarkBG text-white hover:bg-[#581770]"
                    disabled={!certificateName.trim() || !certificateImage}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="flex-1 commonDarkBG text-white hover:bg-[#581770] transition-all duration-300"
          >
            {id ? "Update Coach" : "Add Coach"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 hover:bg-orange-50 border-orange-200 text-orange-500 transition-all duration-300"
            onClick={() => {
              setName("");
              setProfileImage(null);
              setBio("");
              setClubs([]);
              setSports([]);
              setExperience("");
              setCertificationText("");
              setCertificationFile(null);
              setCertificateName("");
              setCertificateImage(null);
              setCertificates([]);
              setSelectedPackages([]);
                  // setLinkedin("");
                  // setInstagram("");
                  // setEmail("");
                  // setPhone("");
                  router.back();
              }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CoacheForm;
