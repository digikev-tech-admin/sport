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
import { deleteCoach } from "@/api/coach";
import { loginAdmin } from "@/api/admin/admin";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// Icons are used inside EditDeleteActions; remove direct imports here
import EditDeleteActions from "@/components/common/EditDeleteActions";
import { getAdminData } from "@/config/token";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
      
       await deleteCoach(id);
      // console.log("Coach deleted:", response);
      toast.success("Coach deleted successfully");
      router.push("/coaches");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error deleting coach:", error);
      toast.error("Password incorrect or deletion failed");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
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
        <EditDeleteActions
          onEdit={handleEnableEdit}
          editLabel="Edit Coach"
          editDisabled={isEditing}
          editButtonClassName="commonDarkBG text-white hover:text-white hover:bg-[#581770]"
          isDeleteOpen={isDeleteDialogOpen}
          onDeleteOpenChange={setIsDeleteDialogOpen}
          onConfirmDelete={(password) => handleDelete(id, password)}
          deleteSubmitting={isDeleting}
          deleteLabel="Delete Coach"
          deleteButtonClassName="bg-red-500 text-white hover:text-white hover:bg-red-600"
          deleteTitle="Confirm deletion"
          deleteDescription="Enter your login password to confirm deleting this coach. This action cannot be undone."
          deleteConfirmLabel="Confirm Delete"
        />
      </div>

      <div>
        <CoacheForm id={id} isEditing={isEditing} />
      </div>
    </section>
  );
};

export default Page;
