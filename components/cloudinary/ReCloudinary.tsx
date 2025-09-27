"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { IoIosCloseCircleOutline } from "react-icons/io"
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { CldUploadWidget } from "next-cloudinary"

interface CloudinaryProps {
    id: string
    initialUrl?: string
    onSuccess: (res: any) => void;
    isMultiple?: boolean;
    imgClassName?: string;
    containerClassName?: string;

    btnText?: string;
    btnClassName?: string;
    btnIcon?: any

    isAlwaysBtn?: boolean;
    isImgPreview?: boolean;
    disabled?: boolean;
}

const ReCloudinary: React.FC<CloudinaryProps> = ({ 
    id, 
    initialUrl, 
    isMultiple = false, 
    imgClassName, 
    containerClassName, 
    btnText = 'Add attachment', 
    btnClassName, 
    btnIcon = <Plus className="w-4 h-4" />, 
    isImgPreview = true, 
    isAlwaysBtn, 
    onSuccess,
    disabled = false
}) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null)

    const handleUploadSuccess = (res: any) => {
        const imgUrl: string = res.url
        setPreviewUrl(imgUrl)
        onSuccess(res)
    }

    return (
        <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""}
            onSuccess={(result) => {
                if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                    const formattedResult = {
                        ...result.info,
                        url: result.info.secure_url,
                        fileId: result.info.public_id
                    };
                    handleUploadSuccess(formattedResult);
                }
            }}
            options={{
                multiple: isMultiple,
                resourceType: "image",
                clientAllowedFormats: ["image", "jpg", "jpeg", "png", "gif", "webp", "heic", "heif", "bmp", "tiff", "svg"],
                maxFiles: isMultiple ? 10 : 1,
                maxFileSize: 10485760, // 10MB limit
            }}
        >
            {({ open }) => (
                <>
                    {(!previewUrl || isAlwaysBtn) && (
                        <Button
                            type='button'
                            size={btnText ? 'default' : 'icon'}
                            variant="outline"
                            className={` ${btnClassName}`}
                            onClick={() => open()}
                            disabled={disabled}
                        >
                            {btnIcon}
                            {btnText}
                        </Button>
                    )}
                    {previewUrl && isImgPreview && (
                        <div className={`mt-4 relative inline-block ${containerClassName}`}>
                            <Image
                                src={previewUrl}
                                alt="Attached image"
                                width={200}
                                height={200}
                                loading="lazy"
                                className={`object-cover h-auto w-auto sm:max-w-[15rem] ${imgClassName}`}
                            />
                            <button
                                type="button"
                                className="absolute -top-1 -right-1 bg-white rounded-full hover:rotate-180 transition hover:scale-110 transform focus:outline-none"
                                onClick={() => setPreviewUrl(null)}
                                disabled={disabled}
                            >
                                <IoIosCloseCircleOutline className="text-blueCustom size-4 sm:size-5" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </CldUploadWidget>
    )
}

export default ReCloudinary 