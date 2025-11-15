"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUser } from "@/types/user";
import { useRouter } from "next/navigation";

interface UserTableProps {
  users: IUser[];
  onDelete: (id: string) => void;
  usersType: 'users' | 'administrator';
  startIndex?: number;
}

const UserTable = ({ users, onDelete, usersType, startIndex = 0 }: UserTableProps) => {
  const router = useRouter()

  const handleViewDetails = (user: IUser) => {
    router.push(`/${usersType}/${user?._id}`)
  };

  return (
    <div className=" w-full min-w-xl bg-white rounded-2xl border overflow-hidden space-y-6">
      <Table>
        <TableHeader className="bg-[#7421931A] ">
          <TableRow>
            <TableHead className="w-[80px] font-bold">Sr. No.</TableHead>
            <TableHead className="font-bold">Name</TableHead>
           
            <TableHead className="font-bold">Email</TableHead>
            <TableHead className="font-bold">Phone</TableHead>
            <TableHead className="font-bold">Role</TableHead>
            {usersType === 'users' && <TableHead className="font-bold">Gender</TableHead>}
            <TableHead className="font-bold">Join Date</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="text-center font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.length > 0 && users?.map((user, idx) => (
            <TableRow key={user?._id}>
              <TableCell>{startIndex + idx + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.avatar || 'https://github.com/shadcn.png'} />
                    <AvatarFallback>{user?.name || 'N/A'}</AvatarFallback>
                  </Avatar>
                  {user?.name || 'N/A'}
                </div>
              </TableCell>
             
              <TableCell >
                {user?.email || 'N/A'}
             
                </TableCell>
                <TableCell className="capitalize">
                {user?.phone || 'N/A'}
                </TableCell>
                <TableCell className="capitalize">{user?.role || 'N/A'  }</TableCell>
                {usersType === 'users' && <TableCell className="capitalize">{user?.gender || 'N/A'  }</TableCell>}
              
              <TableCell>{new Date(user?.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${user?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(user)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {user.name}? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(user._id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;