import { Event } from "../types/types";
import { Calendar, MapPin, SquarePen, Trash2, Trophy } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDateTime } from "@/lib/utils";

interface EventCardProps {
  module: Event;
  onDelete: (id: string) => void;
}

const EventCard = ({ module, onDelete }: EventCardProps) => {
  const router = useRouter();
  const handleDelete = () => {
    onDelete(module.id);
    // alert("event deleted");
  };

  const handleEdit = () => {
    router.push(`/events/${module.id}`);
  };

  // Format interested count (e.g., 4700 -> 4.7K)
  const formatInterested = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return num;
  };

  return (
    <div className="bg-white rounded-[16px] shadow-md hover:shadow-sm transition-shadow duration-300 p-4 flex flex-col md:flex-row gap-4 items-center md:items-start">
      <div className="w-full md:w-[150px]  md:h-[150px] rounded-[12px] object-cover flex-shrink-0 overflow-hidden">   
      <Image
        src={module.imageUrl ? module.imageUrl : "/images/event.png"}
        //  src="/images/event.png"
        alt={module.title}
        className="w-full h-full object-cover rounded-[12px] flex-shrink-0"
        width={110}
        height={90}
        sizes="(max-width: 768px) 100vw, 110px"
        priority={true}
      />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-2 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col">
          <h3 className="text-[20px] font-semibold text-gray-900 text-wrap">
            {module.title}
          </h3>
          <h5 className="flex items-center gap-1 text-[15px] font-bold text-[#742193] truncate">
          <Trophy className="w-4 h-4" />
            {module.sport}
          </h5>
          </div>
          <div className="flex items-center gap-2"> 
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-[red] hover:text-red-700 hover:bg-red-50 font-medium px-1"
          >
            <Trash2 className="text-[red] hover:text-red-700" />
            </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="text-[blue] hover:text-blue-700 hover:bg-blue-50 font-medium px-1"
          >
            <SquarePen className="text-[blue] hover:text-blue-700" />
            </Button>
        </div>
        </div>
        <div className="flex flex-col 2xl:flex-row 2xl:items-center gap-1 2xl:gap-4 text-gray-500 text-[15px]">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> {formatDateTime(module.date)}
          </span>
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-4 h-4" /> {module.location}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[17px] font-semibold text-gray-900">{formatInterested(module.interested)}</span>
          <span className="text-gray-500 text-[15px]">interested</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
