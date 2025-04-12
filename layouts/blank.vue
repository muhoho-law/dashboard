<script setup lang="ts">
const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
];
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Navbar -->
    <NavigationAuthHeader class="p-6" />

    <!-- Page Content -->
    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>
