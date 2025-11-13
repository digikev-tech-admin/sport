"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Users,
  MessageSquare,
  Link as LinkIcon,
} from "lucide-react";
import { getAllUsers } from "@/api/user/user";
import { getNotificationById } from "@/api/notification";
import toast from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  isActive: boolean;
}

type DeliveryMethod = "app" | "email" | "sms";

interface Notification {
  _id: string;
  title: string;
  message: string;
  notificationType: "system" | "reminder" | "marketing";
  userIds: string[];
  link?: string;
  createdAt: string;
  deliveryMethod: DeliveryMethod[] | DeliveryMethod;
}

const NotificationPage = ({ id }: { id: string }) => {
  const router = useRouter();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [recipients, setRecipients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  //   "userIds": [
  //     {
  //         "_id": "6855739e620d6f6f79f1c1dc",
  //         "email": "jeneesh@gmail.com",
  //         "name": "Jeneesh",
  //         "id": "6855739e620d6f6f79f1c1dc"
  //     },
  //     {
  //         "_id": "685959848acc388ca78789a5",
  //         "email": "jeneeshsurani@gmail.com",
  //         "name": "Jeneesh Surani",
  //         "id": "685959848acc388ca78789a5"
  //     }
  // ],

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch notification details
        const notificationData = await getNotificationById(id);

        const formattedNotificationData = {
          ...notificationData,
          userIds: notificationData?.userIds?.map((user: any) => ({
            _id: user?._id,
          })),
        };

        // console.log({ formattedNotificationData });
        setNotification(formattedNotificationData);

        // Fetch all users to get recipient details
        const usersData = await getAllUsers();
        // setUsers(usersData?.data || []);

        // Find recipients based on userIds
        const recipientUsers =
          usersData?.data?.filter((user: User) =>
            notificationData?.userIds?.some(
              (recipient: any) => recipient._id === user._id
            )
          ) || [];
        setRecipients(recipientUsers);
      } catch (error) {
        console.error("Error fetching notification details:", error);
        toast.error("Failed to load notification details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "system":
        return "bg-blue-100 text-blue-800";
      case "reminder":
        return "bg-orange-100 text-orange-800";
      case "marketing":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case "system":
        return "🔧";
      case "reminder":
        return "⏰";
      case "marketing":
        return "📢";
      default:
        return "📋";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notification details...</p>
        </div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Notification not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notification Details Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  Notification Information
                </CardTitle>
                <Badge
                  className={getNotificationTypeColor(
                    notification.notificationType
                  )}
                >
                  <span className="mr-1">
                    {getNotificationTypeIcon(notification.notificationType)}
                  </span>
                  {notification.notificationType}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Title</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {notification.title}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Message</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                  <div dangerouslySetInnerHTML={{ __html: notification.message }} />
                </p>
              </div>

              {notification.link && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Link
                  </h3>
                  <a
                    href={notification.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {notification.link}
                  </a>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  Created:{" "}
                  {new Date(notification.createdAt).toLocaleDateString("en-GB")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recipients Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Recipients ({recipients.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recipients.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No recipients found
                </p>
              ) : (
                <div className="space-y-3">
                  {recipients.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {user.name}
                        </h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.phone}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          variant={user.isActive ? "default" : "secondary"}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-gray-600">Method:</span>
                <span className="text-sm font-semibold">
                  {Array.isArray(notification?.deliveryMethod)
                    ? (notification?.deliveryMethod as DeliveryMethod[])
                        .map((method) => {
                          switch (method) {
                            case "app":
                              return "App";
                            case "email":
                              return "Email";
                            case "sms":
                              return "SMS";
                            default:
                              return method;
                          }
                        })
                        .join(", ")
                    : notification?.deliveryMethod === "app"
                    ? "App"
                    : notification?.deliveryMethod === "email"
                    ? "Email"
                    : notification?.deliveryMethod === "sms"
                    ? "SMS"
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Type:</span>
                <Badge
                  className={getNotificationTypeColor(
                    notification.notificationType
                  )}
                >
                  {notification.notificationType}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Recipients:</span>
                <span className="font-semibold">{recipients.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Created:</span>
                <span className="text-sm">
                  {new Date(notification.createdAt).toLocaleDateString("en-GB")}
                </span>
              </div>
              {notification.link && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Has Link:</span>
                  <Badge variant="outline" className="text-green-600">
                    Yes
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push(`/notifications/edit/${notification._id}`)}
              >
                Edit Notification
              </Button> */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Copy notification details to clipboard
                  const details = `Title: ${notification.title}\nMessage: ${notification.message}\nType: ${notification.notificationType}\nRecipients: ${recipients.length}`;
                  navigator.clipboard.writeText(details);
                  toast.success("Notification details copied to clipboard");
                }}
              >
                Copy Notification Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
