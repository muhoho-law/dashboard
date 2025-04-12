<script setup>
const { resetPassword, resetPasswordFormState } = useAuthentication();
const emit = defineEmits(["save", "cancel"]);

const handleSubmit = async () => {
  // let response;

  // if (resetPasswordFormState.value.id) {
  //   response = await resetPassword(
  //     resetPasswordFormState.value.id,
  //     resetPasswordFormState.value
  //   );
  // }
  // if (response.success) {
  //   emit("save", response.data);
  // }
  // emit("cancel");
};
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="profileFormState">
    <UFormGroup class="py-3" label="Current Password" name="current_password">
      <UInput v-model="resetPasswordFormState.current_password" />
    </UFormGroup>

    <UFormGroup class="py-3" label="New Password" name="password">
      <UInput v-model="resetPasswordFormState.password" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Confirm Password" name="confirm_password">
      <UInput v-model="resetPasswordFormState.confirm_password" />
    </UFormGroup>

    <div class="flex justify-end space-x-2">
      <UButton color="primary" type="submit">Save</UButton>
    </div>
  </UForm>
</template>
