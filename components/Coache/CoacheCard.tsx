import React from "react";
import { MapPin, Trophy, Trash2, SquarePen, Eye } from "lucide-react";
import Image from "next/image";
import { Coach } from "@/types/types";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface CoachCardProps {
  coach: Coach;
  onDelete: (id: string) => void;
}

function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <svg
        key={i}
        className="w-6 h-6 text-[#FFC107]"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
      </svg>
    );
  }
  if (halfStar) {
    stars.push(
      <svg
        key="half"
        className="w-6 h-6 text-[#FFC107]"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <defs>
          <linearGradient id="half">
            <stop offset="50%" stopColor="#FFC107" />
            <stop offset="50%" stopColor="#E0E0E0" />
          </linearGradient>
        </defs>
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"
          fill="url(#half)"
        />
      </svg>
    );
  }
  return stars;
}

const CoachCard = ({ coach, onDelete }: CoachCardProps) => {
  const router = useRouter();
  const handleDelete = () => {
    onDelete(coach.id);
  };

  const handleEdit = () => {
    router.push(`/coaches/${coach.id}`);
  };

  const handleCardClick = () => {
    // Navigate to a detailed view page
    router.push(`/coaches/${coach.id}/view`);
  };


  return (

    <div className="bg-white rounded-2xl shadow border border-gray-200 p-4 gap-4  max-w-xl w-full">
      
      <div className="flex flex-col w-full sm:flex-row  gap-4 items-center sm:items-start">
      <div className="w-full sm:w-[120px] h-[120px] rounded-xl overflow-hidden flex-shrink-0">
        <Image
          src={coach.imageUrl ? coach.imageUrl : "/images/Coache.png"}
          alt={coach.name}
          className="w-full h-full object-cover rounded-xl "
          width={120}
          height={120}
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-2 w-full">
        <div className="flex items-start justify-between w-full">
          <div className=" w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {coach.name}
              </h3>
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCardClick}
                  className="text-[#742193] hover:text-[#581770] hover:bg-[#742193]/10 font-medium px-1"
                >
                  <Eye className="text-[#742193] hover:text-[#581770]" />
                </Button>
              </div>
            </div>
            <div className="flex items-center text-gray-600 text-sm mb-1">
              <MapPin className="w-4 h-4 mr-1" />
              {coach.clubs.join(", ")}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Trophy className="w-5 h-5 text-[#581770] " />
          {coach.sports.map((sport) => (
            <div key={sport} className=" bg-purple-100 rounded-full px-2 py-1">
              <span className="text-gray-800 text-sm font-medium">{sport}</span>
            </div>
          ))}
        </div>
        {/* <div className="flex items-center justify-between gap-2 mt-4 border-t pt-2 border-gray-100">
          <div className="flex items-center gap-1">
            {renderStars(coach.rating)}
            <span className="ml-1 text-gray-500 font-semibold text-base">
              {coach.rating}
            </span>
          </div>
          <span className="ml-4 text-gray-400 text-base">
            {coach.reviews.toLocaleString()} Reviews
          </span>
        </div> */}
      </div>
      </div>
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        <span className="text-[#742193] font-bold text-sm flex items-center">
          <span className="mr-1">⚡</span> Specializations:
        </span>
        {coach.specializations.map((specialization) => (
          <div
            key={specialization}
            className="bg-orange-100 rounded-full px-3 py-1 max-w-[140px] overflow-hidden whitespace-nowrap"
          >
            <span className="text-gray-800 text-sm font-medium">{specialization}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoachCard;
