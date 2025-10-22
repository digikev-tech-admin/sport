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
import { loginAdmin } from '@/api/user/user'; 
import { getAdminData } from '@/config/token';
import EditDeleteActions from '@/components/common/EditDeleteActions';

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const router = useRouter();
  // console.log(id);

  
  const handleDelete = async (id: string, password: string) => {
    try {
      setIsDeleting(true);
      const admin = getAdminData();
      
      if (!admin?.email) {
        toast.error("Missing admin email. Please re-login.");
        return;
      }
      await loginAdmin(admin.email, password);
       await deletePackage(id);
      // setPackages(packages.filter((item) => item.id !== id));
      toast.success("Package deleted successfully");
      router.push("/packages");

      // console.log("res", res);
    } catch (error) {
      console.log("Error:", error);
      toast.error("Failed to delete package");
    }finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      }
  };

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
              <BreadcrumbLink href="/packages">Packages</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{!isEditing ? "Package Detail" :"Edit Package"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* <h1 className="h2 mt-2">Edit Package</h1> */}
      <div className="flex justify-between items-center mt-4">
        <h1 className="h2">{!isEditing ? "Package Detail" :"Edit Package"}</h1>
        <EditDeleteActions
          onEdit={handleEnableEdit}
          editLabel="Edit Package"
          editDisabled={isEditing}
          editButtonClassName="commonDarkBG text-white hover:text-white hover:bg-[#581770]"
          isDeleteOpen={isDeleteDialogOpen}
          onDeleteOpenChange={setIsDeleteDialogOpen}
          onConfirmDelete={(password) => handleDelete(id, password)}
          deleteSubmitting={isDeleting}
          deleteLabel="Delete Package"
          deleteButtonClassName="bg-red-500 text-white hover:text-white hover:bg-red-600"
          deleteTitle="Confirm deletion"
          deleteDescription="Enter your login password to confirm deleting this Package. This action cannot be undone."
          deleteConfirmLabel="Confirm Delete"
        />
        
      </div>
      <div>
        <PackageForm id={id} isEditing={isEditing} setIsEditing={setIsEditing} />
      </div>
    </section>
  )
}

export default Page