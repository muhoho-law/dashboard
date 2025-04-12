<script setup>
useSeoMeta({
  title: "DocumentUploads",
  ogTitle: "DocumentUploads",
  description: "View and manage document_uploads profiles.",
  ogDescription: "Track document_uploads interactions and order history.",
});

const {
  document_uploads,
  getAllDocumentUploads,
  getSingleDocumentUploads,
  deleteDocumentUploads,
  documentUploadsFormState,
  isEditingDocumentUploads,
} = useDocumentUploads();

const isDrawerOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedDocumentUploadsId = ref(null);

const response = await getAllDocumentUploads();

const columns = ref([
  { key: "title", label: "Title" },
  { key: "public_url", label: "Download" },
  { key: "category", label: "Category" },
  { key: "case.title", label: "Case" },
  { key: "users.full_name", label: "Author" },
]);

const openEditDrawer = async (id) => {
  isEditingDocumentUploads.value = true;
  selectedDocumentUploadsId.value = id;
  isDrawerOpen.value = true;

  // Fetch the document_uploads data and update the form state
  const { data } = await getSingleDocumentUploads(id);
  if (data) {
    documentUploadsFormState.value = { ...data };
  }
};

const refreshDocumentUploads = async () => {
  isDrawerOpen.value = false;
  await getAllDocumentUploads();
};

const confirmDelete = (id) => {
  selectedDocumentUploadsId.value = id;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (selectedDocumentUploadsId.value) {
    await deleteDocumentUploads(selectedDocumentUploadsId.value);
    await getAllDocumentUploads(); // Refresh list after deletion
  }
  isDeleteModalOpen.value = false;
};


</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">DocumentUploads</h1>
      <UButton color="primary" @click="isDrawerOpen = true">
        Add Document
      </UButton>
    </div>

    <UCard>
      <SharedDatagrid :columns="columns" :rows="document_uploads">
        <template #actions="{ row }">
          <div class="flex space-x-2">
            <!-- <UButton
              icon="mdi:pencil"
              size="xs"
              @click="openEditDrawer(row.id)"
            /> -->
            <UButton
              icon="mdi:trash-can"
              color="red"
              size="xs"
              @click="confirmDelete(row.id)"
            />
          </div>
        </template>

        <!-- <template #status="{ row }">
          <UButton> Download </UButton>
        </template> -->

        <template #public_url="{ row }">
          <UButton :to="row.public_url" target="_blank"> Download </UButton>
        </template>
      </SharedDatagrid>
    </UCard>

    <SharedDrawer v-model="isDrawerOpen" title="Edit DocumentUploads">
      <FormsDocumentUploadsForm @cancel="refreshDocumentUploads" />
    </SharedDrawer>

    <SharedModal
      :show="isDeleteModalOpen"
      message="Are you sure you want to delete this document_uploads?"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
