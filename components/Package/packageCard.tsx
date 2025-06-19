import React from "react";
import { MapPin, Calendar, Clock, Users, Trophy, Trash2, SquarePen } from "lucide-react";
import { Package } from "@/types/types";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { formatDateTime } from "@/lib/utils";



interface PackageCardProps {
  item: Package;
  onDelete: (id: string) => void;
}




const PackageCard = ({ item, onDelete }: PackageCardProps) => {
  console.log(item);
    const router = useRouter();

    const handleDelete = () => {
        onDelete(item.id);
    }

    let ageGroupData = item?.ageGroup === "all" ? "Kids, Teens, Adults" : item?.ageGroup
    ageGroupData = ageGroupData.charAt(0).toUpperCase() + ageGroupData.slice(1);

    
    const handleEdit = () => {
      router.push(`/packages/${item.id}`);
    };
  return (
    <div className="bg-[#f6f8ff] rounded-2xl border border-[#e6eaff] p-4 max-w-md w-full flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-200">
             <Trophy className="w-5 h-5 text-[#742193]"/>
          </div>
          <span className="text-lg font-semibold text-gray-900">{item.sport}</span>
        </div>
        <span className="bg-white text-gray-900 font-semibold rounded-full px-4 py-1 text-sm shadow border border-gray-200">
          {item?.level}
        </span>
      </div>
      <div className="flex flex-col gap-2 text-[15px] text-gray-700 mt-1">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#742193]" />
          <a
            href="#"
            className="underline text-gray-700 hover:text-blue-600"
          >
            {item.clubs}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#742193]" />
          <span>{ageGroupData}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#742193]" />
          <span>Starts on {formatDateTime(item.startDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#742193]" />
          <span>{item.duration} Months</span>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[#e6eaff] pt-3 mt-2">
        <span className="text-[#742193] font-bold text-xl">{item.price}</span>
        <span className="font-bold text-gray-900 text-lg">{item.seats} <span className="font-normal text-gray-500">Seats</span></span>
      </div>
      <div className="flex justify-between items-center mt-2">
      <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="text-[blue] hover:text-blue-700"
        >
            <SquarePen className="w-4 h-4 text-[blue]" />
          Edit
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="text-[red] hover:text-red-700"
        >
            <Trash2 className="w-4 h-4 text-[red]" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default PackageCard;
