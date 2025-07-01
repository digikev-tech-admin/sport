import React from "react";
import Image from "next/image";
import { Eye, EyeIcon, MapPin, SquarePen, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { makeLinksClickable } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

interface Location {
  id: string;
  address: string;
  image: string;
  city: string;
  state: string;
  zipCode: string;
  about: string;
}

const LocationCard = ({
  location,
  onDelete,
}: {
  location: Location;
  onDelete: (id: string) => void;
}) => {
  const router = useRouter();
  // const handleEdit = () => {
  //   router.push(`/location/${location.id}`);
  // };

  const handleCardClick = () => {
    // Navigate to a detailed view page
    router.push(`/location/${location.id}/view`);
  };

  return (
    <div 
      className="w-full bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
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
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1.5"
            >
              <Eye className="w-4 h-4" />
            </Button>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(location.id);
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5"
            >
              <Trash2 className="w-4 h-4" />
            </Button> */}
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger> 
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Location</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {location.address}? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(location.id);
                            router.push("/location");
                          }}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="font-medium text-gray-900">City:</span>
            <span>{location.city}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-gray-900">Country:</span>
            <span>{location.state}</span>
          </div>
          <div className="flex items-center gap-1 col-span-2">
            <span className="font-medium text-gray-900">Post Code:</span>
            <span>{location.zipCode}</span>
          </div>
        </div>

        {location.about && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 text-sm">About</h4>
            <div className="text-sm text-gray-600 leading-relaxed">
              {(() => {
                const words = location.about.split(' ');
                const shouldTruncate = words.length > 20;
                const displayText = shouldTruncate ? words.slice(0, 20).join(' ') : location.about;
                
                return (
                  <>
                    {makeLinksClickable(displayText)}
                    {shouldTruncate && (
                      <span 
                        className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/location/${location.id}/view`);
                        }}
                      >
                        ... read more
                      </span>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationCard;
