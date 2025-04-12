<script setup>

const {
  updateAppointment,
  createAppointment,
  appointmentFormState,
  isEditingAppointment,
} = useAppointment();

const emit = defineEmits(["save", "cancel"]);

const handleSubmit = async () => {
  let response;

  if (isEditingAppointment.value) {
    response = await updateAppointment(
      appointmentFormState.value.id,
      appointmentFormState.value
    );
  } else {
    response = await createAppointment(appointmentFormState.value);
  }

  if (response.success) {
    isEditingAppointment.value = false;
  }

  await emit("cancel");
};
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="appointmentFormState">
    <UFormGroup class="py-3" label="User ID" name="user_id">
      <UInput
        v-model="appointmentFormState.user_id"
        placeholder="Enter User ID"
      />
    </UFormGroup>

    <UFormGroup class="py-3" label="Organization ID" name="organization_id">
      <UInput
        v-model="appointmentFormState.organization_id"
        type="number"
        placeholder="Enter Organization ID"
      />
    </UFormGroup>

    <UFormGroup class="py-3" label="Date" name="date">
      <UInput v-model="appointmentFormState.date" type="date" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Time" name="time">
      <UInput v-model="appointmentFormState.time" type="time" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Status" name="status">
      <USelect
        v-model="appointmentFormState.status"
        :options="['Scheduled', 'Completed', 'Cancelled', 'Pending']"
        placeholder="Select Status"
      />
    </UFormGroup>

    <UFormGroup class="py-3" label="Notes" name="notes">
      <UTextarea
        v-model="appointmentFormState.notes"
        placeholder="Additional notes"
      />
    </UFormGroup>

    <div class="flex justify-end space-x-2">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton color="primary" type="submit">Save</UButton>
    </div>
  </UForm>
</template>
