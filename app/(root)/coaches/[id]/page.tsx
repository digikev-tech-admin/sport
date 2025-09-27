"use client";
import React, { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CoacheForm from "@/components/Coache/CoacheForm";
import { Button } from "@/components/ui/button";
import { deleteCoach } from "@/api/coach";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Edit, Loader2, Trash2 } from "lucide-react";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // console.log(id);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await deleteCoach(id);
      console.log("Coach deleted:", response);
      toast.success("Coach deleted successfully");
      router.push("/coaches");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error deleting coach:", error);
      toast.error("Error deleting coach");
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
              <BreadcrumbLink href="/coaches">Coaches</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Coach</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex justify-between items-center mt-4">
        <h1 className="h2">Edit Coach</h1>
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
                <span className="hidden sm:block">Delete Coach</span>
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
            <span className="hidden sm:block">Edit Coach</span>
          </Button>
        </div>
      </div>

      <div>
        <CoacheForm id={id} isEditing={isEditing} />
      </div>
    </section>
  );
};

export default Page;
