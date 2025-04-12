<script setup lang="ts">
const {
  updateInventory,
  createInventory,
  inventoryFormState,
  isEditingInventory,
} = useInventory();
const emit = defineEmits(["save", "cancel"]);

const { storageFiles, getAllFiles, uploadFile, deleteFile } = useImageStorage();
const toast = useToast();

// Select a file for upload
const selectFile = () => {
  document.getElementById("input-file-upload")?.click();
};

// Initialize images as an empty array if not already initialized
if (!inventoryFormState.value.images) {
  inventoryFormState.value.images = [];
}

const loadingState = reactive({
  get: false,
  upload: false,
  remove: false,
});

// Handle file input change
const handleFileChange = async (event: any) => {
  try {
    const files = event?.target?.files;

    // Ensure files are selected
    if (!files || files.length === 0) {
      toast.add({ color: "red", title: "No files selected." });
      return;
    }

    // Initialize images as an empty array if not already initialized
    if (!Array.isArray(inventoryFormState.value.images)) {
      inventoryFormState.value.images = [];
    }

    // Loop through the selected files
    for (const file of files) {
      // if (isFileValidateError(file)) return; // Validate each file

      const newFileName = file.name.replace(/\s+/g, "_");

      // Create a new File object with the updated name
      const newFile = new File([file], newFileName, { type: file.type });

      loadingState.upload = true;

      // Assuming uploadFile returns an object or string containing the uploaded file's URL or metadata
      const uploadedFile = await uploadFile(newFile);

      if (uploadedFile) {
        // Check if the uploadedFile is valid and in the expected format
        // Push the uploaded file information into images array
        inventoryFormState.value.images.push(uploadedFile);
      } else {
        toast.add({ color: "red", title: "File upload failed." });
      }
    }
  } catch (error) {
    toast.add({
      color: "red",
      title: "Upload failed.",
      description: error?.toString(),
    });
  } finally {
    loadingState.upload = false;
  }
};

const handleSubmit = async () => {
  let response;

  if (isEditingInventory.value) {
    response = await updateInventory(
      inventoryFormState.value.id,
      inventoryFormState.value
    );
  } else {
    response = await createInventory(inventoryFormState.value);
  }

  if (response.success) {
    isEditingInventory.value = false;
  }

  await emit("cancel");
};
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="inventoryFormState">
    <UFormGroup class="py-3" label="Name" name="name">
      <UInput v-model="inventoryFormState.name" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Description" name="description">
      <UInput v-model="inventoryFormState.description" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Category" name="category">
      <UInput v-model="inventoryFormState.category" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Sub-Category" name="sub_category">
      <UInput v-model="inventoryFormState.sub_category" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Quantity" name="quantity">
      <USelect
        v-model="inventoryFormState.quantity"
        :options="['High', 'Medium', 'Low']"
      />
    </UFormGroup>
    <UFormGroup class="py-3" label="Unit" name="unit">
      <UInput v-model="inventoryFormState.unit" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Location" name="location">
      <UInput v-model="inventoryFormState.location" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Supplier" name="supplier">
      <UInput v-model="inventoryFormState.supplier" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Reorder Level" name="reorder_level">
      <UInput v-model="inventoryFormState.reorder_level" type="number" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Purchase Date" name="purchase_date">
      <UInput v-model="inventoryFormState.purchase_date" type="date" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Cost per Unit" name="cost_per_unit">
      <UInput v-model="inventoryFormState.cost_per_unit" type="number" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Condition" name="condition">
      <USelect
        v-model="inventoryFormState.condition"
        :options="['New', 'Used']"
      />
    </UFormGroup>
    <UFormGroup class="py-3" label="Usage Notes" name="usage_notes">
      <UInput v-model="inventoryFormState.usage_notes" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Serial Number" name="serial_number">
      <UInput v-model="inventoryFormState.serial_number" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Manufacturer" name="manufacturer">
      <UInput v-model="inventoryFormState.manufacturer" />
    </UFormGroup>

    <!-- Display uploaded images -->
    <div
      v-if="inventoryFormState.images && inventoryFormState.images.length > 0"
    >
      <div v-for="image in inventoryFormState.images" :key="image">
        <img :src="image" alt="Uploaded Image" width="100" />
      </div>
    </div>

    <!-- Images Upload -->
    <UFormGroup class="py-3" label="Images" name="images">
      <!-- <UInput type="file" multiple @change="handleFileChange" /> -->
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
        accept="image/*"
        multiple
        class="hidden"
        id="input-file-upload"
        @change="handleFileChange"
      />
    </UFormGroup>

    <div class="flex justify-end space-x-2">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton color="primary" type="submit">Save</UButton>
    </div>
  </UForm>
</template>
