<script setup>
const { updateStaff, createStaff, staffFormState, isEditingStaff } = useStaff();
const emit = defineEmits(["save", "cancel"]);

const handleSubmit = async () => {
  let response;

  if (isEditingStaff.value) {
    response = await updateStaff(staffFormState.value.id, staffFormState.value);
  } else {
    response = await createStaff(staffFormState.value);
  }

  if (response.success) {
    isEditingStaff.value = false;
  }

  await emit("cancel");
};

</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="staffFormState">
    <UFormGroup class="py-3" label="Name" name="name">
      <UInput v-model="staffFormState.name" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Role" name="role">
      <UInput v-model="staffFormState.role" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Phone" name="phone">
      <UInput v-model="staffFormState.phone" type="tel" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Email" name="email">
      <UInput v-model="staffFormState.email" type="email" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Hired Date" name="hired_date">
      <UInput v-model="staffFormState.hired_date" type="date" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Status" name="status">
      <USelectMenu
        v-model="staffFormState.status"
        :options="['Active', 'Inactive']"
      />
    </UFormGroup>

    <div class="flex justify-end space-x-2">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton color="primary" type="submit">Save</UButton>
    </div>
  </UForm>
</template>
