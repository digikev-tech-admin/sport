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
import { useRouter } from "next/navigation";

interface NotificationTableProps {
  notifications: any[];
  onDelete: (id: string) => void;
}

const NotificationTable = ({ notifications, onDelete }: NotificationTableProps) => {
  // console.log({notifications})
  const router = useRouter()

  const handleViewDetails = (id: string) => {
    router.push(`/notifications/${id}`)
  };

  return (
    <div className=" w-full min-w-xl bg-white rounded-2xl border overflow-hidden space-y-6 mt-5">
      <Table>
        <TableHeader className="bg-[#7421931A] ">
          <TableRow>
            <TableHead className="w-[80px] font-bold">Sr. No.</TableHead>
            <TableHead className="font-bold">Title</TableHead>
            {/* <TableHead className="font-bold">Message</TableHead> */}
            <TableHead className="font-bold">Notification Type</TableHead>
            <TableHead className="font-bold">Created At</TableHead>
            <TableHead className="text-center font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.map((notification, idx) => (
            <TableRow key={notification.id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell className="capitalize">
                {notification?.title?.length > 20 
                  ? `${notification?.title?.substring(0, 20)}...` 
                  : notification?.title}
              </TableCell>
              {/* <TableCell className="capitalize">
                {notification?.message?.length > 25 
                  ? `${notification?.message?.substring(0, 25)}...` 
                  : notification?.message}
              </TableCell> */}
              <TableCell className="capitalize ">{notification?.notificationType}</TableCell>
              <TableCell>
              {notification?.createdAt
              ? new Date(notification.createdAt).toLocaleString()
              : ''}

              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(notification?.id)}
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
                        <AlertDialogTitle>Delete Notification</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {notification?.title}? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(notification?.id)}
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

export default NotificationTable;