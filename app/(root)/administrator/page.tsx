"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import SortSelect from "@/components/SortSelect";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import UserTable from "@/components/users/userTable";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchUsers, removeUser } from "@/redux/features/userSlice";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import SectionHeader from "@/components/SectionHeader";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 5;
const subscriptionOptions = [
  "All",
  "Daily",
  "Weekly",
  "Monthly",
  "Occasionally",
];

const Page = () => {
  
  const dispatch = useAppDispatch();
  const route = useRouter();
  const { users: allUsers } = useAppSelector(
    (state: RootState) => state.user
  );
  // console.log({allUsers})

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("id_asc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Filter and sort users
  const filteredUsers = Array.isArray(allUsers)
    ? allUsers
        .filter((user) => {
          // Only show users with admin role
          const isAdmin = user.role === "admin";
          const matchesSearch = user.name
            ?.toLowerCase() 
            .includes(search?.toLowerCase() ?? "");
          const matchesCategory =
            category === "All" || user.level === category?.toLowerCase();
          return isAdmin && matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
          switch (sortBy) {
            case "name_asc":
              return a.name?.localeCompare(b.name);
            case "name_desc":
              return b.name?.localeCompare(a.name);
            case "date_asc":
              return (
                new Date(a.createdAt ?? "").getTime() -
                new Date(b.createdAt ?? "").getTime()
              );
            case "date_desc":
              return (
                new Date(b.createdAt ?? "").getTime() -
                new Date(a.createdAt ?? "").getTime()
              );
            default:
              return 0;
          }
        })
    : [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleDelete = async (id: string) => {
    try {
      await dispatch(removeUser(id)).unwrap();
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error instanceof Error
          ? error.message
          : "Failed to delete user"
      );
      console.error("Delete Error:", error);
    }
  };

  const handleAddQuizzes = () => {
    route.push(`/administrator/addAdministrator`);
  };

  return (
    <section className="h-auto   p-2 sm:p-7">
      <div className="container mx-auto">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Administrators</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <SectionHeader
          title="Administrators"
          buttonText="Add Admin"
          onButtonClick={handleAddQuizzes}
          icon={<Plus />}
          className="mb-4"
        />

        <div className="grid gap-4 md:grid-cols-2 mb-6 ">
          <SearchBar value={search} onChange={setSearch} />
          {/* <CategoryFilter
            value={category}
            onChange={setCategory}
            subscriptionOptions={subscriptionOptions}
          /> */}
          <SortSelect value={sortBy} onChange={setSortBy} />
        </div>

        {/* <UserTable users={paginatedUsers} onDelete={handleDelete} /> */}
        {typeof window !== "undefined" && (
          <UserTable
            users={paginatedUsers}
            onDelete={handleDelete}
            usersType="administrator"
            startIndex={startIndex}
          />
        )}

        <div className="mt-4">
          {typeof window !== "undefined" && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                })}

                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && <PaginationEllipsis />}
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
    </section>
  );
};

export default Page;
