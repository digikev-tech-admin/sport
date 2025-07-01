import React from "react";
import { CldUploadWidget } from "next-cloudinary";
import toast from "react-hot-toast";

interface CloudinaryProps {
  id: string;
  multiple?: boolean;
  onSuccess: (res: any) => void;
}

const Cloudinary: React.FC<CloudinaryProps> = ({ id, multiple, onSuccess }) => {
  // Handle upload errors
  const onError = (err: any) => {
    console.error(err);
    toast.error(
      err?.message
        ? `An error occurred while uploading image: ${err.message}`
        : "Something went wrong during the image upload process. Please try again later."
    );
  };

  return (
    <div className="hidden cursor-pointer">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""}
        onSuccess={(result) => {
          if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
            // Format response to match what the existing code expects
            const formattedResult = {
              ...result.info,
              url: result.info.secure_url,
              fileId: result.info.public_id
            };
            onSuccess(formattedResult);
          }
        }}
        onError={onError}
        options={{
          multiple: multiple || false,
          resourceType: "image",
          clientAllowedFormats: ["image", "jpg", "jpeg", "png", "gif", "webp", "heic", "heif", "bmp", "tiff", "svg"], 
          maxFiles: multiple ? 10 : 1,
        }}
      >
        {({ open }) => (
          <input
            id={id}
            type="file"
            onClick={() => open()}
            className="hidden"
            multiple={multiple}
          />
        )}
      </CldUploadWidget>
    </div>
  );
};

export default Cloudinary; 