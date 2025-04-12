<script setup>
const props = defineProps({
  show: Boolean, // Controls modal visibility
  message: {
    type: String,
    default: "Are you sure you want to delete this item?",
  },
});

const emit = defineEmits(["confirm", "close"]);
</script>

<template>
  <UModal v-model="props.show">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Confirm Delete</h3>
      </template>

      <p class="text-gray-600">{{ message }}</p>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" @click="emit('close')">Cancel</UButton>
          <UButton color="red" @click="emit('confirm')">Delete</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
