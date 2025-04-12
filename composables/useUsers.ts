import { useToast } from "#imports";

export function useUsers() {
  const toast = useToast();

  const isEditingUser = useState<boolean>(
    "is-editing-user",
    () => false
  );

  const users = ref([]);

  const userFormState = useState("user-formstate", () => ({
    name: "",
    role: "",
    phone: "",
    email: "",
    hired_date: "",
    status: "Active",
  }));

  const getAllUsers = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/users");
      users.value = response.data;

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch users.",
          color: "red",
        });
        return null;
      }



      return response.data;
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch users.",
        color: "red",
      });
      throw error;
    }
  };

  const getSingleUser = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/users/single`, {
        query: { id },
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch user details.",
          color: "red",
        });
        return null;
      }

      return response;
    } catch (error) {
      console.error("Error in getSingleUser:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch user details.",
        color: "red",
      });
      throw error;
    }
  };

  const createUser = async (userData: any) => {
    try {
      const response = await $fetch<IApiResponse>("/api/users", {
        method: "POST",
        body: userData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to create user.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "User created successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in createUser:", error);
      toast.add({
        title: "Error",
        description: "Failed to create user.",
        color: "red",
      });
      throw error;
    }
  };

  const updateUser = async (id: string, userData: any) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/users?id=${id}`, {
        method: "PUT",
        body: userData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to update user.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "User updated successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateUser:", error);
      toast.add({
        title: "Error",
        description: "Failed to update user.",
        color: "red",
      });
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/users?id=${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to delete user.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "User deleted successfully!",
        color: "green",
      });
      return response;
    } catch (error) {
      console.error("Error in deleteUser:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete user.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    users,
    isEditingUser,
    userFormState,
    getAllUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
  };
}
