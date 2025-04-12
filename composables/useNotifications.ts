import { useToast } from "#imports";

export function useNotification() {
  const toast = useToast();

  const isEditingNotification = useState<boolean>(
    "is-editing-notification",
    () => false
  );

  const notifications = ref([]);

  const notificationsFormState = useState("notification-formstate", () => ({
    user_id: "",
    message: "",
    status: "",
    type: "",
    is_read: false,
    date: "",
  }));

  const getAllNotifications = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/notifications");
      notifications.value = response.data;

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch notification.",
          color: "red",
        });
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error in getAllNotifications:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch notification.",
        color: "red",
      });
      throw error;
    }
  };

  const getAllUserNotifications = async (userId: string) => {
    try {
      if (!userId) {
        toast.add({
          title: "Error",
          description: "User ID is required to fetch notifications.",
          color: "red",
        });
        return null;
      }

      const response = await $fetch<IApiResponse>(
        "/api/notifications/user",
        {
          query: { user_id: userId },
        }
      );

      if (!response?.success || !response?.data) {
        toast.add({
          title: "Error",
          description: response?.message || "Failed to fetch notifications.",
          color: "red",
        });
        return null;
      }

      notifications.value = response.data;
      return response.data;
    } catch (error) {
      console.error("Error in getAllUserNotifications:", error);
      toast.add({
        title: "Error",
        description: "An error occurred while fetching user notifications.",
        color: "red",
      });
      throw error;
    }
  };

  const getSingleNotification = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/notifications/single`, {
        query: { id },
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description:
            response.message || "Failed to fetch notification details.",
          color: "red",
        });
        return null;
      }

      return response;
    } catch (error) {
      console.error("Error in getSingleNotification:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch notification details.",
        color: "red",
      });
      throw error;
    }
  };

  const createNotification = async (notificationsData: any) => {
    try {
      const response = await $fetch<IApiResponse>("/api/notifications", {
        method: "POST",
        body: notificationsData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description:
            response.message || "Failed to create notification item.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Notification item created successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in createNotification:", error);
      toast.add({
        title: "Error",
        description: "Failed to create notification item.",
        color: "red",
      });
      throw error;
    }
  };

  const updateNotification = async (id: string, notificationsData: any) => {
    try {
      const response = await $fetch<IApiResponse>(
        `/api/notifications?id=${id}`,
        {
          method: "PUT",
          body: notificationsData,
        }
      );

      if (!response.success) {
        toast.add({
          title: "Error",
          description:
            response.message || "Failed to update notification item.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Notification item updated successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateNotification:", error);
      toast.add({
        title: "Error",
        description: "Failed to update notification item.",
        color: "red",
      });
      throw error;
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(
        `/api/notifications?id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.success) {
        toast.add({
          title: "Error",
          description:
            response.message || "Failed to delete notification item.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Notification item deleted successfully!",
        color: "green",
      });
      return response;
    } catch (error) {
      console.error("Error in deleteNotification:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete notification item.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    notifications,
    isEditingNotification,
    notificationsFormState,
    getAllNotifications,
    getAllUserNotifications,
    getSingleNotification,
    createNotification,
    updateNotification,
    deleteNotification,
  };
}
