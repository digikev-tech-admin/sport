'use client'

import React, { ReactNode } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { cloudinaryConfig } from '@/config/cloudinary'

interface CloudinaryProviderProps {
  children: ReactNode
}

const CloudinaryProvider: React.FC<CloudinaryProviderProps> = ({ children }) => {
  return (
    <CldUploadWidget
      uploadPreset={cloudinaryConfig.uploadPreset}
    >
      {({ open }) => (
        <div onClick={() => open()}>
          {children}
        </div>
      )}
    </CldUploadWidget>
  )
}

export default CloudinaryProvider 