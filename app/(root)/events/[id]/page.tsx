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
import EventForm from '@/components/module/ModuleForm';
import { deleteEvent } from '@/api/event';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Edit, Loader2, Trash2 } from 'lucide-react';
import { getAdminData } from '@/config/token';
import { loginAdmin } from '@/api/admin/admin';
import EditDeleteActions from '@/components/common/EditDeleteActions';

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
       await deleteEvent(id);
      // console.log("Event deleted:", response);
      toast.success("Event deleted successfully");
      router.push("/events");
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    } catch (error) {
        console.error("Error deleting event:", error);
      toast.error("Error deleting event");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false)
      }
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
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
              <BreadcrumbLink href="/events">Events</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{!isEditing ? "Event Detail" :"Edit Event"}</BreadcrumbPage> 
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* <h1 className="h2 mt-2">Edit Event</h1> */}
      <div className="flex justify-between items-center mt-4">
        <h1 className="h2">{!isEditing ? "Event Detail" :"Edit Event"}</h1>
        <EditDeleteActions
          onEdit={handleEnableEdit}
          editLabel="Edit Event"
          editDisabled={isEditing}
          editButtonClassName="commonDarkBG text-white hover:text-white hover:bg-[#581770]"
          isDeleteOpen={isDeleteDialogOpen}
          onDeleteOpenChange={setIsDeleteDialogOpen}
          onConfirmDelete={(password) => handleDelete(id, password)}
          deleteSubmitting={isDeleting}
          deleteLabel="Delete Event"
          deleteButtonClassName="bg-red-500 text-white hover:text-white hover:bg-red-600"
          deleteTitle="Confirm deletion"
          deleteDescription="Enter your login password to confirm deleting this Event. This action cannot be undone."
          deleteConfirmLabel="Confirm Delete"
        />
      </div>
      <div>
        <EventForm id={id} isEditing={isEditing} setIsEditing={setIsEditing} />
      </div>
    </section>
  )
}

export default Page