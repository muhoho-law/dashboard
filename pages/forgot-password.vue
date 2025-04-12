<script setup lang="ts">
definePageMeta({
  layout: "blank",
});

useSeoMeta({
  title: "Forgot Password",
  ogTitle: "Forgot Password",
  description: "",
  ogDescription: "",
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md text-center">
      <UCard>
        <!-- Logo -->
        <div class="mb-6">
          <img
            src="/la-logo.png"
            class="h-10 w-10"
            alt="MitteRx Logo"
          />
        </div>

        <h2 class="text-2xl font-bold text-gray mb-2">Forgot Password?</h2>
        <p class="text-sm text-gray-500 mb-6">Let's help you get back</p>

        <!--  Form -->
        <FormsAuthForgotPasswordForm />
      </UCard>
    </div>
  </div>
</template>
