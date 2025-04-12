import { useToast } from "#imports";

export function useDocumentUploads() {
  const toast = useToast();

  const userId = useHashedCookie<undefined | null | number>("b35db0c4e3bb4");

  const isEditingDocumentUpload = useState<boolean>(
    "is-editing-document_uploads",
    () => false
  );

  const document_uploads = ref([]);

  const documentUploadsFormState = useState("document_uploads-formstate", () => ({
    title: "",
    category: "",
    public_url: "",
    case_id: "",
    uploaded_by: "",
  }));

  // "title": "Contract Agreement",
  // "public_url": "https://baiklnypvrekcxkmdfsu.supabase.co/storage/v1/object/public/documents//1743625355829-About%20the%20Project.pdf",
  // "category": "Contract",
  // "case_id": 1,
  // "uploaded_by":

  const getAllDocumentUploads = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/document_uploads");
      document_uploads.value = response.data;

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch document_uploads.",
          color: "red",
        });
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error in getAllDocumentUploads:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch document_uploads.",
        color: "red",
      });
      throw error;
    }
  };

  const getSingleDocumentUpload = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/document_uploads/single`, {
        query: { id },
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description:
            response.message || "Failed to fetch document_uploads details.",
          color: "red",
        });
        return null;
      }

      return response;
    } catch (error) {
      console.error("Error in getSingleDocumentUpload:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch document_uploads details.",
        color: "red",
      });
      throw error;
    }
  };

  const createDocumentUpload = async (document_uploadsData: any) => {
    try {
      const response = await $fetch<IApiResponse>("/api/document_uploads", {
        method: "POST",
        body: document_uploadsData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to create document_uploads.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "DocumentUpload recorded successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in createDocumentUpload:", error);
      toast.add({
        title: "Error",
        description: "Failed to create document_uploads.",
        color: "red",
      });
      throw error;
    }
  };

  const updateDocumentUpload = async (id: string, document_uploadsData: any) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/document_uploads?id=${id}`, {
        method: "PUT",
        body: document_uploadsData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to update document_uploads.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "DocumentUpload updated successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateDocumentUpload:", error);
      toast.add({
        title: "Error",
        description: "Failed to update document_uploads.",
        color: "red",
      });
      throw error;
    }
  };

  const deleteDocumentUpload = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/document_uploads?id=${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to delete document_uploads.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "DocumentUpload deleted successfully!",
        color: "green",
      });
      return response;
    } catch (error) {
      console.error("Error in deleteDocumentUpload:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete document_uploads.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    document_uploads,
    isEditingDocumentUpload,
    documentUploadsFormState,
    getAllDocumentUploads,
    getSingleDocumentUpload,
    createDocumentUpload,
    updateDocumentUpload,
    deleteDocumentUpload,
  };
}

