<script setup>
useSeoMeta({
  title: "Notes",
  ogTitle: "Notes",
  description: "Manage your notes efficiently.",
  ogDescription: "Track and manage your notes easily.",
});

const {
  notes,
  getAllNotes,
  getSingleNote,
  deleteNote,
  noteFormState,
  isEditingNote,
} = useNotes();

const isDrawerOpen = ref(false);

const isDeleteModalOpen = ref(false);

const selectedNoteId = ref(null);

const response = await getAllNotes();

const columns = ref([
  { key: "id", label: "ID", sortable: true },
  { key: "title", label: "Title" },
  { key: "content", label: "Content" },
  { key: "users.full_name", label: "Author" },
  { key: "cases.title", label: "Case" },
]);

const openEditDrawer = async (id) => {
  isEditingNote.value = true;
  selectedNoteId.value = id;
  isDrawerOpen.value = true;

  // Fetch the note data and update the form state
  const { data } = await getSingleNote(id);
  if (data) {
    noteFormState.value = { ...data };
  }
};

const refreshNotes = async () => {
  isDrawerOpen.value = false;
  await getAllNotes();
};

const confirmDelete = (id) => {
  selectedNoteId.value = id;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (selectedNoteId.value) {
    await deleteNote(selectedNoteId.value);
    await getAllNotes(); // Refresh list after deletion
  }
  isDeleteModalOpen.value = false;
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Notes</h1>
      <UButton color="primary" @click="isDrawerOpen = true">
        Add Note
      </UButton>
    </div>

    <UCard>
      <SharedDatagrid :columns="columns" :rows="notes">
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

    <SharedDrawer v-model="isDrawerOpen" title="Edit Note">
      <FormsNoteForm @cancel="refreshNotes" />
    </SharedDrawer>

    <SharedModal
      :show="isDeleteModalOpen"
      message="Are you sure you want to delete this note?"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
