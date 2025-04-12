import { useToast } from "#imports";

export function useTask() {
  const toast = useToast();

  const tasks = ref([]);

  const taskFormState = useState("task-formstate", () => ({
    title: "",
    description: "",
    priority: "",
    due_date: "",
    status: "",
    assigned_to: "",
  }));

  const getAllTasks = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/tasks");
      tasks.value = response.data;

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch tasks.",
          color: "red",
        });
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error in getAllTasks:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch tasks.",
        color: "red",
      });
      throw error;
    }
  };

  const createTask = async (taskData: any) => {
    try {
      const response = await $fetch<IApiResponse>("/api/tasks", {
        method: "POST",
        body: taskData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to create task.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Task created successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in createTask:", error);
      toast.add({
        title: "Error",
        description: "Failed to create task.",
        color: "red",
      });
      throw error;
    }
  };

  const updateTask = async (id: string, taskData: any) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/tasks?id=${id}`, {
        method: "PUT",
        body: taskData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to update task.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Task updated successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateTask:", error);
      toast.add({
        title: "Error",
        description: "Failed to update task.",
        color: "red",
      });
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/tasks?id=${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to delete task.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Task deleted successfully!",
        color: "green",
      });
      return response;
    } catch (error) {
      console.error("Error in deleteTask:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete task.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    tasks,
    taskFormState,
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
