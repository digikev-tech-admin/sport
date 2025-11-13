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
// import { Button } from "@/components/ui/button";
// import { Eye, Trash2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Eye, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getOrdersByUserId, updateOrder } from "@/api/services";
import { Button } from "../ui/button";
import Link from "next/link";

export const paymentMethodOptions = [
  { id: 1, name: "Cash" },
  { id: 2, name: "Card" },
  { id: 3, name: "Monthly Mandate" },
  { id: 4, name: "Credit Card" },
] as const;

const normalizePaymentMethod = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/\s+/g, "_") // replace spaces with _
    .replace(/[()]/g, ""); // ← REMOVE PARENTHESIS
};

type UserStatus =
  | "booked"
  | "pending"
  | "reserved"
  | "paid"
  | "failed"
  | "refunded"
  | "expired"
  | "cancelled";

const statusOptions: { value: UserStatus; label: string }[] = [
  { value: "booked", label: "Booked" },
  { value: "pending", label: "Pending" },
  { value: "reserved", label: "Reserved" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
  { value: "expired", label: "Expired" },
  { value: "cancelled", label: "Cancelled" },
];

const getStatusStyles = (
  status: UserStatus
): { className: string; label: string } => {
  switch (status) {
    case "booked":
      return {
        className: "bg-blue-100 text-blue-800 border border-blue-200",
        label: "Booked",
      };
    case "pending":
      return {
        className: "bg-yellow-100 text-yellow-800 border border-yellow-200",
        label: "Pending",
      };
    case "reserved":
      return {
        className: "bg-green-100 text-green-800 border border-green-200",
        label: "Reserved",
      };
    case "paid":
      return {
        className: "bg-green-100 text-green-800 border border-green-200",
        label: "Paid",
      };
    case "failed":
      return {
        className: "bg-red-100 text-red-800 border border-red-200",
        label: "Failed",
      };
    case "refunded":
      return {
        className: "bg-orange-100 text-orange-800 border border-orange-200",
        label: "Refunded",
      };
    case "expired":
      return {
        className: "bg-gray-100 text-gray-800 border border-gray-200",
        label: "Expired",
      };
    case "cancelled":
      return {
        className: "bg-gray-100 text-gray-800 border border-gray-200",
        label: "Cancelled",
      };
    default:
      return {
        className: "bg-gray-100 text-gray-800 border border-gray-200",
        label: status,
      };
  }
};

const StatusBadge: React.FC<{ status: UserStatus }> = ({ status }) => {
  const statusConfig = getStatusStyles(status);
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}
    >
      {statusConfig.label}
    </span>
  );
};

interface PackageUserTableProps {
  users: Array<{
    id: string;
    userId: string;
    _id: string;
    name: string;
    email: string;
    phone: string;
    level: string;
    ageGroup: string;
    avatar: string;
    price: string;
    status: UserStatus;
    profileName: string;
    basePrice: string;
    paymentMethod: string;
  }>;
  onEdit: (id: string) => void;
  disabled: boolean;
  onUserUpdate?: (
    id: string,
    updates: { paymentMethod?: string; status?: UserStatus }
  ) => void;
  availablePaymentMethodOptions: { id: number; name: string }[];
}

// ---------------------------------------------------------------------
// 3. Editable cell (generic)
// ---------------------------------------------------------------------
type EditableCellProps<T extends string> = {
  value: T;
  options: { value: T; label: string }[];
  onSave: (newVal: T) => Promise<void>;
  display?: (val: T) => React.ReactNode;
  disabled?: boolean;
};

