<script setup>
const { createClient, updateClient, clientFormState } = useClient();
const emit = defineEmits(["save", "cancel"]);

const handleSubmit = async () => {
  let response;

  if (clientFormState.value.id) {
    response = await updateClient(
      clientFormState.value.id,
      clientFormState.value
    );
  } else {
    response = await createClient(clientFormState.value);
  }

  if (response.success) {
    emit("save", response.data);
  }
  emit("cancel");
};
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="clientFormState">
    <UFormGroup class="py-3" label="Name" name="name">
      <UInput v-model="clientFormState.name" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Phone" name="phone_number">
      <UInput v-model="clientFormState.phone_number" type="tel" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Email" name="email">
      <UInput v-model="clientFormState.email" type="email" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Address" name="address">
      <UInput v-model="clientFormState.address" />
    </UFormGroup>

    <div class="flex justify-end space-x-2">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton color="primary" type="submit">Save</UButton>
    </div>
  </UForm>
</template>
