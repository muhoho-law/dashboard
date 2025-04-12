import { useToast } from "#imports";

export function usePayment() {
  const toast = useToast();

  const isEditingPayment = useState<boolean>(
    "is-editing-payment",
    () => false
  );

  const payments = ref([]);

  const paymentFormState = useState("payment-formstate", () => ({
    name: "",
    address: "",
    phone: "",
    email: "",
  }));

  const getAllPayments = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/payments");
      payments.value = response.data;

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch payments.",
          color: "red",
        });
        return null;
      }



      return response.data;
    } catch (error) {
      console.error("Error in getAllPayments:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch payments.",
        color: "red",
      });
      throw error;
    }
  };

  const getSinglePayment = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/payments/single`, {
        query: { id },
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch payment details.",
          color: "red",
        });
        return null;
      }

      return response;
    } catch (error) {
      console.error("Error in getSinglePayment:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch payment details.",
        color: "red",
      });
      throw error;
    }
  };

  const createPayment = async (paymentData: any) => {
    try {
      const response = await $fetch<IApiResponse>("/api/payments", {
        method: "POST",
        body: paymentData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to create payment.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Payment created successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in createPayment:", error);
      toast.add({
        title: "Error",
        description: "Failed to create payment.",
        color: "red",
      });
      throw error;
    }
  };

  const updatePayment = async (id: string, paymentData: any) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/payments?id=${id}`, {
        method: "PUT",
        body: paymentData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to update payment.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Payment updated successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in updatePayment:", error);
      toast.add({
        title: "Error",
        description: "Failed to update payment.",
        color: "red",
      });
      throw error;
    }
  };

  const deletePayment = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/payments?id=${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to delete payment.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Payment deleted successfully!",
        color: "green",
      });
      return response;
    } catch (error) {
      console.error("Error in deletePayment:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete payment.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    payments,
    isEditingPayment,
    paymentFormState,
    getAllPayments,
    getSinglePayment,
    createPayment,
    updatePayment,
    deletePayment,
  };
}
