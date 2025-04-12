<script setup>


const { updateCustomer, createCustomer, customerFormState, isEditingCustomer } =
  useCustomer();
const emit = defineEmits(["save", "cancel"]);

const handleSubmit = async () => {
  let response;

  if (isEditingCustomer.value) {
    response = await updateCustomer(
      customerFormState.value.id,
      customerFormState.value
    );
  } else {
    response = await createCustomer(customerFormState.value);
  }

  if (response.success) {
    isEditingCustomer.value = false;
  }

  await emit("cancel");
};
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="customerFormState">
    <UFormGroup class="py-3" label="Name" name="name">
      <UInput v-model="customerFormState.name" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Address" name="address">
      <UInput v-model="customerFormState.address" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Phone" name="phone">
      <UInput v-model="customerFormState.phone" type="tel" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Email" name="email">
      <UInput v-model="customerFormState.email" type="email" />
    </UFormGroup>

    <div class="flex justify-end space-x-2">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton color="primary" type="submit">Save</UButton>
    </div>
  </UForm>
</template>
