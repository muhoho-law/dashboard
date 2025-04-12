<script setup>
useSeoMeta({
  title: "Authenticated Users",
  ogTitle: "Authenticated Users",
  description: "Manage system users with access control.",
  ogDescription: "View and edit authenticated user accounts.",
});

const {
  users,
  getAllUsers,
  getSingleUser,
  deleteUser,
  userFormState,
  isEditingUser,
} = useUsers();

const isDrawerOpen = ref(false);

const isDeleteModalOpen = ref(false);

const selectedUserId = ref(null);

const response = await getAllUsers();

const columns = ref([
  { key: "image_url", label: "Profile" },
  { key: "full_name", label: "Full Name" },
  { key: "username", label: "Username" },
  { key: "role", label: "Role" },
  { key: "phone_number", label: "Phone" },
  { key: "email", label: "Email" },
]);

const openEditDrawer = async (id) => {
  isEditingUser.value = true;
  selectedUserId.value = id;
  isDrawerOpen.value = true;

  // Fetch the user data and update the form state
  const { data } = await getSingleUser(id);
  if (data) {
    userFormState.value = { ...data };
  }
};

const refreshUsers = async () => {
  isDrawerOpen.value = false;
  await getAllUsers();
};

const confirmDelete = (id) => {
  selectedUserId.value = id;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (selectedUserId.value) {
    await deleteUser(selectedUserId.value);
    await getAllUsers(); // Refresh list after deletion
  }
  isDeleteModalOpen.value = false;
};

const roleColors = {
  lawyer: "green",
  legal_assistant: "teal",
  secretary: "yellow",
  attache: 'orange'
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Users</h1>
      <UButton color="primary" @click="isDrawerOpen = true"> Add User </UButton>
    </div>

    <UCard>
      <SharedDatagrid :columns="columns" :rows="users">
        <template #actions="{ row }">
          <div class="flex space-x-2">
            <UButton
              class="ma-2"
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

        <template #role="{ row }">
          <UBadge :color="roleColors[row.role] || 'gray'">
            {{ row.role }}
          </UBadge>
        </template>
      </SharedDatagrid>
    </UCard>

    <SharedDrawer v-model="isDrawerOpen" title="Edit User">
      <FormsUserForm @cancel="refreshUsers" />
    </SharedDrawer>

    <SharedModal
      :show="isDeleteModalOpen"
      message="Are you sure you want to delete this user?"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
