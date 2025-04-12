import { useToast } from "#imports";

export function useProfile() {
  const toast = useToast();
  const userId = useHashedCookie<undefined | null | number>("b35db0c4e3bb4");

  const profileFormState = useState("profile-form", () => ({
    full_name: "",
    email: "",
    phone: "",
    image_url: "",
  }));

  const passwordFormState = useState("password-form", () => ({
    current_password: "",
    new_password: "",
    confirm_password: "",
  }));

  const getProfile = async () => {
    try {
      const response = await $fetch<IApiResponse>(`/api/profile`, {
        query: { id: userId.value },
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch profile details.",
          color: "red",
        });
        return null;
      }

      profileFormState.value = response.user;

      return response.user;
    } catch (error) {
      console.error("Error in getProfile:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch profile details.",
        color: "red",
      });
      throw error;
    }
  };

  const updateUser = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/profile", {
        method: "PUT",
        body: profileFormState.value,
      });

      if (!response?.success) {
        toast.add({
          title: "Error",
          description: response?.message || "Failed to update profile.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: response.message || "Profile updated successfully!",
        color: "green",
      });

      return response.user;
    } catch (error: any) {
      console.error("Error in updateUser:", error);

      toast.add({
        title: "Error",
        description: error?.data?.message || "Failed to update profile.",
        color: "red",
      });

      throw error;
    }
  };

  const resetPassword = async (passwordData: any) => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.add({
        title: "Error",
        description: "Passwords do not match.",
        color: "red",
      });
      return;
    }

    try {
      const response = await $fetch<IApiResponse>("/api/user/reset-password", {
        method: "POST",
        body: passwordData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to reset password.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Password updated successfully!",
        color: "green",
      });

      return response;
    } catch (error) {
      console.error("Error in resetPassword:", error);
      toast.add({
        title: "Error",
        description: "Failed to reset password.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    profileFormState,
    passwordFormState,
    updateUser,
    getProfile,
    resetPassword,
  };
}
