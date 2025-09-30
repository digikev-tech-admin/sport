import React from "react";
import { MapPin, Calendar, Clock, Users, UserRoundCog, FileText } from "lucide-react";
import { Package } from "@/types/types";
import { useRouter } from "next/navigation";
import { format } from 'date-fns';
import { formatDateTimeForPackage } from "@/lib/utils";


interface PackageCardProps {
  item: Package;
}




const PackageCard = ({ item }: PackageCardProps) => {
  console.log(item);
    const router = useRouter();

    // const handleDelete = () => {
    //     onDelete(item.id);
    // }

    let ageGroupData = item?.ageGroup === "all" ? "Kids, Teens, Adults" : item?.ageGroup
    ageGroupData = ageGroupData.charAt(0).toUpperCase() + ageGroupData.slice(1);

    
    const handleCardClick = () => {
      router.push(`/packages/${item.id}`);
    };

   
  return (
    <div className="bg-[#ffffff] rounded-2xl border border-[#e6eaff] p-4 max-w-md w-full flex flex-col gap-3 shadow-lg cursor-pointer"
    onClick={handleCardClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap- truncate">
          {/* <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-200">
             <Trophy className="w-5 h-5 text-[#742193]"/>
          </div> */}
          <span className="text-lg font-semibold text-gray-900 ">{item.title}</span>
        </div>
        <span className={`${item.level === 'advanced' ? 'bg-red-600' : item.level === 'intermediate' ? 'bg-orange-400' : 'bg-green-400'} text-gray-900 font-semibold rounded-full px-4 py-1 text-sm shadow border border-gray-200`}>
          {item?.level}
        </span>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-2 text-[15px] text-gray-700 mt-1">

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#742193]" />
          <a
            href={`/location/${item.locationId}`}
            className="underline text-gray-700 hover:text-blue-600 truncate"
          >
            {item.clubs}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <UserRoundCog className="w-4 h-4 text-[#742193]" />
          <span>{item.coachName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#742193]" />
          <span>{ageGroupData}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#742193]" />
          <span>{formatDateTimeForPackage(item.startDate)} - {formatDateTimeForPackage(item.endDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#742193]" />
          <span>{item.duration} Months</span>
        </div>
        
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#742193]" />
          <span>{item.seats} seats</span>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[#e6eaff] pt-3 mt-2">
        <span className="text-[#742193] font-bold text-xl">£{item.price}</span>
        {/* <span className="font-bold text-gray-900 text-lg">{item.seats} <span className="font-normal text-gray-500">Seats</span></span> */}
      </div>
    
    </div>
  );
};

export default PackageCard;
