"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCcw, Send } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getAllUsers } from '@/api/user/user';
import { createNotification } from '@/api/notification';

interface User {
  _id: string;
  name: string;
  email: string;
  fcmToken: string | null;
}

interface NotificationFormData {
  title: string;
  message: string;
  notificationType: 'system' | 'reminder' | 'marketing';
  userIds: string[];
  //   link?: string;
  //   metadata: Record<string, any>;
}

const NotificationForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userFcmTokens, setUserFcmTokens] = useState<string[]>([]);

  const [formData, setFormData] = useState<NotificationFormData>({
    title: '',
    message: '',
    notificationType: 'system',
    userIds: [],
    // link: '',
    // metadata: {}
  });

  // Fetch users for selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Replace with your actual API call
        const usersData = await getAllUsers();
        console.log({ usersData });
        setUsers(usersData?.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  // Fetch notification data if editing
  //   useEffect(() => {
  //     if (id) {
  //       const fetchNotification = async () => {
  //         try {
  //           // Replace with your actual API call
  //           const response = await fetch(`/api/notifications/${id}`);
  //           const notificationData = await response.json();
  //           setFormData({
  //             title: notificationData.title,
  //             message: notificationData.message,
  //             notificationType: notificationData.notificationType,
  //             userIds: notificationData.userIds,
  //             link: notificationData.link || '',
  //             // metadata: notificationData.metadata || {}
  //           });
  //           setSelectedUsers(notificationData.userIds);
  //         } catch (error) {
  //           console.error('Error fetching notification:', error);
  //           toast.error('Failed to fetch notification data');
  //         }
  //       };
  //       fetchNotification();
  //     }
  //   }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim() || selectedUsers.length === 0) {
      toast.error(`Please fill all required fields and select at least one user`);
      return;
    }

    // Check if selected users have FCM tokens
    const usersWithTokens = selectedUsers.filter(userId => {
      const user = users.find(u => u._id === userId);
      return user && user.fcmToken;
    });

    if (usersWithTokens.length === 0) {
      toast.error('Selected users do not have notification tokens. They may not have enabled notifications.');
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        userIds: selectedUsers,
        "userFcmTokens": userFcmTokens.filter(token => token !== null && token !== '')
      };

      const response = await createNotification(submitData);
      if (response) {
        toast.success('Notification sent successfully');
        setSelectedUsers([]);
        setUserFcmTokens([]);
        //   router.push('/notifications');
      }

    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserToggle = (userId: string, fcmToken: string | null) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
    setUserFcmTokens(prev =>
      prev.includes(fcmToken || '')
        ? prev.filter(token => token !== (fcmToken || ''))
        : fcmToken ? [...prev, fcmToken] : prev
    );
  };

  const handleSelectAllUsers = () => {
    const usersWithTokens = users.filter(user => user.fcmToken);
    setSelectedUsers(usersWithTokens.map(user => user._id));
    setUserFcmTokens(usersWithTokens.map(user => user.fcmToken!).filter(token => token !== null && token !== ''));
  };

  const handleDeselectAllUsers = () => {
    setSelectedUsers([]);
    setUserFcmTokens([]);
  };

  // Get users with valid FCM tokens
  const usersWithTokens = users.filter(user => user.fcmToken);
  const usersWithoutTokens = users.filter(user => !user.fcmToken);

  return (
    <div className="flex items-center justify-center py-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white rounded-xl border p-2 sm:p-8 space-y-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Notification Title</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
          <Textarea
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Enter notification message"
            rows={4}
            required
            maxLength={500}
          />
          {formData.message.length > 0 && (
            <p className="text-xs text-gray-500">
              {formData.message.length}/500 characters
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Notification Type</label>
            <Select
              value={formData.notificationType}
              onValueChange={(value: 'system' | 'reminder' | 'marketing') =>
                setFormData(prev => ({ ...prev, notificationType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select notification type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Link (Optional)</label>
            <Input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
              placeholder="https://example.com"
            />
          </div> */}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700">Recipients</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSelectAllUsers}
                className="text-xs commonDarkBG text-white hover:bg-[#581770] hover:text-white transition-all duration-300"
              >
                Select All (with tokens)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDeselectAllUsers}
                className="text-xs commonDarkBG text-white hover:bg-[#581770] hover:text-white transition-all duration-300"
              >
                Deselect All
              </Button>
            </div>
          </div>

          <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
            {users?.length === 0 ? (
              <p className="text-gray-500 text-sm">Loading users...</p>
            ) : (
              <div className="space-y-4">
                {/* Users with FCM tokens */}
                {usersWithTokens.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-green-600 mb-2">Users with notifications enabled ({usersWithTokens.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {usersWithTokens.map((user) => (
                        <label
                          key={user._id}
                          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer border border-green-200 bg-green-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => handleUserToggle(user._id, user.fcmToken)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Users without FCM tokens */}
                {usersWithoutTokens.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-orange-600 mb-2">Users without notifications ({usersWithoutTokens.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {usersWithoutTokens.map((user) => (
                        <label
                          key={user._id}
                          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-not-allowed border border-orange-200 bg-orange-50 opacity-60"
                        >
                          <input
                            type="checkbox"
                            disabled
                            className="rounded border-gray-300 text-gray-400 focus:ring-gray-500"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                            <p className="text-xs text-orange-600">You can&apos;t send notification to this user</p>
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
              Selected {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} with notification tokens
            </p>
          )}
        </div>

        {/* <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Additional Metadata (Optional)</label>
          <Textarea
            value={JSON.stringify(formData.metadata, null, 2)}
            onChange={(e) => {
              try {
                const metadata = JSON.parse(e.target.value);
                setFormData(prev => ({ ...prev, metadata }));
              } catch (error) {
                // Allow invalid JSON while typing
              }
            }}
            placeholder='{"key": "value"}'
            rows={3}
            className="font-mono text-sm"
          />
          <p className="text-xs text-gray-500">
            Enter valid JSON for additional metadata
          </p>
        </div> */}

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