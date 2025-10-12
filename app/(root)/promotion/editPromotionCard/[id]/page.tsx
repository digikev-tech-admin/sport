
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

import { loginAdmin } from "@/api/admin/admin";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
// Icons are used inside EditDeleteActions; remove direct imports here
import EditDeleteActions from "@/components/common/EditDeleteActions";
import { getAdminData } from "@/config/token";
import { deleteCarouselCard } from "@/api/promotion";
import PromotionCardForm from "@/components/promotion/PromotionCardForm";

const Page = () => {
  const {id} = useParams<{id: string}>();
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
      
       await deleteCarouselCard(id);
      // console.log("Coach deleted:", response);
      toast.success("Carousel Card deleted successfully");
      router.push("/promotion?tab=promotions_cards");
    
    } catch (error) {
      console.error("Error deleting carousel card:", error);
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
              <BreadcrumbLink href="/promotion?tab=promotions_cards">Promotion</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{!isEditing ? "Promotion Details" :"Edit Promotion"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex justify-between items-center mt-4">
        <h1 className="h2">{!isEditing ? "Promotion Details" :"Edit Promotion"}</h1>
        <EditDeleteActions
          onEdit={handleEnableEdit}
          editLabel="Edit Promotion"
          editDisabled={isEditing}
          editButtonClassName="commonDarkBG text-white hover:text-white hover:bg-[#581770]"
          isDeleteOpen={isDeleteDialogOpen}
          onDeleteOpenChange={setIsDeleteDialogOpen}
          onConfirmDelete={(password) => handleDelete(id, password)}
          deleteSubmitting={isDeleting}
          deleteLabel="Delete Promotion"
          deleteButtonClassName="bg-red-500 text-white hover:text-white hover:bg-red-600"
          deleteTitle="Confirm deletion"
          deleteDescription="Enter your login password to confirm deleting this promotion. This action cannot be undone."
          deleteConfirmLabel="Confirm Delete"
        />
      </div>

      <div>
      <PromotionCardForm id={id} isEditing={isEditing} setIsEditing={setIsEditing} />
      </div>
    </section>
  );
};


export default Page;
