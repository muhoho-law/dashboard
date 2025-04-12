import { useToast } from "#imports";

export function useMemos() {
  const toast = useToast();

  const isEditingMemo = useState<boolean>("is-editing-memo", () => false);

  const userId = useHashedCookie<undefined | null | number>("b35db0c4e3bb4");

  const memos = ref([]);

  const memoFormState = useState("memo-formstate", () => ({
    case_id: "",
    author_id: "",
    title: "",
    content: "",
    status: "",
    priority: "",
    visibility: "",
    tags: [],
  }));

  const resetMemoFormState = () => {
    memoFormState.value = {
      case_id: "",
      author_id: "",
      title: "",
      content: "",
      status: "",
      priority: "",
      visibility: "",
      tags: [],
    };
  };

  const getAllMemos = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/memos");
      memos.value = response.data;

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch memos.",
          color: "red",
        });
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error in getAllMemos:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch memos.",
        color: "red",
      });
      throw error;
    }
  };

  const getSingleMemo = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/memos/single`, {
        query: { id },
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch memo details.",
          color: "red",
        });
        return null;
      }

      return response;
    } catch (error) {
      console.error("Error in getSingleMemo:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch memo details.",
        color: "red",
      });
      throw error;
    }
  };

  const createMemo = async () => {
    try {
      memoFormState.value.author_id = userId.value;

      const response = await $fetch<IApiResponse>("/api/memos", {
        method: "POST",
        body: memoFormState.value,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to create memo.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Memo created successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in createMemo:", error);
      toast.add({
        title: "Error",
        description: "Failed to create memo.",
        color: "red",
      });
      throw error;
    }
  };

  const updateMemo = async (id: string, memoData: any) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/memos?id=${id}`, {
        method: "PUT",
        body: memoData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to update memo.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Memo updated successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateMemo:", error);
      toast.add({
        title: "Error",
        description: "Failed to update memo.",
        color: "red",
      });
      throw error;
    }
  };

  const deleteMemo = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/memos?id=${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to delete memo.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Memo deleted successfully!",
        color: "green",
      });
      return response;
    } catch (error) {
      console.error("Error in deleteMemo:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete memo.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    memos,
    memoFormState,
    isEditingMemo,
    getSingleMemo,
    getAllMemos,
    createMemo,
    updateMemo,
    deleteMemo,
    resetMemoFormState,
  };
}
