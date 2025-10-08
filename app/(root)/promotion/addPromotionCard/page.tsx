'use client'
import React, { Suspense } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Loader from '@/components/shared/Loader';
import PromotionForm from '@/components/promotion/PromotionForm';

const Promotion = () => {
  return (
    <section className="bg-[#f9f9f9] h-50 p-2 sm:p-4 xl:p-8"> 
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/promotion">Promotion Details</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Add Promotion</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="h2 mt-2">Add Promotion</h1>
      <PromotionForm id={""} isEditing={true} />

    </section>
  )
}

const Page = () => {

  return (
    <Suspense fallback={<Loader/>}>
      <Promotion />
    </Suspense>
  )
}

export default Page