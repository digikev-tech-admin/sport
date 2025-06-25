'use client'
import React, { useEffect, Suspense } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import UpdateCouponForm from '@/components/plan&Billing/EditCoupon';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import { fetchCouponById } from '@/redux/features/couponSlice';

const EditCouponContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const dispatch = useAppDispatch();

  const { couponById: data } = useAppSelector((state: RootState) => state.coupon);

  // console.log({data});

  useEffect(() => {
    if (id) {
      dispatch(fetchCouponById(id as string))
        .unwrap()
        .catch(() => toast.error("Failed to fetch coupon details!"));
    }
  }, [dispatch, id]);

  if (!data) return <div>Loading...</div>

  const transformedPlan = {
    _id: data?._id,
    code: data?.code,
    discountPercentage: data?.discountPercentage ?? 0,
    allowedModule: data?.allowedModule ?? "all",
    useFrequency: data?.useFrequency ?? 1,
    validFrom: data?.validFrom ?? new Date(),
    validUntil: data?.validUntil ?? new Date(),
    isActive: data?.isActive ?? true,
    usedCount: data?.usedCount ?? 0,
    maxUses: data?.maxUses ?? 0,
  };

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
              <BreadcrumbLink href="/plan-billing">Subscription</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Coupon</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="h2 mt-2">Edit Coupon</h1>
      <div>
        <UpdateCouponForm initialData={transformedPlan} />
      </div>
    </section>
  )
}

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditCouponContent />
    </Suspense>
  )
}

export default Page