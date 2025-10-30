// "use client"

// import React, { useState } from 'react'
// import Image from 'next/image'
// import { IoIosCloseCircleOutline } from "react-icons/io"
// import { Button } from '../ui/button'
// import { Plus } from 'lucide-react'
// import { CldUploadWidget } from "next-cloudinary"
// import toast from 'react-hot-toast'

// interface CloudinaryProps {
//     id: string
//     initialUrl?: string
//     onSuccess: (res: any) => void;
//     isMultiple?: boolean;
//     imgClassName?: string;
//     containerClassName?: string;

//     btnText?: string;
//     btnClassName?: string;
//     btnIcon?: any

//     isAlwaysBtn?: boolean;
//     isImgPreview?: boolean;
//     disabled?: boolean;
//     aspectRatio?: string | number; // e.g. "16:9" or 1.777...
//     targetResolution?: { width: number; height: number };
//     enforceCrop?: boolean; // if true, prefer returning transformed url
//     deliveryMode?: 'fill' | 'fit';
//     gravity?: string; // e.g. 'auto'
//     enableCropping?: boolean; // allow cropping UI without enforcing aspect/size
// }

// const ReCloudinary: React.FC<CloudinaryProps> = ({ 
//     id, 
//     initialUrl, 
//     isMultiple = false, 
//     imgClassName, 
//     containerClassName, 
//     btnText = 'Add attachment', 
//     btnClassName, 
//     btnIcon = <Plus className="w-4 h-4" />, 
//     isImgPreview = true, 
//     isAlwaysBtn, 
//     onSuccess,
//     disabled = false,
//     aspectRatio,
//     targetResolution,
//     enforceCrop = false,
//     deliveryMode = 'fill',
//     gravity = 'auto'
//     , enableCropping = false
// }) => {
//     const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null)

//     const getCroppingAspect = (): number | undefined => {
//         // Explicit prop has highest priority
//         if (aspectRatio !== undefined) {
//             if (typeof aspectRatio === 'number') return aspectRatio
//             const ratioStr = String(aspectRatio)
//             if (ratioStr.includes(':')) {
//                 const [w, h] = ratioStr.split(':').map(Number)
//                 if (isFinite(w) && isFinite(h) && h !== 0) return w / h
//             }
//             const asNum = Number(ratioStr)
//             return isFinite(asNum) ? asNum : undefined
//         }

//         if (typeof aspectRatio === 'number') return aspectRatio
//         return undefined
//     }

//     const buildTransformedUrl = (secureUrl: string) => {
//         if (!targetResolution) return secureUrl
//         try {
//             const url = new URL(secureUrl)
//             const uploadIndex = url.pathname.indexOf('/upload/')
//             if (uploadIndex === -1) return secureUrl
//             const before = url.pathname.substring(0, uploadIndex + '/upload/'.length)
//             const after = url.pathname.substring(uploadIndex + '/upload/'.length)
//             const transformation = `c_${deliveryMode},g_${gravity},w_${targetResolution.width},h_${targetResolution.height}`
//             url.pathname = `${before}${transformation}/${after}`
//             return url.toString()
//         } catch {
//             return secureUrl
//         }
//     }

//     const handleUploadSuccess = (res: any) => {
//         const imgUrl: string = (res.url as string) || (res.secure_url as string)
//         const originalWidth: number | undefined = (res.width as number) ?? (res.original_width as number)
//         const originalHeight: number | undefined = (res.height as number) ?? (res.original_height as number)

//         const transformedUrl = targetResolution ? buildTransformedUrl(imgUrl) : imgUrl
//         if (targetResolution && originalWidth && originalHeight) {
//             if (originalWidth < targetResolution.width || originalHeight < targetResolution.height) {
//                 // Warn when uploaded image is below target dimensions
//                 // Consumers can surface a toast if needed
//                 toast.error(`Uploaded image (${originalWidth}x${originalHeight}) is smaller than target ${targetResolution.width}x${targetResolution.height}`)
//             }
//         }
//         const finalUrl = enforceCrop && targetResolution ? transformedUrl : imgUrl

//         setPreviewUrl(finalUrl)
//         onSuccess({
//             ...res,
//             url: finalUrl,
//             originalUrl: imgUrl,
//             transformedUrl,
//             originalWidth,
//             originalHeight,
//         })
//     }

//     return (
//         <CldUploadWidget
//             uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""}
//             onSuccess={(result) => {
//                 if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
//                     const formattedResult = {
//                         ...result.info,
//                         url: result.info.secure_url,
//                         fileId: result.info.public_id
//                     };
//                     handleUploadSuccess(formattedResult);
//                 }
//             }}
//             options={{
//                 multiple: isMultiple,
//                 resourceType: "image",
//                 clientAllowedFormats: ["image", "jpg", "jpeg", "png", "gif", "webp", "heic", "heif", "bmp", "tiff", "svg"],
//                 maxFiles: isMultiple ? 10 : 1,
//                 maxFileSize: 10485760, // 10MB limit
//                 cropping: Boolean(enableCropping || aspectRatio || enforceCrop),
//                 croppingAspectRatio: getCroppingAspect(),
//                 croppingShowDimensions: true,
//                 showSkipCropButton: enableCropping ? false : !enforceCrop,
//                 croppingCoordinatesMode: 'custom',
//             }}
//         >
//             {({ open }) => (
//                 <>
//                     {(!previewUrl || isAlwaysBtn) && (
//                         <Button
//                             type='button'
//                             size={btnText ? 'default' : 'icon'}
//                             variant="outline"
//                             className={` ${btnClassName}`}
//                             id={`${id}-upload-btn`}
//                             onClick={() => open()}
//                             disabled={disabled}
//                         >
//                             {btnIcon}
//                             {btnText}
//                         </Button>
//                     )}
//                     {previewUrl && isImgPreview && (
//                         <div className={`mt-4 relative inline-block ${containerClassName}`}>
//                             <Image
//                                 src={previewUrl}
//                                 alt="Attached image"
//                                 width={200}
//                                 height={200}
//                                 loading="lazy"
//                                 className={`object-cover h-auto w-auto sm:max-w-[15rem] ${imgClassName}`}
//                             />
//                             <button
//                                 type="button"
//                                 className="absolute -top-1 -right-1 bg-white rounded-full hover:rotate-180 transition hover:scale-110 transform focus:outline-none"
//                                 onClick={() => setPreviewUrl(null)}
//                                 disabled={disabled}
//                                 id={`${id}-clear-btn`}
//                             >
//                                 <IoIosCloseCircleOutline className="text-blueCustom size-4 sm:size-5" />
//                             </button>
//                         </div>
//                     )}
//                 </>
//             )}
//         </CldUploadWidget>
//     )
// }

// export default ReCloudinary 