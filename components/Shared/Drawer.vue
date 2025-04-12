<script setup lang="ts">
const props = defineProps({
  title: { type: String, default: "Drawer" },
  modelValue: { type: Boolean, required: true },
  width: { type: String, default: "w-96" },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const closeDrawer = () => {
  isOpen.value = false;
};
</script>

<template>
  <USlideover v-model="isOpen" :ui="{ width }">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold">{{ title }}</h2>
          <UButton
            icon="i-heroicons-x-mark"
            variant="ghost"
            @click="closeDrawer"
          />
        </div>
      </template>

      <!-- Add this wrapper div with scrollable content -->
      <div class="overflow-y-auto max-h-[calc(100vh-10rem)]">
        <slot />
      </div>
    </UCard>
  </USlideover>
</template>
