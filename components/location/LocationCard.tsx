import React from "react";
import Image from "next/image";
import { MapPin, SquarePen, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface Location {
  id: string;
  address: string;
  image: string;
  city: string;
  state: string;
  zipCode: string;
}

const LocationCard = ({
  location,
  onDelete,
}: {
  location: Location;
  onDelete: (id: string) => void;
}) => {
  const router = useRouter();
  const handleEdit = () => {
    router.push(`/location/${location.id}`);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="relative h-48 w-full group">
        <Image
          src={location.image}
          alt={`${location.city} location`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 flex-1">
            <MapPin className="w-5 h-5 text-[#742193] mt-1 flex-shrink-0" />
            <h3 className="font-semibold text-gray-900 line-clamp-2 truncate">
              {location.address}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1.5"
            >
              <SquarePen className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(location.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="font-medium text-gray-900">City:</span>
            <span>{location.city}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-gray-900">State:</span>
            <span>{location.state}</span>
          </div>
          <div className="flex items-center gap-1 col-span-2">
            <span className="font-medium text-gray-900">Zip Code:</span>
            <span>{location.zipCode}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
