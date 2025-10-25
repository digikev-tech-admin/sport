"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Filters from "@/components/AllFilters";
import { Plus } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useRouter } from "next/navigation";
import { deleteNotification, getAllNotificationsForAdmin } from "@/api/notification";
import toast from "react-hot-toast";
import NotificationTable from "@/components/notification/NotificationTable";

interface Notification {
  id: string;
  index: number;
  title: string;
  message: string;
  notificationType: string;
  userIds: string[];
  createdAt: string;
}

const ITEMS_PER_PAGE = 5;

const Page = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const route = useRouter();


  useEffect(() => {
    const fetchNotifications = async () => {
      const notifications = await getAllNotificationsForAdmin();
      // console.log({notifications});
    //   const {data} = notifications?.data;
      const formattedNotifications = notifications?.data?.map( 
        (notification: any, index: number) => ({
          id: notification?._id,
          index: index + 1,
          title: notification?.title,
          message: notification?.message,
          notificationType: notification?.notificationType,
          userIds: notification?.userIds,
          createdAt: notification?.createdAt,
        })
      );
      // console.log({formattedNotifications});  
      setNotifications(formattedNotifications);
    };
    fetchNotifications();
  }, []);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const notifications = await getAllNotifications();
//         // console.log(notifications);
//         const formattedNotifications = notifications?.map(
//           (notification: any) => ({
//             id: notification?._id,
//             title: notification?.title,
//             message: notification?.message,
//             notificationType: notification?.notificationType,
//             userIds: notification?.userIds,
//             createdAt: new Date(notification?.createdAt).toLocaleString(),
//           })
//         );
//         // console.log({formattedNotifications});
//         // setNotifications(formattedNotifications);
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//       }
//     };
//     fetchNotifications();
//   }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      toast.success("Notification deleted successfully");
        setNotifications(notifications.filter((notification) => notification.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Error deleting notification");
    }
  };

  const handleAddNotification = () => {
    // console.log("Add Module button clicked!");
    // Add your logic here (e.g., open a modal or navigate to a form)
    route.push(`/notifications/addNotification`);
  };

  const filteredNotifications = useMemo(() => {
    if (!notifications || notifications.length === 0) {
      return [];
    }
    
    return notifications
      .filter((notification) => {
        const searchLower = search.toLowerCase();
        const titleMatch = notification?.title
          ?.toLowerCase()
          ?.includes(searchLower);
        const messageMatch = notification?.message
          ?.toLowerCase()
          ?.includes(searchLower);
        const notificationTypeMatch = notification?.notificationType
          ?.toLowerCase()
          ?.includes(searchLower);
        return (
          (titleMatch || messageMatch || notificationTypeMatch) &&
          (selectedCategory === "all" ||
            notification?.notificationType === selectedCategory)
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "title_asc":
            return a.title?.localeCompare(b.title) || 0;
          case "title_desc":
            return b.title?.localeCompare(a.title) || 0;
          case "message_asc":
            return a.message?.localeCompare(b.message) || 0;
          case "message_desc":
            return b.message?.localeCompare(a.message) || 0;
          default:
            return 0;
        }
      });
  }, [notifications, search, selectedCategory, sortBy]);

  const allNotificationTypes = notifications?.map(
    (notification) => notification?.notificationType
  ) || [];
  const categories = ["all", ...Array.from(new Set(allNotificationTypes))];

  const sortOptions = [
    { value: "all", label: "All" },
    { value: "title_asc", label: "Title (A-Z)" },
    { value: "title_desc", label: "Title (Z-A)" },
    { value: "message_asc", label: "Message (A-Z)" },
    { value: "message_desc", label: "Message (Z-A)" },
    { value: "notificationType_asc", label: "Notification Type (A-Z)" },
    { value: "notificationType_desc", label: "Notification Type (Z-A)" },
  ];

  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNotifications = filteredNotifications.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      <section className="h-auto   p-2 sm:p-4 xl:p-8">
        <div className="">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Notifications</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <SectionHeader
            title="Notifications"
            buttonText="Add Notification"
            onButtonClick={handleAddNotification}
            icon={<Plus />}
            className="mb-4"
          />

          <div className=" h-12 mt-4">
            <div className="min-w-xl mx-auto">
              <div className="mb-8 space-y-4">
                <Filters
                  search={search}
                  setSearch={setSearch}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  categories={categories}
                  sortOptions={sortOptions}
                  title="Notification"
                />
              </div>
              <div>
                <h3 className="text-[#742193] font-semibold  ">
                  {" "}
                  All Notifications
                </h3>

                {typeof window !== "undefined" && (
                  <NotificationTable
                    notifications={paginatedNotifications}
                    onDelete={handleDelete}
                  />
                )}

                <div className="mt-4">
                  {typeof window !== "undefined" && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50 "
                                : "cursor-pointer text-[#742193] hover:text-[#57176e] hover:border hover:border-[#7421931A] hover:bg-[#7421931A]"
                            }
                          />
                        </PaginationItem>

                        {currentPage > 3 && (
                          <>
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => setCurrentPage(1)}
                                isActive={currentPage === 1}
                                className="cursor-pointer text-[#742193] hover:text-[#57176e]"
                              >
                                1
                              </PaginationLink>
                            </PaginationItem>
                            {currentPage > 4 && <PaginationEllipsis />}
                          </>
                        )}

                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            const pageNumber = Math.max(1, currentPage - 2) + i;
                            return pageNumber <= totalPages ? (
                              <PaginationItem key={pageNumber}>
                                <PaginationLink
                                  onClick={() => setCurrentPage(pageNumber)}
                                  isActive={currentPage === pageNumber}
                                  className={
                                    currentPage === pageNumber
                                      ? "text-[#742193] border border-[#7421931A] bg-[#7421931A]"
                                      : "cursor-pointer text-[#742193] hover:text-[#57176e]"
                                  }
                                >
                                  {pageNumber}
                                </PaginationLink>
                              </PaginationItem>
                            ) : null;
                          }
                        )}

                        {currentPage < totalPages - 2 && (
                          <>
                            {currentPage < totalPages - 3 && (
                              <PaginationEllipsis />
                            )}
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => setCurrentPage(totalPages)}
                                isActive={currentPage === totalPages}
                                className="cursor-pointer text-[#742193] hover:text-[#57176e]"
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setCurrentPage((p) => Math.min(totalPages, p + 1))
                            }
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer text-[#742193] hover:text-[#57176e] hover:border hover:border-[#7421931A] hover:bg-[#7421931A]"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
