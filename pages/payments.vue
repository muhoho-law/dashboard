<script setup>
useSeoMeta({
  title: "Payments",
  ogTitle: "Payments",
  description: "View and manage payment transactions.",
  ogDescription: "Stay updated with all incoming and outgoing payments.",
});

const {
  payments,
  getAllPayments,
  getSinglePayment,
  deletePayment,
  paymentFormState,
  isEditingPayment,
} = usePayment();

const isDrawerOpen = ref(false);

const isDeleteModalOpen = ref(false);

const selectedPaymentId = ref(null);

const response = await getAllPayments();

const columns = ref([
  { key: "client_id", label: "Client" },
  { key: "amount", label: "Amount" },
  { key: "payment_method", label: "Payment Method" },
  { key: "case_id", label: "Case" },
  { key: "payment_date", label: "Payment Date" },
  { key: "status", label: "Status" },
  { key: "description", label: "Description" },
  { key: "balance", label: "Balance" },
  { key: "due_date", label: "Due Date" },

]);

const openEditDrawer = async (id) => {
  isEditingPayment.value = true;
  selectedPaymentId.value = id;
  isDrawerOpen.value = true;

  // Fetch the payment data and update the form state
  const { data } = await getSinglePayment(id);
  if (data) {
    paymentFormState.value = { ...data };
  }
};

const refreshPayments = async () => {
  isDrawerOpen.value = false;
  await getAllPayments();
};

const confirmDelete = (id) => {
  selectedPaymentId.value = id;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (selectedPaymentId.value) {
    await deletePayment(selectedPaymentId.value);
    await getAllPayments(); // Refresh list after deletion
  }
  isDeleteModalOpen.value = false;
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Billing</h1>
      <UButton color="primary" @click="isDrawerOpen = true">
        Add Billing
      </UButton>
    </div>

    <UCard>
      <SharedDatagrid :columns="columns" :rows="payments">
        <template #actions="{ row }">
          <div class="flex space-x-2">
            <UButton
              icon="mdi:pencil"
              size="xs"
              @click="openEditDrawer(row.id)"
            />
            <UButton
              icon="mdi:trash-can"
              color="red"
              size="xs"
              @click="confirmDelete(row.id)"
            />
          </div>
        </template>

        <template #status="{ row }">
          <UBadge
            v-if="row.status === 'Active' || row.status === 'active'"
            color="green"
          >
            {{ row.status }}
          </UBadge>

          <UBadge
            v-else-if="row.status === 'Inactive' || row.status === 'inactive'"
            color="red"
          >
            {{ row.status }}
          </UBadge>
        </template>
      </SharedDatagrid>
    </UCard>

    <SharedDrawer v-model="isDrawerOpen" title="Edit Payment">
      <FormsPaymentForm @cancel="refreshPayments" />
    </SharedDrawer>

    <SharedModal
      :show="isDeleteModalOpen"
      message="Are you sure you want to delete this payment?"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