function EditableCell<T extends string>({
  value,
  options,
  onSave,
  display,
  disabled = false,
}: EditableCellProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [localVal, setLocalVal] = React.useState(value);
  const [saving, setSaving] = React.useState(false);

  // close dropdown when clicking outside
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as Element)?.closest("[data-select]")) setIsOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isOpen]);

  const handleChange = async (newVal: T) => {
    if (newVal === value) {
      setIsOpen(false);
      return;
    }
    setSaving(true);
    try {
      await onSave(newVal);
      setLocalVal(newVal);
    } finally {
      setSaving(false);
      setIsOpen(false);
    }
  };

  const rendered = display ? display(localVal) : localVal;

  if (disabled) {
    return <div className="cursor-not-allowed">{rendered}</div>;
  }

  if (!isOpen) {
    return (
      <div
        className="cursor-pointer hover:underline"
        onClick={(e) => {
          if (disabled) return;
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : rendered}
      </div>
    );
  }

  return (
    <Select
      value={localVal}
      onValueChange={(v) => handleChange(v as T)}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SelectTrigger data-select className="w-full h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const PackageUserTable: React.FC<PackageUserTableProps> = ({
  users,
  onEdit,
  disabled,
  onUserUpdate,
  availablePaymentMethodOptions,
}) => {
  console.log("disabled", disabled);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  // console.log("users", users);
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const updatePaymentMethod = async (id: string, method: string) => {
    await updateOrder(id, { paymentMethod: method });
    onUserUpdate?.(id, { paymentMethod: method });
  };

  const updateStatus = async (id: string, status: UserStatus) => {
    await updateOrder(id, { status });
    onUserUpdate?.(id, { status });
  };

  const handleViewOrder = async (userId: string) => {
    try {
      const response = await getOrdersByUserId(userId);
      console.log("Order Data:", response);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };
  
  if (users.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-gray-500">
        No users match the applied filters
      </div>
    );
  }

  return (
    <div className="w-full min-w-2xl bg-white rounded-2xl border overflow-hidden space-y-6">
      <Table>
        <TableHeader className="bg-[#7421931A]">
          <TableRow>
            <TableHead className="!min-w-[70px] font-bold px-2">Sr. No.</TableHead>
            <TableHead className="font-bold">Name</TableHead>
            <TableHead className="font-bold">Profile Name</TableHead>
            <TableHead className="font-bold">Email</TableHead>
            {/* <TableHead className="font-bold">Phone</TableHead>
            <TableHead className="font-bold">Level</TableHead>
            <TableHead className="font-bold">Age Group</TableHead> */}
            <TableHead className="font-bold">Amount</TableHead>
            <TableHead className="font-bold">Base Price</TableHead>
            <TableHead className="font-bold !min-w-[150px]">Payment Method</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="text-center font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedUsers.map((user, idx) => {
            const displayPayment = () => {
              const opt = paymentMethodOptions.find(
                (o) => normalizePaymentMethod(o.name) === user.paymentMethod
              );
              return opt?.name ?? user.paymentMethod;
            };

            return (
              <TableRow key={user._id || user.id}>
                <TableCell>
                  {(currentPage - 1) * itemsPerPage + idx + 1}
                </TableCell>

                <TableCell>
                  <Link href={`/users/${user.userId}`} >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0] || "U"}</AvatarFallback>
                    </Avatar>
                    {user.name}
                  </div>
                  </Link>
                </TableCell>

                <TableCell>{user.profileName}</TableCell>
                <TableCell>{user.email}</TableCell>
                {/* <TableCell>{user.phone}</TableCell>
                <TableCell className="capitalize">{user.level}</TableCell>
                <TableCell className="capitalize">{user.ageGroup}</TableCell> */}
                <TableCell>{user.price}</TableCell>
                <TableCell>{user.basePrice}</TableCell>

                {/* ---- PAYMENT METHOD ---- */}
                <TableCell className="text-center">
                  <EditableCell
                    value={
                      user.paymentMethod === "credit_card"
                        ? "Credit Card"
                        : user.paymentMethod
                    }
                    options={availablePaymentMethodOptions
                      .filter((o) => o.name !== "Credit Card")
                      .map((o) => ({
                        value: normalizePaymentMethod(o.name),
                        label: o.name,
                      }))}
                    onSave={(newVal) => updatePaymentMethod(user._id, newVal)}
                    display={displayPayment}
                    // disabled={disabled}
                  />
                </TableCell>

                {/* ---- STATUS ---- */}
                <TableCell>
                  <EditableCell<UserStatus>
                    value={user.status}
                    options={statusOptions}
                    onSave={(newVal) => updateStatus(user._id, newVal)}
                    display={(val) => <StatusBadge status={val} />}
                    // disabled={disabled}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewOrder(user.userId)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        {/* <TableBody>
          {paginatedUsers.map((user, idx) => (
            <TableRow key={user._id || user.id}>
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
              <TableCell>{user.profileName}</TableCell>
               <TableCell>{user.email}</TableCell> 
              <TableCell>{user.phone}</TableCell>
              <TableCell className="capitalize">{user.level}</TableCell>
              <TableCell className="capitalize">{user.ageGroup}</TableCell>
              <TableCell>{user.price}</TableCell>
              <TableCell>{user.basePrice}</TableCell>
              <TableCell>{user.paymentMethod =="credit_card" ? "Credit Card" : user.paymentMethod}</TableCell>
              <TableCell>
                <StatusBadge status={user.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(user._id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(user._id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody> */}
      </Table>
      <Pagination className="mt-4">
        <PaginationPrevious
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        />
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
        <PaginationNext
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        />
      </Pagination>
    </div>
  );
};

export default PackageUserTable;
