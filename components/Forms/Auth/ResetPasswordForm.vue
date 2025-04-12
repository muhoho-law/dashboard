<script setup lang="ts">
definePageMeta({ layout: "blank" });

const { resetPasswordFormState, isLoading, resetPassword } =
  useAuthentication();
</script>

<template>
  <div>
    <UForm @submit="resetPassword">
      <UFormGroup label="Password">
        <UInput
          v-model="resetPasswordFormState.password"
          placeholder="Enter your new password"
          required
        />
      </UFormGroup>

      <UFormGroup class="py-3">
        <UButton type="submit" :loading="isLoading" :disabled="isLoading"
          >Submit</UButton
        >
      </UFormGroup>
    </UForm>
  </div>
</template>
