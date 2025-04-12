import { useToast } from "#imports";

export function useDirectory() {
  const toast = useToast();

  const directory = ref([]);

  const directoryFormState = useState("directory-formstate", () => ({
    name: "",
    description: "",
    price: 0,
    images: [],
    stock: 0,
    category: "",
  }));

  const getAllDirectory = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/directory");
      directory.value = response.data;

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch directory.",
          color: "red",
        });
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error in getAllDirectory:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch directory.",
        color: "red",
      });
      throw error;
    }
  };

  const createDirectory = async (directoryData: any) => {
    try {
      const response = await $fetch<IApiResponse>("/api/directory", {
        method: "POST",
        body: directoryData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to create directory.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Directory created successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in createDirectory:", error);
      toast.add({
        title: "Error",
        description: "Failed to create directory.",
        color: "red",
      });
      throw error;
    }
  };

  const updateDirectory = async (id: string, directoryData: any) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/directory?id=${id}`, {
        method: "PUT",
        body: directoryData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to update directory.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Directory updated successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateDirectory:", error);
      toast.add({
        title: "Error",
        description: "Failed to update directory.",
        color: "red",
      });
      throw error;
    }
  };

  const deleteDirectory = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/directory?id=${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to delete directory.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Directory deleted successfully!",
        color: "green",
      });
      return response;
    } catch (error) {
      console.error("Error in deleteDirectory:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete directory.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    directory,
    directoryFormState,
    getAllDirectory,
    createDirectory,
    updateDirectory,
    deleteDirectory,
  };
}
