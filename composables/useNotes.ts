import { useToast } from "#imports";

export function useNotes() {
  const toast = useToast();

  const isEditingNote = useState<boolean>(
    "is-editing-note",
    () => false
  );

  const notes = ref([]);

  const noteFormState = useState("note-formstate", () => ({
    title: "",
    content: "",
    author_id: "",
    case_id: "",
  }));

  const getAllNotes = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/notes");
      notes.value = response.data;

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch notes.",
          color: "red",
        });
        return null;
      }



      return response.data;
    } catch (error) {
      console.error("Error in getAllNotes:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch notes.",
        color: "red",
      });
      throw error;
    }
  };

  const getSingleNote = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/notes/single`, {
        query: { id },
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch note details.",
          color: "red",
        });
        return null;
      }

      return response;
    } catch (error) {
      console.error("Error in getSingleNote:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch note details.",
        color: "red",
      });
      throw error;
    }
  };

  const createNote = async (noteData: any) => {
    try {
      const response = await $fetch<IApiResponse>("/api/notes", {
        method: "POST",
        body: noteData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to create note.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Note created successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in createNote:", error);
      toast.add({
        title: "Error",
        description: "Failed to create note.",
        color: "red",
      });
      throw error;
    }
  };

  const updateNote = async (id: string, noteData: any) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/notes?id=${id}`, {
        method: "PUT",
        body: noteData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to update note.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Note updated successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateNote:", error);
      toast.add({
        title: "Error",
        description: "Failed to update note.",
        color: "red",
      });
      throw error;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/notes?id=${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to delete note.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Note deleted successfully!",
        color: "green",
      });
      return response;
    } catch (error) {
      console.error("Error in deleteNote:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete note.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    notes,
    isEditingNote,
    noteFormState,
    getAllNotes,
    getSingleNote,
    createNote,
    updateNote,
    deleteNote,
  };
}
