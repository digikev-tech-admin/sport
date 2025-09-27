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
import { Button } from '@/components/ui/button';
import { Edit, Loader2, Trash2 } from 'lucide-react';

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  // console.log(id);


  
  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await deleteEvent(id);
      console.log("Event deleted:", response);
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
      }
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
              <BreadcrumbPage>Edit Event</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* <h1 className="h2 mt-2">Edit Event</h1> */}
      <div className="flex justify-between items-center mt-4">
        <h1 className="h2">Edit Event</h1>
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
                <span className="hidden sm:block">Delete Event</span>
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
            <span className="hidden sm:block">Edit Event</span>
          </Button>
        </div>
      </div>
      <div>
        <EventForm id={id} isEditing={isEditing} />
      </div>
    </section>
  )
}

export default Page