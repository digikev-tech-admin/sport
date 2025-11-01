"use client";
{
  /* <div dangerouslySetInnerHTML={{ __html: notification.message }} /> */
}
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCcw, Send } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getAllUsers } from "@/api/user/user";
import {
  createNotification,
  getUsersByCoachId,
  getUsersByEventId,
  getUsersByLocationId,
  getUsersByPackageId,
} from "@/api/notification";
import RichTextEditor from "../ui/rich-text-editor";
import { getAllCoaches } from "@/api/coach";
import { getAllPackages } from "@/api/package";
import { getAllEvents } from "@/api/event";
// import { getAllLocations } from "@/api/location";
import CategoryFilter from "../NewFilterForNotification";

interface User {
  _id: string;
  name: string;
  email: string;
  fcmToken: string | null;
}

interface NotificationFormData {
  title: string;
  message: string;
  notificationType: "system" | "reminder" | "marketing";
  userIds: string[];
  frequency?: string;
  startDateTime?: string;
  expireDateTime?: string;
  deliveryMethod: "app" | "email" | "both";
  //   link?: string;
  //   metadata: Record<string, any>;
}

const NotificationForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userFcmTokens, setUserFcmTokens] = useState<string[]>([]);
  const [coaches, setCoaches] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [packages, setPackages] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [events, setEvents] = useState<Array<{ id: string; title: string }>>(
    []
  );
  const [locations, setLocations] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [selectedPackages, setSelectedPackages] = useState("all");
  const [selectedCoaches, setSelectedCoaches] = useState("all");
  const [selectedEvents, setSelectedEvents] = useState("all");
  const [selectedLocations, setSelectedLocations] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);

  // Handle filter changes and make API calls
  useEffect(() => {
    const handleFilterChange = async () => {
      try {
        let extractedUsers: User[] = [];
        let hasActiveFilter = false;

        // Handle Packages filter
        if (selectedPackages !== "all") {
          console.log("=== PACKAGES FILTER ===");
          console.log("Selected Package ID:", selectedPackages);
          const packageUsers = await getUsersByPackageId(selectedPackages);
          console.log("Package Users Response:", packageUsers);

          // Extract users from package response
          if (packageUsers && packageUsers.length > 0) {
            const users = packageUsers.map((item: any) => ({
              _id: item.userId._id,
              name: item.userId.name,
              email: item.userId.email,
              fcmToken: item.userId.fcmToken,
            }));
            extractedUsers = [...extractedUsers, ...users];
            hasActiveFilter = true;
          }
        }

        // Handle Coaches filter
        if (selectedCoaches !== "all") {
          console.log("=== COACHES FILTER ===");
          console.log("Selected Coach ID:", selectedCoaches);
          const coachUsers = await getUsersByCoachId(selectedCoaches);
          console.log("Coach Users Response:", coachUsers);

          // Extract users from coach response
          if (coachUsers && coachUsers.length > 0) {
            const users = coachUsers.map((item: any) => ({
              _id: item.userId._id,
              name: item.userId.name,
              email: item.userId.email,
              fcmToken: item.userId.fcmToken,
            }));
            extractedUsers = [...extractedUsers, ...users];
            hasActiveFilter = true;
          }
        }

        // Handle Events filter
        if (selectedEvents !== "all") {
          console.log("=== EVENTS FILTER ===");
          console.log("Selected Event ID:", selectedEvents);
          const eventUsers = await getUsersByEventId(selectedEvents);
          console.log("Event Users Response:", eventUsers);

          // Extract users from event response
          if (eventUsers && eventUsers.length > 0) {
            const users = eventUsers.map((item: any) => ({
              _id: item.userId._id,
              name: item.userId.name,
              email: item.userId.email,
              fcmToken: item.userId.fcmToken,
            }));
            extractedUsers = [...extractedUsers, ...users];
            hasActiveFilter = true;
          }
        }

        // Handle Locations filter
        if (selectedLocations !== "all") {
          console.log("=== LOCATIONS FILTER ===");
          console.log("Selected Location ID:", selectedLocations);
          const locationUsers = await getUsersByLocationId(selectedLocations);
          console.log("Location Users Response:", locationUsers);

          // Extract users from location response
          if (locationUsers) {
            // Handle both single user object and array of users
            const usersArray = Array.isArray(locationUsers) ? locationUsers : [locationUsers];
            
            if (usersArray.length > 0) {
              const users = usersArray.map((item: any) => ({
                _id: item._id,
                name: item.name,
                email: item.email,
                fcmToken: item.fcmToken,
              }));
              console.log({users});
              extractedUsers = [...extractedUsers, ...users];
              hasActiveFilter = true;
            }
          }
        }

        // Remove duplicate users based on _id
        const uniqueUsers = extractedUsers.filter(
          (user, index, self) =>
            index === self.findIndex((u) => u._id === user._id)
        );

        setFilteredUsers(uniqueUsers);
        setIsFiltered(hasActiveFilter);

        console.log("=== EXTRACTED USERS ===");
        console.log("Total unique users:", uniqueUsers.length);
        console.log("Users:", uniqueUsers);
      } catch (error) {
        console.error("Error fetching filtered users:", error);
        setFilteredUsers([]);
        setIsFiltered(false);
      }
    };

    handleFilterChange();
  }, [selectedPackages, selectedCoaches, selectedEvents, selectedLocations]);

  const [formData, setFormData] = useState<NotificationFormData>({
    title: "",
    message: "",
    notificationType: "system",
    userIds: [],
    frequency: "",
    startDateTime: "",
    expireDateTime: "",
    deliveryMethod: "app",
    // link: '',
    // metadata: {}
  });

  // Fetch users for selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Replace with your actual API call
        const usersData = await getAllUsers();
        // console.log({ usersData });
        setUsers(usersData?.data);
        const coachesData = await getAllCoaches();
        const formattedCoaches = coachesData?.map((coach: any) => ({
          id: coach._id,
          name: coach.name,
        }));
        setCoaches(formattedCoaches);
        const packagesData = await getAllPackages();
        const formattedPackages = packagesData?.map((item: any) => ({
          id: item?._id,
          title: item?.title,
        }));
        setPackages(formattedPackages);
        const eventsData = await getAllEvents();
        const formattedEvents = eventsData.map((event: any) => ({
          id: event?._id,
          title: event?.title,
        }));
        setEvents(formattedEvents);
        // const locationsData = await getAllLocations();
        const locationsData1= await getAllUsers();
        // filter the locations data by the locationsData1 where userLocation is not null
        const filterData = locationsData1?.data?.filter((item: any) => item.userLocation !== null);
        const formattedLocations = filterData.map((item: any) => ({
          id: item.id,
          title: item?.userLocation?.city          ,
        }));
        console.log({filterData});
        console.log({formattedLocations});
        setLocations(formattedLocations);
        // console.log({locationsData1});
        // const formattedLocations = locationsData?.map((item: any) => ({
        //   id: item?._id,
        //   title: item?.title,
        // }));
        // setLocations(formattedLocations);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.message.trim() ||
      selectedUsers.length === 0
    ) {
      toast.error(
        `Please fill all required fields and select at least one user`
      );
      return;
    }

    // Validate delivery method
    if (!formData.deliveryMethod) {
      toast.error("Please select a delivery method");
      return;
    }

    // Validate reminder-specific fields
    if (formData.notificationType === "reminder") {
      if (!formData.frequency?.trim() || !formData.startDateTime?.trim() || !formData.expireDateTime?.trim()) {
        toast.error(
          "Please fill in frequency, start date/time, and expire date/time for reminder notifications"
        );
        return;
      }
      
      // Validate that expire date is after start date
      if (formData.startDateTime && formData.expireDateTime) {
        const startDate = new Date(formData.startDateTime);
        const expireDate = new Date(formData.expireDateTime);
        if (expireDate <= startDate) {
          toast.error("Expire date/time must be after start date/time");
          return;
        }
      }
    }

    // Check if selected users have FCM tokens
    const usersWithTokens = selectedUsers.filter((userId) => {
      const user = users.find((u) => u._id === userId);
      return user && user.fcmToken;
    });

    if (usersWithTokens.length === 0) {
      toast.error(
        "Selected users do not have notification tokens. They may not have enabled notifications."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Filter out empty fields from formData
      const filteredFormData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => {
          // Keep required fields and non-empty values
          if (
            key === "title" ||
            key === "message" ||
            key === "notificationType" ||
            key === "userIds" ||
            key === "deliveryMethod"
          ) {
            return true;
          }
            // For optional fields, only include if they have meaningful values
            if (key === "frequency" || key === "startDateTime" || key === "expireDateTime") {
              return value && value.trim() !== "";
            }
          return false;
        })
      );

      const submitData = {
        ...filteredFormData,
        userIds: selectedUsers,
        userFcmTokens: userFcmTokens.filter(
          (token) => token !== null && token !== ""
        ),
      };

      const response = await createNotification(submitData);
      if (response) {
        toast.success("Notification sent successfully");
        setSelectedUsers([]);
        setUserFcmTokens([]);
        //   router.push('/notifications');
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserToggle = (userId: string, fcmToken: string | null) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
    setUserFcmTokens((prev) =>
      prev.includes(fcmToken || "")
        ? prev.filter((token) => token !== (fcmToken || ""))
        : fcmToken
        ? [...prev, fcmToken]
        : prev
    );
  };

  const handleSelectAllUsers = () => {
    // const usersWithTokens = users.filter((user) => user.fcmToken );
    setSelectedUsers(users.map((user) => user._id));
    setUserFcmTokens(
      users
        .map((user) => user.fcmToken!)
        .filter((token) => token !== null && token !== "")
    );
  };

  const handleDeselectAllUsers = () => {
    setSelectedUsers([]);
    setUserFcmTokens([]);
  };

  // Get users with valid FCM tokens
  const displayUsers = isFiltered ? filteredUsers : users;
  const usersWithTokens = displayUsers.filter((user) => user.fcmToken);
  const usersWithoutTokens = displayUsers.filter((user) => !user.fcmToken);

  return (
    <div className="flex items-center justify-center py-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl bg-white rounded-xl border p-2 sm:p-4 xl:p-8 space-y-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Notification Title
          </label>
          <Input
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Enter notification title"
            required
            maxLength={100}
          />
          {formData.title.length > 0 && (
            <p className="text-xs text-gray-500">
              {formData.title.length}/100 characters
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Message</label>
          <RichTextEditor
            value={formData.message || ""}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, message: value }))
            }
            placeholder="Write your notification message here..."
            height={400}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Notification Type
            </label>
            <Select
              value={formData.notificationType}
              onValueChange={(value: "system" | "reminder" | "marketing") =>
                setFormData((prev) => ({ ...prev, notificationType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select notification type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                {/* <SelectItem value="marketing">Marketing</SelectItem> */}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Delivery Method
            </label>
            <Select
              value={formData.deliveryMethod}
              onValueChange={(value: "app" | "email" | "both") =>
                setFormData((prev) => ({ ...prev, deliveryMethod: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select delivery method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="app">App Only</SelectItem>
                <SelectItem value="email">Email Only</SelectItem>
                <SelectItem value="both">Both App & Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Conditional fields for Reminder notification type */}
        {formData.notificationType === "reminder" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Frequency
              </label>
              <Select
                value={formData.frequency}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, frequency: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Start Date & Time
              </label>
              <Input
                type="datetime-local"
                value={formData.startDateTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDateTime: e.target.value,
                  }))
                }
                required
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Expire Date & Time
              </label>
              <Input
                type="datetime-local"
                value={formData.expireDateTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    expireDateTime: e.target.value,
                  }))
                }
                required
                min={formData.startDateTime || new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>
          </div>
        )}

        <div className="space-y-4">
                      {/* Action Buttons - Responsive */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-between  mb-5">
              <div>
                <label htmlFor="" className="text-sm font-bold text-gray-700">
                Filter by:{" "}
                  {isFiltered && `(Filtered: ${filteredUsers.length} users)`}
                </label>
                {isFiltered && (
                  <p className="text-xs text-blue-600 mt-1">
                    Showing users from selected filters. Clear filters to see
                    all users.
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                {isFiltered && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPackages("all");
                      setSelectedCoaches("all");
                      setSelectedEvents("all");
                      setSelectedLocations("all");
                      setFilteredUsers([]);
                      setIsFiltered(false);
                    }}
                    className="text-xs bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 transition-all duration-300 w-full sm:w-auto"
                  >
                    Clear Filters
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllUsers}
                  className="text-xs commonDarkBG text-white hover:bg-[#581770] hover:text-white transition-all duration-300 w-full sm:w-auto"
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDeselectAllUsers}
                  className="text-xs commonDarkBG text-white hover:bg-[#581770] hover:text-white transition-all duration-300 w-full sm:w-auto"
                >
                  Deselect All
                </Button>
              </div>
            </div>
          <div className="space-y-4">
            {/* Responsive Filter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <div className="w-full">
                <CategoryFilter
                  title="Packages"
                  value={selectedPackages}
                  onChange={setSelectedPackages}
                  subscriptionOptions={packages}
                />
              </div>
              <div className="w-full">
                <CategoryFilter
                  title="Coaches"
                  value={selectedCoaches}
                  onChange={setSelectedCoaches}
                  subscriptionOptions={coaches}
                />
              </div>
              <div className="w-full">
                <CategoryFilter
                  title="Events"
                  value={selectedEvents}
                  onChange={setSelectedEvents}
                  subscriptionOptions={events}
                />
              </div>
              <div className="w-full">
                <CategoryFilter
                  title="Locations"
                  value={selectedLocations}
                  onChange={setSelectedLocations}
                  subscriptionOptions={locations}
                />
              </div>
            </div>


          </div>

          <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
            {displayUsers?.length === 0 ? (
              <p className="text-gray-500 text-sm">
                {isFiltered
                  ? "No users found for selected filters"
                  : "Loading users..."}
              </p>
            ) : (
              <div className="space-y-4">
                {/* Users with FCM tokens */}
                {usersWithTokens.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-green-600 mb-2">
                      Users with notifications enabled ({usersWithTokens.length}
                      )
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {usersWithTokens.map((user) => (
                        <label
                          key={user._id}
                          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer border border-green-200 bg-green-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() =>
                              handleUserToggle(user._id, user.fcmToken)
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Users without FCM tokens */}
                {usersWithoutTokens.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-orange-600 mb-2">
                      Users without notifications enabled (
                      {usersWithoutTokens.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {usersWithoutTokens.map((user) => (
                        <label
                          key={user._id}
                          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer border border-orange-600 bg-orange-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() =>
                              handleUserToggle(user._id, user.fcmToken)
                            }
                            className="rounded border-gray-300 text-gray-400 focus:ring-gray-500"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {user.email}
                            </p>
                            {/* <p className="text-xs text-orange-600">This user does not have notifications enabled</p> */}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedUsers.length > 0 && (
            <p className="text-sm text-gray-600">
              Selected {selectedUsers.length} user
              {selectedUsers.length !== 1 ? "s" : ""} with notification tokens
            </p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="flex-1 commonDarkBG text-white hover:bg-[#581770] transition-all duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <RefreshCcw className="animate-spin" size={18} />
                <span>Sending...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send size={18} />
                <span>Send Notification</span>
              </div>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 hover:bg-orange-50 border-orange-200 text-orange-500 transition-all duration-300"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NotificationForm;
