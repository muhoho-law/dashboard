import { useToast } from "#imports";

export function useCase() {
  const toast = useToast();

  const isEditingCase = useState<boolean>(
    "is-editing-cases",
    () => false
  );

  const cases = ref([]);

  const caseFormState = useState("cases-formstate", () => ({
    case_number: "",
    title: "",
    case_stage: "",
    status: "",
    case_type: "",
    client_id: "",
    description: "",
    lead_lawyer_id: "",
    filed_date: "",
    opposing_party: "",
    opposing_lawyer: "",
    billing_status: "",
  }));

  const getAllCases = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/cases");
      cases.value = response.data;

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch cases.",
          color: "red",
        });
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error in getAllCases:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch cases.",
        color: "red",
      });
      throw error;
    }
  };

  const getSingleCase = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/cases/single`, {
        query: { id },
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description:
            response.message || "Failed to fetch cases details.",
          color: "red",
        });
        return null;
      }

      return response;
    } catch (error) {
      console.error("Error in getSingleCase:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch cases details.",
        color: "red",
      });
      throw error;
    }
  };

  const createCase = async (caseData: any) => {
    try {
      const response = await $fetch<IApiResponse>("/api/cases", {
        method: "POST",
        body: caseData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to create cases.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Case recorded successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in createCase:", error);
      toast.add({
        title: "Error",
        description: "Failed to create cases.",
        color: "red",
      });
      throw error;
    }
  };

  const updateCase = async (id: string, caseData: any) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/cases?id=${id}`, {
        method: "PUT",
        body: caseData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to update cases.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Case updated successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateCase:", error);
      toast.add({
        title: "Error",
        description: "Failed to update cases.",
        color: "red",
      });
      throw error;
    }
  };

  const deleteCase = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/cases?id=${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to delete cases.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Case deleted successfully!",
        color: "green",
      });
      return response;
    } catch (error) {
      console.error("Error in deleteCase:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete cases.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    cases,
    isEditingCase,
    caseFormState,
    getAllCases,
    getSingleCase,
    createCase,
    updateCase,
    deleteCase,
  };
}
