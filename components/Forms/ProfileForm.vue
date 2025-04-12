<script setup>
const { updateUser, profileFormState } = useProfile();

const emit = defineEmits(["save", "cancel"]);

const userRole = useHashedCookie("aa05f44d53a34");

const handleSubmit = async () => {
  let response;

  if (profileFormState.value.id) {
    response = await updateUser(
      profileFormState.value.id,
      profileFormState.value
    );
  }
  if (response.success) {
    emit("save", response.data);
  }
  emit("cancel");
};
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="profileFormState">
    <UFormGroup class="py-3" label="Full name" name="full_name">
      <UInput v-model="profileFormState.full_name" disabled />
    </UFormGroup>

    <UFormGroup class="py-3" label="Username" name="username">
      <UInput v-model="profileFormState.username" disabled />
    </UFormGroup>

    <UFormGroup class="py-3" label="Email" name="email">
      <UInput v-model="profileFormState.email" disabled />
    </UFormGroup>

    <UFormGroup class="py-3" label="Phone Number" name="phone_number">
      <UInput v-model="profileFormState.phone_number" disabled />
    </UFormGroup>

    <UFormGroup class="py-3" label="Role" name="role">
      <UInput v-model="profileFormState.role" disabled />
    </UFormGroup>

    <div class="flex justify-end space-x-2">
      <UButton color="primary" type="submit">Save</UButton>
    </div>
  </UForm>
</template>
