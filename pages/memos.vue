<script setup>
useSeoMeta({
  title: "Memos",
  ogTitle: "Memos",
  description: "Manage your memos efficiently.",
  ogDescription: "Track and manage your memos easily.",
});

const {
  memos,
  getAllMemos,
  getSingleMemo,
  deleteMemo,
  memoFormState,
  isEditingMemo,
  resetMemoFormState,
} = useMemos();

const isDrawerOpen = ref(false);

const isDeleteModalOpen = ref(false);

const selectedMemoId = ref(null);

const response = await getAllMemos();

const columns = ref([
  { key: "id", label: "ID", sortable: true },
  { key: "case.title", label: "Case" },
  { key: "users.full_name", label: "Author" },
  { key: "title", label: "Title" },
  { key: "content", label: "Content" },
  // { key: "status", label: "Status" },
  { key: "priority", label: "Priority" },
  { key: "visibility", label: "Visibility" },
  // { key: "tags", label: "Tags" },
]);

const openEditDrawer = async (id) => {
  isEditingMemo.value = true;
  selectedMemoId.value = id;
  isDrawerOpen.value = true;

  // Fetch the memo data and update the form state
  const { data } = await getSingleMemo(id);
  if (data) {
    memoFormState.value = { ...data };
  }
};

const refreshMemos = async () => {
  isDrawerOpen.value = false;
  await getAllMemos();
};

const confirmDelete = (id) => {
  selectedMemoId.value = id;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (selectedMemoId.value) {
    await deleteMemo(selectedMemoId.value);
    await getAllMemos(); // Refresh list after deletion
  }
  isDeleteModalOpen.value = false;
};

const newMemo = async () => {
  isDrawerOpen.value = true;
  isEditingMemo.value = false;
  await resetMemoFormState();
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Memos</h1>
      <UButton color="primary" @click="newMemo()"> Add Memo </UButton>
    </div>

    <UCard>
      <SharedDatagrid :columns="columns" :rows="memos">
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
      :title="isEditingMemo ? 'Edit Memo' : 'Add Memo'"
    >
      <FormsMemoForm @cancel="refreshMemos" />
    </SharedDrawer>

    <SharedModal
      :show="isDeleteModalOpen"
      message="Are you sure you want to delete this memo?"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
