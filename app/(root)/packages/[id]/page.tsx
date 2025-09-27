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
import { Button } from '@/components/ui/button';
import { Edit, Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  // console.log(id);

  
  const handleDelete = async (id: string) => {
    try {
      const res = await deletePackage(id);
      // setPackages(packages.filter((item) => item.id !== id));
      toast.success("Package deleted successfully");
      router.push("/packages");

      // console.log("res", res);
    } catch (error) {
      console.log("Error:", error);
      toast.error("Failed to delete package");
    }
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
              <BreadcrumbLink href="/packages">Packages</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Package</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* <h1 className="h2 mt-2">Edit Package</h1> */}
      <div className="flex justify-between items-center mt-4">
        <h1 className="h2">Edit Package</h1>
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="bg-red-500 text-white hover:text-white hover:bg-red-600"
            onClick={() => handleDelete(id)}
            disabled={isDeleting}
          >

            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:block">Delete Package</span>
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="commonDarkBG text-white hover:text-white hover:bg-[#581770]"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="w-4 h-4" />
            <span className="hidden sm:block">Edit Package</span>
          </Button>
        </div>
      </div>
      <div>
        <PackageForm id={id} isEditing={isEditing} />
      </div>
    </section>
  )
}

export default Page