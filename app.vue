<script setup>
definePageMeta({
  colorMode: "dark",
});

const isOffline = ref(false);

onMounted(() => {
  window.addEventListener("offline", () => (isOffline.value = true));
  window.addEventListener("online", () => (isOffline.value = false));
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator></NuxtLoadingIndicator>
      <NuxtPage />
      <UNotifications />
    </NuxtLayout>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&display=swap");

* {
  font-family: "Plus Jakarta Sans", sans-serif;
}
</style>
