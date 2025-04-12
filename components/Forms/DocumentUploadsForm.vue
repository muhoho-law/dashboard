<script setup lang="ts">
const {
  updateDocumentUpload,
  createDocumentUpload,
  documentUploadsFormState,
  isEditingDocumentUpload,
} = useDocumentUploads();
const { getAllUsers } = useUsers();
const toast = useToast();

const { uploadFile } = useDocumentStorage();

// Emits for handling events
const emit = defineEmits(["save", "cancel"]);

const { getAllCases } = useCase();

const cases = ref<{ id: number; name: string }[]>([]);

onMounted(async () => {
  const response = await getAllCases();
  cases.value = response.map((c: any) => ({
    label: c.title || `Case #${c.id}`, // Adjust according to your case fields
    value: c.id,
  }));
});

// Computed binding that syncs selected case ID to full option and vice versa
const selectedCase = computed({
  get() {
    return (
      cases.value.find(
        (option) => option.value === documentUploadsFormState.value.case_id
      ) ?? null
    );
  },
  set(newOption) {
    documentUploadsFormState.value.case_id = newOption?.value ?? null;
  },
});

const categoryOptions = ref([
  "Contract",
  "Evidence",
  "Court",
  "Compliance",
  "Filing",
]);

// Client options fetched from the backend
const authorOptions = ref<{ label: string; value: string }[]>([]);

const fetchUsers = async () => {
  try {
    const usersResponse = await getAllUsers();
    authorOptions.value = usersResponse.map((user: any) => ({
      label: user.full_name,
      value: user.id,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.add({
      title: "Error",
      description: "Failed to load user options.",
      color: "red",
      id: "user-fetch-error",
    });
  }
};

onMounted(() => {
  fetchUsers();
});

// Computed binding for Author selection
const selectedAuthor = computed({
  get() {
    return (
      authorOptions.value.find(
        (option) => option.value === documentUploadsFormState.value.uploaded_by
      ) || null
    );
  },
  set(newOption) {
    documentUploadsFormState.value.uploaded_by = newOption
      ? newOption.value
      : null;
  },
});

const loadingState = reactive({
  get: false,
  upload: false,
  remove: false,
});

// This ref will hold the uploaded file URL
const fileUrl = ref<string | undefined>();

const handleSubmit = async () => {
  // Before submitting, set the public_url field from the uploaded file URL
  if (fileUrl.value) {
    documentUploadsFormState.value.public_url = fileUrl.value;
  }

  let response;

  if (documentUploadsFormState.value.id) {
    response = await updateDocumentUpload(
      documentUploadsFormState.value.id,
      documentUploadsFormState.value
    );
  } else {
    response = await createDocumentUpload(documentUploadsFormState.value);
  }

  // if (response.success) {
  //   emit("save", response.data);
  // }
  emit("cancel");
};

const selectFile = () => {
  document.getElementById("input-file-upload")?.click();
};

// Upload a file using the uploadFile function
const upload = async (event: any) => {
  try {
    const file = event.target.files[0];
    loadingState.upload = true;
    const uploadedFile = await uploadFile(file);
    fileUrl.value = uploadedFile?.url;
    console.log("Uploaded file URL:", fileUrl.value);
  } catch (error) {
    toast.add({ color: "red", title: "Upload failed." });
  } finally {
    loadingState.upload = false;
  }
};
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="documentUploadsFormState">
    <UFormGroup class="py-3" label="Document Title" name="title">
      <UInput v-model="documentUploadsFormState.title" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Case" name="case_id">
      <USelectMenu
        v-model="selectedCase"
        :options="cases"
        placeholder="Select a case"
      />
    </UFormGroup>

    <UFormGroup class="py-3" label="Category" name="category">
      <USelectMenu
        v-model="documentUploadsFormState.category"
        :options="categoryOptions"
        placeholder="Select category"
        searchable
      />
    </UFormGroup>

    <!-- Client -->
    <UFormGroup class="py-3" label="Client" name="uploaded_by">
      <USelectMenu
        v-model="selectedAuthor"
        :options="authorOptions"
        placeholder="Select a Client"
      />
    </UFormGroup>

    <div>
      <UButton
        class="h-10"
        color="white"
        :disabled="loadingState.upload"
        :loading="loadingState.upload"
        @click="selectFile"
      >
        + Upload new file
      </UButton>
      <input
        type="file"
        accept="document/*"
        class="hidden"
        id="input-file-upload"
        @change="upload"
      />
    </div>

    <div class="flex justify-end space-x-2">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton color="primary" type="submit">Save</UButton>
    </div>
  </UForm>
</template>
