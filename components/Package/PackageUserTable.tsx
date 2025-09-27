import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";

interface PackageUserTableProps {
  users: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    level: string;
    ageGroup: string;
    avatar: string;
    price: string;
    status: string;
  }>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  disabled: boolean;
}

const PackageUserTable: React.FC<PackageUserTableProps> = ({ users, onEdit, onDelete, disabled }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="w-full min-w-xl bg-white rounded-2xl border overflow-hidden space-y-6">
      <Table>
        <TableHeader className="bg-[#7421931A]">
          <TableRow>
            <TableHead className="w-[80px] font-bold">Sr. No.</TableHead>
            <TableHead className="font-bold">Name</TableHead>
            {/* <TableHead className="font-bold">Email</TableHead> */}
            <TableHead className="font-bold">Phone</TableHead>
            <TableHead className="font-bold">Level</TableHead>
            <TableHead className="font-bold">Age Group</TableHead>
            <TableHead className="font-bold">Price</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            {/* <TableHead className="text-center font-bold">Actions</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers.map((user, idx) => (
            <TableRow key={user.id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name}</AvatarFallback>
                  </Avatar>
                  {user.name}
                </div>
              </TableCell>
              {/* <TableCell>{user.email}</TableCell> */}
              <TableCell>{user.phone}</TableCell>
              <TableCell className="capitalize">{user.level}</TableCell>
              <TableCell className="capitalize">{user.ageGroup}</TableCell>
              <TableCell>{user.price}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.status}
                </span>
              </TableCell>
              {/* <TableCell className="text-right">
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(user.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(user.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationPrevious onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
        <PaginationContent>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={currentPage === index + 1}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
        <PaginationNext onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} />
      </Pagination>
    </div>
  );
};

export default PackageUserTable;
