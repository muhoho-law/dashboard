<script setup lang="ts">
import { createClient } from "@supabase/supabase-js";

definePageMeta({
  layout: "blank",
});

useSeoMeta({
  title: "Reset Password",
  ogTitle: "Reset Password",
  description: "",
  ogDescription: "",
});

const toast = useToast();
const config = useRuntimeConfig();
const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey!
);
const route = useRoute();
const router = useRouter();

const token = ref("");
const errorMessage = ref("");
const newPassword = ref("");

onMounted(() => {
  const hashParams = new URLSearchParams(window.location.hash.substring(1)); // Remove '#'
  token.value = hashParams.get("access_token") || "";

  if (!token.value) {
    errorMessage.value = "Invalid or missing reset token.";
    toast.error(errorMessage.value);
  }
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md text-center">
      <UCard>
        <!-- Logo -->
        <div class="mb-6">
          <img
            src="/images/logo-icon.png"
            class="h-10 w-10"
            alt="MitteRx Logo"
          />
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          Reset your password
        </h2>
        <p class="text-sm text-gray-500 mb-6">Let's help you get back</p>

        <div v-if="errorMessage" class="mt-4 text-red-500 text-center">
          {{ errorMessage }}
          <NuxtLink to="/forgot-password" class="text-blue-500"
            >Request a new link</NuxtLink
          >
        </div>

        <!--  Form -->
        <FormsAuthResetPasswordForm />
      </UCard>
    </div>
  </div>
</template>
