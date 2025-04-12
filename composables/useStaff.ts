import { useToast } from "#imports";

export function useStaff() {
  const toast = useToast();

  const isEditingStaff = useState<boolean>("is-editing-staff", () => false);

  const staff = ref([]);

  const staffFormState = useState("staff-formstate", () => ({
    name: "",
    role: "",
    phone: "",
    email: "",
    hired_date: "",
    status: "Active",
  }));

  const resetStaffFormState = () => {
    staffFormState.value = {
      name: "",
      role: "",
      phone: "",
      email: "",
      hired_date: "",
      status: "Active",
    };
  };

  const getAllStaff = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/staff");
      staff.value = response.data;

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch staff.",
          color: "red",
        });
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error in getAllStaff:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch staff.",
        color: "red",
      });
      throw error;
    }
  };

  const getSingleStaff = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/staff/single`, {
        query: { id },
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch staff details.",
          color: "red",
        });
        return null;
      }

      return response;
    } catch (error) {
      console.error("Error in getSingleStaff:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch staff details.",
        color: "red",
      });
      throw error;
    }
  };

  const createStaff = async (staffData: any) => {
    try {
      const response = await $fetch<IApiResponse>("/api/staff", {
        method: "POST",
        body: staffData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to create staff.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Staff created successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in createStaff:", error);
      toast.add({
        title: "Error",
        description: "Failed to create staff.",
        color: "red",
      });
      throw error;
    }
  };

  const updateStaff = async (id: string, staffData: any) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/staff?id=${id}`, {
        method: "PUT",
        body: staffData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to update staff.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Staff updated successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateStaff:", error);
      toast.add({
        title: "Error",
        description: "Failed to update staff.",
        color: "red",
      });
      throw error;
    }
  };

  const deleteStaff = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/staff?id=${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to delete staff.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Staff deleted successfully!",
        color: "green",
      });
      return response;
    } catch (error) {
      console.error("Error in deleteStaff:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete staff.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    staff,
    isEditingStaff,
    resetStaffFormState,
    staffFormState,
    getAllStaff,
    getSingleStaff,
    createStaff,
    updateStaff,
    deleteStaff,
  };
}
