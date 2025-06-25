"use client";
import React, { useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import EditPlanForm from "@/components/plan&Billing/EditPlan";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { fetchPlanById } from "@/redux/features/planSlice";
import toast from "react-hot-toast";

const Page = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { planById: data } = useAppSelector((state: RootState) => state.plan);

  useEffect(() => {
    if (id) {
      dispatch(fetchPlanById(id as string))
        .unwrap()
        .catch(() => toast.error("Failed to fetch plan details!"));
    }
  }, [dispatch, id]);

  if(!data) return <div>Loading...</div>

  const transformedPlan = {
    _id: data?._id,
    name: data?.name,
    monthlyPrice: data?.monthlyPrice,
    yearlyPrice: data?.yearlyPrice,
    details: data?.details?.map((detail, index) => ({
      id: index + 1,
      detail,
    })),
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
              <BreadcrumbPage>Edit Plan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="h2 mt-2">Edit Plan</h1>
      <div>
        <EditPlanForm initialData={transformedPlan} />
      </div>
    </section>
  );
};

export default Page;
