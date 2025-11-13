'use client'
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
// import { getAdminData } from "@/config/token";
// import { useParams } from "next/navigation";

import AdminDetails from "@/components/administrators/AdminDetails";
import { useParams, useSearchParams } from "next/navigation";

export default function Page() {
  const {id} = useParams<{id: string}>();
  const searchParams = useSearchParams();
  const isProfile = searchParams.get("isProfile") === "true";
  const pageTitle = isProfile ? "My Profile" : "Admin-Info";



  return (
    <section className="bg-[#f9f9f9] h-50 p-2 sm:p-7">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/administrator">Administrator</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="h2 mt-2">{pageTitle}</h1>

      <div className="mt-5">
        <div className="min-w-xl mx-auto">
           <AdminDetails  id={id ?? ''} /> 
           {/* <AdminDetails adminId={adminId} />  */}
          {/* <PersonalDetails id={id ?? ''} /> */}
        </div>
      </div>
    </section>
  );
}
