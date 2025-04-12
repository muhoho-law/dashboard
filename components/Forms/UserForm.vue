<script setup>
const { updateUser, createUser, userFormState, isEditingUser } = useUsers();
const emit = defineEmits(["save", "cancel"]);

const handleSubmit = async () => {
  let response;

  if (isEditingUser.value) {
    response = await updateUser(userFormState.value.id, userFormState.value);
  } else {
    response = await createUser(userFormState.value);
  }

  if (response.success) {
    isEditingUser.value = false;
  }

  await emit("cancel");
};
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="userFormState">
    <UFormGroup class="py-3" label="Full Name" name="full_name">
      <UInput v-model="userFormState.full_name" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Username" name="username">
      <UInput v-model="userFormState.username" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Role" name="role">
      <UInput v-model="userFormState.role" disabled />
    </UFormGroup>
    <UFormGroup class="py-3" label="Phone" name="phone_number">
      <UInput v-model="userFormState.phone_number" type="tel" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Email" name="email">
      <UInput v-model="userFormState.email" type="email" disabled />
    </UFormGroup>

    <div class="flex justify-end space-x-2">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton color="primary" type="submit">Save</UButton>
    </div>
  </UForm>
</template>
