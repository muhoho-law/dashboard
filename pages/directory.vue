<script setup>
useSeoMeta({
  title: "Directory",
  ogTitle: "Directory",
  description: "Manage stock levels and product directory.",
  ogDescription: "Monitor directory changes and stock availability.",
});

const {
  directory,
  getAlldirectory,
  getSingleDirectory,
  deleteDirectory,
  directoryFormState,
  isEditingDirectory,
} = useDirectory();

const isDrawerOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedDirectoryId = ref(null);

const response = await getAlldirectory();

const columns = ref([
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "category", label: "Category" },
  { key: "sub_category", label: "Sub-Category" },
  { key: "quantity", label: "Quantity" },
  { key: "unit", label: "Unit" },
  { key: "location", label: "Location" },
  { key: "supplier", label: "Supplier" },
  { key: "reorder_level", label: "Reorder Level" },
  { key: "purchase_date", label: "Purchase Date" },
  { key: "cost_per_unit", label: "Cost per Unit" },
  { key: "condition", label: "Condition" },
  { key: "usage_notes", label: "Usage Notes" },
  { key: "serial_number", label: "Serial Number" },
  { key: "manufacturer", label: "Manufacturer" },
  { key: "images", label: "Images" },
]);

const openEditDrawer = async (id) => {
  isEditingDirectory.value = true;
  selectedDirectoryId.value = id;
  isDrawerOpen.value = true;

  // Fetch and populate form state
  const { data } = await getSingleDirectory(id);
  if (data) {
    directoryFormState.value = { ...data };
  }
};

const refreshDirectory = async () => {
  isDrawerOpen.value = false;
  await getAlldirectory();
};

const confirmDelete = (id) => {
  selectedDirectoryId.value = id;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (selectedDirectoryId.value) {
    await deleteDirectory(selectedDirectoryId.value);
    await getAlldirectory();
  }
  isDeleteModalOpen.value = false;
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Directory</h1>
      <UButton color="primary" @click="isDrawerOpen = true">
        Add Directory Item
      </UButton>
    </div>

    <UCard>
      <SharedDatagrid :columns="columns" :rows="directory">
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

        <template #condition="{ row }">
          <UBadge v-if="row.condition === 'New'" color="green">
            {{ row.condition }}
          </UBadge>
          <UBadge v-else-if="row.condition === 'Used'" color="yellow">
            {{ row.condition }}
          </UBadge>
          <UBadge v-else color="red">
            {{ row.condition }}
          </UBadge>
        </template>

        <!-- <template #quantity="{ row }">
          <UBadge v-if="row.quantity === 'High'" color="green"> High </UBadge>
          <UBadge v-else-if="row.quantity === 'Medium'" color="yellow">
            Medium
          </UBadge>
          <UBadge v-else color="red"> Low </UBadge>
        </template> -->

        <template #category="{ row }">
          <UBadge color="blue">
            {{ row.category }}
          </UBadge>
        </template>
      </SharedDatagrid>
    </UCard>

    <SharedDrawer v-model="isDrawerOpen" title="Edit Directory">
      <FormsDirectoryForm @cancel="refreshDirectory" />
    </SharedDrawer>

    <SharedModal
      :show="isDeleteModalOpen"
      message="Are you sure you want to delete this directory item?"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
