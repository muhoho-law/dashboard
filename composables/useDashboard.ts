// composables/useDashboard.ts

import { useToast } from "#imports";

export function useDashboard() {
  const toast = useToast();

  const counts = useState("dashboard-counts", () => ({
    employees: 10,
    inventory: 10,
    suppliers: 10,
    products: 10,
  }));

  const fetchCounts = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/dashboard/counts");

      if (response.success) {
        counts.value = response.data;
      } else {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch counts.",
          color: "red",
        });
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch counts.",
        color: "red",
      });
    }
  };

  return {
    counts,
    fetchCounts,
  };
}
