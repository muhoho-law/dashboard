<script setup lang="ts">
const { createNote, updateNote, noteFormState } = useNotes();

const emit = defineEmits(["save", "cancel"]);

const userId = useHashedCookie<undefined | null | number>("b35db0c4e3bb4");

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
        (option) => option.value === noteFormState.value.case_id
      ) ?? null
    );
  },
  set(newOption) {
    noteFormState.value.case_id = newOption?.value ?? null;
  },
});

const handleSubmit = async () => {
  let response;

  if (noteFormState.value.id) {
    response = await updateNote(noteFormState.value.id, noteFormState.value);
  } else {
    noteFormState.value.author_id = userId.value
    response = await createNote(noteFormState.value);
  }

  if (response.success) {
    emit("save", response.data);
  }
  emit("cancel");
};
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="noteFormState">
    <UFormGroup class="py-3" label="Case" name="case_id">
      <USelectMenu
        v-model="selectedCase"
        :options="cases"
        placeholder="Select a case"
      />
    </UFormGroup>

    <UFormGroup class="py-3" label="title" name="title">
      <UInput v-model="noteFormState.title" />
    </UFormGroup>

    <UFormGroup class="py-3" label="content" name="content">
      <UInput v-model="noteFormState.content" />
    </UFormGroup>

    <!-- <UFormGroup class="py-3" label="Author" name="author_id">
      <UInput v-model="noteFormState.author_id" />
    </UFormGroup> -->

    <div class="flex justify-end space-x-2">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton color="primary" type="submit">Save</UButton>
    </div>
  </UForm>
</template>
