import { useToast } from "#imports";

export function useAppointment() {
  const toast = useToast();

  const isEditingAppointment = useState<boolean>(
    "is-editing-appointment",
    () => false
  );

  const appointments = ref([]);

  const appointmentFormState = useState("appointment-formstate", () => ({
    user_id: "",
    organization_id: null,
    date: "",
    time: "",
    status: "",
    notes: "",
  }));

  const getAllAppointments = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/appointments");
      appointments.value = response.data;

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch appointment.",
          color: "red",
        });
        return null;
      }


      return response.data;
    } catch (error) {
      console.error("Error in getAllAppointments:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch appointment.",
        color: "red",
      });
      throw error;
    }
  };

  const getAllPatientAppointments = async (userId: string) => {
    try {
      if (!userId) {
        toast.add({
          title: "Error",
          description: "User ID is required to fetch appointments.",
          color: "red",
        });
        return null;
      }

      const response = await $fetch<IApiResponse>("/api/appointments/patient", {
        query: { user_id: userId },
      });

      if (!response?.success || !response?.data) {
        toast.add({
          title: "Error",
          description: response?.message || "Failed to fetch appointments.",
          color: "red",
        });
        return null;
      }

      appointments.value = response.data;
      return response.data;
    } catch (error) {
      console.error("Error in getAllPatientAppointments:", error);
      toast.add({
        title: "Error",
        description: "An error occurred while fetching user appointments.",
        color: "red",
      });
      throw error;
    }
  };


  const getSingleAppointment = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/appointments/single`, {
        query: { id },
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description:
            response.message || "Failed to fetch appointment details.",
          color: "red",
        });
        return null;
      }

      return response;
    } catch (error) {
      console.error("Error in getSingleAppointment:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch appointment details.",
        color: "red",
      });
      throw error;
    }
  };

  const createAppointment = async (appointmentData: any) => {
    try {
      const response = await $fetch<IApiResponse>("/api/appointments", {
        method: "POST",
        body: appointmentData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to create appointment item.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Appointment item created successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in createAppointment:", error);
      toast.add({
        title: "Error",
        description: "Failed to create appointment item.",
        color: "red",
      });
      throw error;
    }
  };

  const updateAppointment = async (id: string, appointmentData: any) => {
    try {
      const response = await $fetch<IApiResponse>(
        `/api/appointments?id=${id}`,
        {
          method: "PUT",
          body: appointmentData,
        }
      );

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to update appointment item.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Appointment item updated successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateAppointment:", error);
      toast.add({
        title: "Error",
        description: "Failed to update appointment item.",
        color: "red",
      });
      throw error;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(
        `/api/appointments?id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to delete appointment item.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Appointment item deleted successfully!",
        color: "green",
      });
      return response;
    } catch (error) {
      console.error("Error in deleteAppointment:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete appointment item.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    appointments,
    isEditingAppointment,
    appointmentFormState,
    getAllAppointments,
    getAllPatientAppointments,
    getSingleAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
}
