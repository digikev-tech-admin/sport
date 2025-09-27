import React, { useState } from "react";
import Image from "next/image";
// import { Eye, EyeIcon, MapPin, SquarePen, Trash2 } from "lucide-react";
// import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
// import { makeLinksClickable } from "@/lib/utils";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

interface Location {
  id: string;
  address: string;
  image: string;
  city: string;
  state: string;
  zipCode: string;
  about: string;
  facilities?: string[];
}

const LocationCard = ({
  location,
  onDelete,
}: {
  location: Location;
  onDelete: (id: string) => void;
}) => {
  console.log({location});
  const router = useRouter();
  const [showAllFacilities, setShowAllFacilities] = useState(false);
  // const handleEdit = () => {
  //   router.push(`/location/${location.id}`);
  // };

  const handleCardClick = () => {
    // Navigate to a detailed view page
    router.push(`/location/${location.id}`);
  };

  return (
    <div 
      className=" bg-white rounded-2xl shadow border border-gray-200 p-4 gap-4  max-w-xl w-full cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex flex-col w-full sm:flex-row  gap-2 items-center sm:items-start ">

      <div className="w-full h-40 sm:w-[120px] sm:h-[120px] rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
        <Image
          src={location.image}
          alt={`${location.city} location`}
          width={120}
          height={120}
          // fill
          className="object-cover object-center w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        {/* <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
      </div>
      
      <div className=" space-y-1 ml-0 sm:ml-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 flex-1">
            {/* <MapPin className="w-5 h-5 text-[#742193] mt-1 flex-shrink-0" /> */}
            <h3 className="font-semibold text-gray-900 line-clamp-2 truncate">
              {location.address}
            </h3>
          </div>
          {/* <div className="flex items-center gap-1"> */}
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1.5"
            >
              <Eye className="w-4 h-4" />
            </Button> */}
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
                    {/* <AlertDialog>
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
                  </AlertDialog> */}

          {/* </div> */}
        </div>

       
          <div className="flex items-center gap-1 text-sm text-gray-600">
            {/* <span className="font-medium text-gray-900">City:</span> */}
            {location.city} {location.state} {location.zipCode}
          </div>
        
          {Array.isArray(location.facilities) && location.facilities.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {(showAllFacilities ? location.facilities : location.facilities.slice(0, 4)).map((facility) => (
                <Badge key={facility} variant="secondary" className="rounded-full px-3 py-1 text-[12px]">
                  {facility}
                </Badge>
              ))}
              {!showAllFacilities && location.facilities.length > 4 && (
                <Badge
                  variant="outline"
                  className="rounded-full px-3 py-1 text-[12px] cursor-pointer select-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAllFacilities(true);
                  }}
                >
                  +{location.facilities.length - 4} more
                </Badge>
              )}
              {showAllFacilities && location.facilities.length > 4 && (
                <Badge
                  variant="outline"
                  className="rounded-full px-3 py-1 text-[12px] cursor-pointer select-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAllFacilities(false);
                  }}
                >
                  Show less
                </Badge>
              )}
            </div>
          )}
          
        

        {/* {location.about && (
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
        )} */}
      </div>
    </div>
    </div>
  );
};

export default LocationCard;
