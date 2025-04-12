<script setup>
useSeoMeta({
  title: "Settings",
  ogTitle: "Settings",
  description: "Customize your account and app preferences.",
  ogDescription: "Change settings to suit your needs.",
});
const darkMode = ref(false);

const themes = [
  { value: "light", label: "Light", icon: "mdi:white-balance-sunny" },
  { value: "dark", label: "Dark", icon: "mdi:weather-night" },
];

const colorMode = useColorMode();

// Find current theme
const currentTheme = computed(() =>
  themes.find((theme) => theme.value === colorMode.preference)
);

// Toggle theme when button clicked
const toggleTheme = () => {
  colorMode.preference = colorMode.preference === "light" ? "dark" : "light";
};

const notifications = ref({
  email: true,
  sms: false,
  push: true,
});

const items = [
  {
    key: "appearance",
    label: "Appearance",
    description:
      "Make changes to your appearance here. Click save when you're done.",
  },
  {
    key: "notifications",
    label: "Notifications",
    description: "Change your notifications here.",
  },
];
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Settings</h1>
    </div>

    <UTabs :items="items" class="w-full">
      <template #item="{ item }">
        <UCard>
          <template #header>
            <p
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              {{ item.label }}
            </p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ item.description }}
            </p>
          </template>

          <div v-if="item.key === 'appearance'" class="space-y-3">
            <UFormGroup label="Dark Mode">
              <UToggle
                v-model="darkMode"
                label="Enable Dark Mode"
                @click="toggleTheme"
              />
            </UFormGroup>
          </div>
          <div v-else-if="item.key === 'notifications'" class="space-y-3">
            <div>
              <UFormGroup label="Email Notifications">
                <UToggle
                  v-model="notifications.email"
                  label="Enable Email Notifications"
                />
              </UFormGroup>
              <UFormGroup label="SMS Notifications">
                <UToggle
                  v-model="notifications.sms"
                  label="Enable SMS Notifications"
                />
              </UFormGroup>
              <UFormGroup label="Push Notifications">
                <UToggle
                  v-model="notifications.push"
                  label="Enable Push Notifications"
                />
              </UFormGroup>
            </div>
          </div>
        </UCard>
      </template>
    </UTabs>
  </div>
</template>
