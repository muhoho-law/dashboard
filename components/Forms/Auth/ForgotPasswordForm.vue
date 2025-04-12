<script setup lang="ts">
definePageMeta({ layout: "blank" });

const { forgotPasswordFormState, isLoading, forgotPassword } =
  useAuthentication();
</script>

<template>
  <div>
    <UForm @submit="forgotPassword">
      <UFormGroup label="Email">
        <UInput v-model="forgotPasswordFormState.email" type="email" required />
      </UFormGroup>

      <UFormGroup class="py-3">
        <UButton type="submit" :loading="isLoading" :disabled="isLoading"
          >Send Reset Email</UButton
        >
      </UFormGroup>
    </UForm>
  </div>
</template>
