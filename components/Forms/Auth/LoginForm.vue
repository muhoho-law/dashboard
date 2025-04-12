<script setup lang="ts">
definePageMeta({ layout: "blank" });

useSeoMeta({
  title: "Login",
  ogTitle: "Login",
});
const { loginFormState, isLoading, login } = useAuthentication();
</script>

<template>
  <div>
    <UForm :state="loginFormState" class="mt-4 space-y-4" @submit="login">
      <UFormGroup label="Email" name="email">
        <UInput v-model="loginFormState.email" placeholder="Enter your email" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput
          v-model="loginFormState.password"
          type="password"
          placeholder="Enter your password"
        />
      </UFormGroup>

      <div class="flex justify-between text-xs py-1 text-primary">
        <NuxtLink to="/forgot-password" class="hover:underline"
          >Forgot Password?</NuxtLink
        >
      </div>

      <UButton
        type="submit"
        :loading="isLoading"
        :disabled="isLoading"
        color="primary"
        block
      >
        Sign In
      </UButton>
    </UForm>
  </div>
</template>
