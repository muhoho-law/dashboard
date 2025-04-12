<script setup>
useSeoMeta({
  title: "staff",
  ogTitle: "staff",
  description: "Manage staff details and work status.",
  ogDescription: "Easily update and monitor your staff' activities.",
});

const {
  staff,
  getAllStaff,
  getSingleStaff,
  deleteStaff,
  staffFormState,
  resetStaffFormState,
  isEditingStaff,
} = useStaff();

const isDrawerOpen = ref(false);

const isDeleteModalOpen = ref(false);

const selectedStaffId = ref(null);

const response = await getAllStaff();

const columns = ref([
  { key: "image_url", label: "Profile" },
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "status", label: "Status" },
  { key: "hired_date", label: "Hired Date" },
]);

const openEditDrawer = async (id) => {
  isEditingStaff.value = true;
  selectedStaffId.value = id;
  isDrawerOpen.value = true;

  // Fetch the staff data and update the form state
  const { data } = await getSingleStaff(id);
  if (data) {
    staffFormState.value = { ...data };
  }
};

const refreshStaff = async () => {
  isDrawerOpen.value = false;
  await getAllStaff();
};

const confirmDelete = (id) => {
  selectedStaffId.value = id;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (selectedStaffId.value) {
    await deleteStaff(selectedStaffId.value);
    await getAllStaff(); // Refresh list after deletion
  }
  isDeleteModalOpen.value = false;
};

const newStaff = async () => {
  isDrawerOpen.value = true;
  isEditingStaff.value = false;
  await resetStaffFormState();
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Staff</h1>
      <UButton color="primary" @click="newStaff">
        Add Staff
      </UButton>
    </div>

    <UCard>
      <SharedDatagrid :columns="columns" :rows="staff">
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
      :title="isEditingStaff ? 'Edit Staff' : 'Add Staff'"
    >
      <FormsStaffForm @cancel="refreshStaff" />
    </SharedDrawer>

    <SharedModal
      :show="isDeleteModalOpen"
      message="Are you sure you want to delete this staff?"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
