<script setup lang="ts">
definePageMeta({ layout: "blank" });

useSeoMeta({
  title: "Login",
  ogTitle: "Login",
});
const { registerFormState } = useAuthentication();

const route = useRoute();

const emit = defineEmits(["submit"]);

const agreeToTerms = ref(false);
</script>

<template>
  <UForm :state="registerFormState">
    <UFormGroup class="py-3" label="Full name" name="full_name" required>
      <UInput v-model="registerFormState.full_name" />
    </UFormGroup>

    <UFormGroup
      required
      class="py-3"
      label="Email"
      name="email"
      type="email"
      trailing-icon="i-lucide-at-sign"
    >
      <UInput v-model="registerFormState.email" />
    </UFormGroup>

    <UFormGroup required class="py-3" label="Phone Number" name="phone_number">
      <UInput v-model="registerFormState.phone_number" />
    </UFormGroup>

    <UFormGroup required class="py-3" label="Password" name="password">
      <UInput v-model="registerFormState.password" />
    </UFormGroup>

    <UFormGroup v-if="route.params?.type === 'individual'" class="py-3">
      <UCheckbox v-model="agreeToTerms" required>
        <template #label>
          I agree to the
          <NuxtLink
            to="https://mitterx.co.ke/terms"
            target="_blank"
            class="text-blue-500 underline"
          >
            Terms and Conditions
          </NuxtLink>
        </template>
      </UCheckbox>
    </UFormGroup>
  </UForm>
</template>
