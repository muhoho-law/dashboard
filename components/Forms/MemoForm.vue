<script setup lang="ts">
import { onMounted, ref } from "vue";

const { createMemo, updateMemo, memoFormState } = useMemos();

const emit = defineEmits(["save", "cancel"]);

const { getAllCases } = useCase();

const cases = ref<{ id: number; name: string }[]>([]); // or whatever your case structure is

onMounted(async () => {
  const response = await getAllCases();

  cases.value = response.map((c: any) => ({
    label: c.title || `Case #${c.id}`, // adjust this depending on your case fields
    value: c.id,
  }));
});

// Computed binding that syncs selected case ID to full option and vice versa
const selectedCase = computed({
  get() {
    return (
      cases.value.find(
        (option) => option.value === memoFormState.value.case_id
      ) ?? null
    );
  },
  set(newOption) {
    memoFormState.value.case_id = newOption?.value ?? null;
  },
});

const handleSubmit = async () => {
  let response;

  if (memoFormState.value.id) {
    response = await updateMemo(memoFormState.value.id, memoFormState.value);
  } else {
    response = await createMemo();
  }

  if (response.success) {
    emit("save", response.data);
  }
  emit("cancel");
};

// const statusLevels = ref(["Draft", "In Progress", "Completed"]);

const priorityLevels = ref(["High", "Medium", "Low"]);

const visibilityLevels = ref(["Internal", "Client"]);
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="memoFormState">
    <UFormGroup class="py-3" label="Case" name="case_id">
      <USelectMenu
        v-model="selectedCase"
        :options="cases"
        placeholder="Select a case"
      />
    </UFormGroup>

    <!-- <UFormGroup class="py-3" label="Author" name="author_id">
      <UInput v-model="memoFormState.author_id" />
    </UFormGroup> -->

    <UFormGroup class="py-3" label="Title" name="title">
      <UInput v-model="memoFormState.title" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Content" name="content">
      <UTextarea v-model="memoFormState.content" />
    </UFormGroup>

    <!-- <UFormGroup class="py-3" label="Status" name="status">
      <USelectMenu
        v-model="memoFormState.status"
        :options="statusLevels"
        placeholder="Select Status"
        searchable
      />
    </UFormGroup> -->

    <UFormGroup class="py-3" label="Priority" name="priority">
      <USelectMenu
        v-model="memoFormState.priority"
        :options="priorityLevels"
        placeholder="Select Priority"
        searchable
      />
    </UFormGroup>

    <UFormGroup class="py-3" label="Visibility" name="visibility">
      <USelectMenu
        v-model="memoFormState.visibility"
        :options="visibilityLevels"
        placeholder="Select Visibility"
        searchable
      />
    </UFormGroup>

    <!-- <UFormGroup class="py-3" label="Tags" name="tags">
      <UInput v-model="memoFormState.tags" />
    </UFormGroup> -->

    <div class="flex justify-end space-x-2">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton color="primary" type="submit">Save</UButton>
    </div>
  </UForm>
</template>
