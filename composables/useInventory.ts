import { useToast } from "#imports";

export function useInventory() {
  const toast = useToast();

  const isEditingInventory = useState<boolean>(
    "is-editing-inventory",
    () => false
  );

  const inventory = ref([]);

  const inventoryFormState = useState("inventory-formstate", () => ({
    name: "",
    description: "",
    category: "",
    sub_category: "",
    quantity: "High",
    unit: "",
    location: "",
    supplier: "",
    reorder_level: 0,
    purchase_date: "",
    cost_per_unit: 0,
    condition: "New",
    usage_notes: "",
    serial_number: "",
    manufacturer: "",
    images: [],
  }));

  const getAllinventory = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/inventory");
      inventory.value = response.data;

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch inventory.",
          color: "red",
        });
        return null;
      }


      return response.data;
    } catch (error) {
      console.error("Error in getAllinventory:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch inventory.",
        color: "red",
      });
      throw error;
    }
  };

  const getSingleInventory = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/inventory/single`, {
        query: { id },
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch inventory details.",
          color: "red",
        });
        return null;
      }

      return response;
    } catch (error) {
      console.error("Error in getSingleInventory:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch inventory details.",
        color: "red",
      });
      throw error;
    }
  };

  const createInventory = async (inventoryData: any) => {
    try {
      const response = await $fetch<IApiResponse>("/api/inventory", {
        method: "POST",
        body: inventoryData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to create inventory item.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Inventory item created successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in createInventory:", error);
      toast.add({
        title: "Error",
        description: "Failed to create inventory item.",
        color: "red",
      });
      throw error;
    }
  };

  const updateInventory = async (id: string, inventoryData: any) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/inventory?id=${id}`, {
        method: "PUT",
        body: inventoryData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to update inventory item.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Inventory item updated successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateInventory:", error);
      toast.add({
        title: "Error",
        description: "Failed to update inventory item.",
        color: "red",
      });
      throw error;
    }
  };

  const deleteInventory = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/inventory?id=${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to delete inventory item.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Inventory item deleted successfully!",
        color: "green",
      });
      return response;
    } catch (error) {
      console.error("Error in deleteInventory:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete inventory item.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    inventory,
    isEditingInventory,
    inventoryFormState,
    getAllinventory,
    getSingleInventory,
    createInventory,
    updateInventory,
    deleteInventory,
  };
}
