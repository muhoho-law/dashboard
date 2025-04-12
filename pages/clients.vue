<script setup>
useSeoMeta({
  title: "Clients",
  ogTitle: "Clients",
  description: "Manage your clients efficiently.",
  ogDescription: "Keep track of client details and orders.",
});

const {
  clients,
  getAllClients,
  getSingleClient,
  deleteClient,
  clientFormState,
  resetClientFormState,
  isEditingClient,
} = useClient();

const isDrawerOpen = ref(false);

const isDeleteModalOpen = ref(false);

const selectedClientId = ref(null);

const response = await getAllClients();

const columns = ref([
  { key: "image_url", label: "Profile" },
  { key: "name", label: "Name" },
  { key: "phone_number", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
]);

const openEditDrawer = async (id) => {
  isEditingClient.value = true;
  selectedClientId.value = id;
  isDrawerOpen.value = true;

  // Fetch the client data and update the form state
  const { data } = await getSingleClient(id);
  if (data) {
    clientFormState.value = { ...data };
  }
};

const refreshClients = async () => {
  isDrawerOpen.value = false;
  await getAllClients();
};

const confirmDelete = (id) => {
  selectedClientId.value = id;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (selectedClientId.value) {
    await deleteClient(selectedClientId.value);
    await getAllClients(); // Refresh list after deletion
  }
  isDeleteModalOpen.value = false;
};

const newClient = async () => {
  isDrawerOpen.value = true;
  isEditingClient.value = false;
  await resetClientFormState();
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Clients</h1>
      <UButton color="primary" @click="newClient"> Add Client </UButton>
    </div>

    <UCard>
      <SharedDatagrid :columns="columns" :rows="clients">
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

    <SharedDrawer
      v-model="isDrawerOpen"
      :title="isEditingMemo ? 'Edit Client' : 'Add Client'"
    >
      <FormsClientForm @cancel="refreshClients" />
    </SharedDrawer>

    <SharedModal
      :show="isDeleteModalOpen"
      message="Are you sure you want to delete this client?"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
