'use client'
import React, { useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import PackageForm from '@/components/Package/packageForm';
import { deletePackage } from '@/api/package';
import toast from 'react-hot-toast';

import { useParams, useRouter } from 'next/navigation';
import { loginAdmin } from '@/api/user/user'; 
import { getAdminData } from '@/config/token';
import EditDeleteActions from '@/components/common/EditDeleteActions';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import PromotionForm from '@/components/promotion/PromotionForm';

const Page = () => {
  const {id} = useParams<{id: string}>();
  const [isEditing, setIsEditing] = useState(false);

  // const router = useRouter();
  // console.log(id);

  
 

  const handleEnableEdit = () => {
    setIsEditing(true);
  };

  return (
    <section className="bg-[#f9f9f9] h-50 p-1 sm:p-4 xl:p-8">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/promotion">Promotion</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{!isEditing ? "Promotion Detail" :"Edit Promotion"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* <h1 className="h2 mt-2">Edit Package</h1> */}
      <div className="flex justify-between items-center mt-4">
        <h1 className="h2">{!isEditing ? "Promotion Detail" :"Edit Promotion"}</h1>
        <Button 
         type="button"
        variant="outline"
        className="commonDarkBG text-white hover:text-white hover:bg-[#581770]"
        disabled={isEditing}
        onClick={handleEnableEdit}>
          <Edit className="w-4 h-4" />
          <span className="hidden sm:block">Edit Promotion</span>
        </Button>
      </div>
      <div>
        <PromotionForm id={id} isEditing={isEditing} setIsEditing={setIsEditing} />
      </div>
    </section>
  )
}

export default Page