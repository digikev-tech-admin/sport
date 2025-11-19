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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatDate,
  formatNumber,
  getStatusStyles,
  normalizePaymentMethod,
  OrderDetail,
  paymentMethodOptions1,
  statusOptions,
  UserStatus,
} from "@/data/constants";
import Loader from "../shared/Loader";

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
  const [orderModalOpen, setOrderModalOpen] = React.useState(false);
  const [orderModalLoading, setOrderModalLoading] = React.useState(false);
  const [orderModalError, setOrderModalError] = React.useState<string | null>(
    null
  );
  const [orderDetails, setOrderDetails] = React.useState<OrderDetail[]>([]);
  const [selectedUserInfo, setSelectedUserInfo] = React.useState<{
    name: string;
    email: string;
    profileName: string;
  } | null>(null);

  const updatePaymentMethod = async (id: string, method: string) => {
    await updateOrder(id, { paymentMethod: method });
    onUserUpdate?.(id, { paymentMethod: method });
  };

  const updateStatus = async (id: string, status: UserStatus) => {
    await updateOrder(id, { status });
    onUserUpdate?.(id, { status });
  };

  const handleViewOrder = async (
    user: PackageUserTableProps["users"][number]
  ) => {
    setOrderModalOpen(true);
    setOrderModalLoading(true);
    setOrderModalError(null);
    setSelectedUserInfo({
      name: user.name,
      email: user.email,
      profileName: user.profileName,
    });

    try {
      const response = await getOrdersByUserId(user.userId);
      console.log("response", response);
      setOrderDetails(response ?? []);
    } catch (error) {
      setOrderDetails([]);
      setOrderModalError(
        typeof error === "string"
          ? error
          : "Failed to fetch order details. Please try again."
      );
    } finally {
      setOrderModalLoading(false);
    }
  };

  const handleModalChange = (open: boolean) => {
    setOrderModalOpen(open);
    if (!open) {
      setOrderModalError(null);
      setOrderDetails([]);
      setSelectedUserInfo(null);
      setOrderModalLoading(false);
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
            <TableHead className="!min-w-[70px] font-bold px-2">
              Sr. No.
            </TableHead>
            <TableHead className="font-bold">Name</TableHead>
            <TableHead className="font-bold">Profile Name</TableHead>
            <TableHead className="font-bold">Email</TableHead>
            {/* <TableHead className="font-bold">Phone</TableHead>
            <TableHead className="font-bold">Level</TableHead>
            <TableHead className="font-bold">Age Group</TableHead> */}
            <TableHead className="font-bold">Amount</TableHead>
            <TableHead className="font-bold">Base Price</TableHead>
            <TableHead className="font-bold !min-w-[150px]">
              Payment Method
            </TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="text-center font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedUsers.map((user, idx) => {
            const displayPayment = () => {
              const opt = paymentMethodOptions1.find(
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
                  <Link href={`/users/${user.userId}`}>
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
                    type="button"
                    onClick={() => handleViewOrder(user)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
       
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
      <Dialog open={orderModalOpen} onOpenChange={handleModalChange}>
        <DialogContent className="!max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order details</DialogTitle>
            <DialogDescription>
              {selectedUserInfo ? (
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-gray-900">
                    {selectedUserInfo.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {selectedUserInfo.email} • {selectedUserInfo.profileName}
                  </span>
                </div>
              ) : (
                "Detailed order lifecycle and invoices"
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {orderModalLoading && (
             <Loader />
            )}
            {orderModalError && !orderModalLoading && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {orderModalError}
              </div>
            )}
            {!orderModalLoading &&
              !orderModalError &&
              (orderDetails.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No orders found for this user.
                </div>
              ) : (
                orderDetails.map((order, index) => (
                  <div
                    key={order._id}
                    className={`space-y-4 rounded-2xl border p-4 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="p-2 bg-green-100 rounded-full text-center w-8 h-8 flex items-center justify-center">
                            {index + 1}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            Order UUID
                          </p>
                          <p className="font-semibold">{order.orderUuid}</p>
                          <p className="text-xs text-gray-500">
                            Created: {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      {order.status && (
                        <StatusBadge status={order.status as UserStatus} />
                      )}
                    </div>

                    <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <p className="text-xs uppercase text-gray-500">
                          {" "}
                          Total Amount Paid (Platform Fee + Cost + Discount)
                        </p>
                        <p className="font-medium">
                          {formatNumber(order.amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-gray-500"> Cost</p>
                        <p className="font-medium">
                          {formatNumber(order.cost)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-gray-500">Taxes</p>
                        <p className="font-medium">
                          {formatNumber(order.taxes)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-gray-500">
                          Platform Fee
                        </p>
                        <p className="font-medium">
                          {formatNumber(order.platformFee)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-gray-500">
                          Payment Method
                        </p>
                        <p className="font-medium capitalize">
                          {order.paymentMethod ?? "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-gray-500">
                          Stripe Status
                        </p>
                        <p className="font-medium capitalize">
                          {order.stripePaymentStatus ?? "N/A"}
                        </p>
                      </div>
                      {order.isRecurring && (
                        <>
                          <div>
                            <p className="text-xs uppercase text-gray-500">
                              Mandate Type
                            </p>
                            <p className="font-medium capitalize">
                              {order.mandateType ?? "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase text-gray-500">
                              Recurring Amount
                            </p>
                            <p className="font-medium">
                              {formatNumber(order.recurringAmount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase text-gray-500">
                              Next Payment Date
                            </p>
                            <p className="font-medium">
                              {formatDate(order.nextPaymentDate)}
                            </p>
                          </div>
                        </>
                      )}
                      <div>
                        <p className="text-xs uppercase text-gray-500">
                          Booked Until
                        </p>
                        <p className="font-medium">
                          {formatDate(order.bookedUntil)}
                        </p>
                      </div>
                    </div>

                    {order.packageId && (
                      <div className="rounded-xl bg-gray-50 p-3 text-sm">
                        <p className="text-xs uppercase text-gray-500">
                          Package details
                        </p>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          <div>
                            <p className="text-xs text-gray-500">Title</p>
                            <p className="font-medium">
                              {order.packageId.title ?? "-"}
                            </p>
                          </div>
                          {/* <div>
                            <p className="text-xs text-gray-500">Age group</p>
                            <p className="font-medium">
                              {order.packageId.ageGroup ?? "-"}
                            </p>
                          </div> */}
                          {/* <div>
                            <p className="text-xs text-gray-500">Level</p>
                            <p className="font-medium">
                              {order.packageId.level ?? "-"}
                            </p>
                          </div> */}
                          <div>
                            <p className="text-xs text-gray-500">Base Price</p>
                            <p className="font-medium">
                              {formatNumber(order.packageId.price?.base)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Tax</p>
                            <p className="font-medium">
                              {formatNumber(order.packageId.price?.tax)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Discount</p>
                            <p className="font-medium">
                              {formatNumber(order.packageId.price?.discount)}
                            </p>
                          </div>
                        </div>
                        {/* {order.packageId.description && (
                          <p className="mt-2 text-xs text-gray-500">
                            {order.packageId.description}
                          </p>
                        )} */}
                      </div>
                    )}
                    {order.profileId && (
                      <div className="rounded-xl bg-gray-50 p-3 text-sm">
                        <p className="text-xs uppercase text-gray-500">
                          Profile details
                        </p>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          <div>
                            <p className="text-xs text-gray-500">name</p>
                            <p className="font-medium">
                              {order.profileId.name ?? "-"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">relation</p>
                            <p className="font-medium">
                              {order.profileId.relation ?? "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {order.eventId && (
                      <div className="rounded-xl bg-gray-50 p-3 text-sm">
                        <p className="text-xs uppercase text-gray-500">
                          Event details
                        </p>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          <div>
                            <p className="text-xs text-gray-500">Title</p>
                            <p className="font-medium">
                              {order.eventId.title ?? "-"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">Ticket Cost</p>
                            <p className="font-medium">
                              {formatNumber(order.eventId.ticketCost)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* {order.paymentDetails && (
                      <div className="rounded-xl border border-dashed p-3 text-sm">
                        <p className="text-xs uppercase text-gray-500">
                          Payment details
                        </p>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          {Object.entries(order.paymentDetails).map(
                            ([key, value]) => (
                              <div key={key}>
                                <p className="text-[11px] uppercase text-gray-500">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </p>
                                <p className="font-medium text-gray-900">
                                  {value ?? "-"}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )} */}

                    {order.invoiceHistory?.length ? (
                      <div className="space-y-2">
                        <p className="text-xs uppercase text-gray-500">
                          Invoice history
                        </p>
                        <div className="space-y-2">
                          {order.invoiceHistory.map((invoice) => (
                            <div
                              key={invoice._id}
                              className="rounded-xl bg-gray-50 p-3 text-xs"
                            >
                              <p className="font-medium text-gray-900">
                                {invoice.message}
                              </p>
                              <div className="mt-1 flex flex-wrap gap-4 text-gray-600">
                                {invoice.transactionId && (
                                  <span>
                                    Txn:{" "}
                                    <span className="font-semibold text-gray-800">
                                      {invoice.transactionId}
                                    </span>
                                  </span>
                                )}
                                {invoice.paymentMethodAtSend && (
                                  <span>
                                    Method: {invoice.paymentMethodAtSend}
                                  </span>
                                )}
                                {invoice.collectionMethod && (
                                  <span>
                                    Collection: {invoice.collectionMethod}
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-[11px] text-gray-500">
                                {formatDate(invoice.createdAt)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackageUserTable;
