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
import LocationForm from '@/components/location/LocationForm';
import { deleteLocation } from '@/api/location';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import EditDeleteActions from '@/components/common/EditDeleteActions';
import { getAdminData } from '@/config/token';
import { loginAdmin } from '@/api/admin/admin';

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
      await deleteLocation(id);
      // console.log("location deleted:", response);
      toast.success("location deleted successfully");
      router.push("/location");
    } catch (error) {
      console.error("Error deleting coach:", error);
      toast.error("Error deleting coach");
    } finally {
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
              <BreadcrumbLink href="/location">Location</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{!isEditing ? "Location Detail" :"Edit Location"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* <h1 className="h2 mt-2">Edit Location</h1>/ */}
      <div className="flex justify-between items-center mt-4">
        <h1 className="h2">{!isEditing ? "Location Detail" :"Edit Location"}</h1>
        <EditDeleteActions
          onEdit={handleEnableEdit}
          editLabel="Edit Location"
          editDisabled={isEditing}
          editButtonClassName="commonDarkBG text-white hover:text-white hover:bg-[#581770]"
          isDeleteOpen={isDeleteDialogOpen}
          onDeleteOpenChange={setIsDeleteDialogOpen}
          onConfirmDelete={(password) => handleDelete(id, password)}
          deleteSubmitting={isDeleting}
          deleteLabel="Delete Location"
          deleteButtonClassName="bg-red-500 text-white hover:text-white hover:bg-red-600"
          deleteTitle="Confirm deletion"
          deleteDescription="Enter your login password to confirm deleting this coach. This action cannot be undone."
          deleteConfirmLabel="Confirm Delete"
        />
        {/* <div className="flex gap-4">
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
                <span className="hidden sm:block">Delete Location</span>
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
            <span className="hidden sm:block">Edit Location</span>
          </Button>
        </div> */}
      </div>

      <div>
        <LocationForm id={id} isEditing={isEditing} setIsEditing={setIsEditing} />
      </div>
    </section>
  )
}

export default Page