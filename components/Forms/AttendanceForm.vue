<script setup>
import { useAttendance } from "@/composables/useAttendance";


const {
  updateAttendance,
  createAttendance,
  attendanceFormState,
  isEditingAttendance,
} = useAttendance();

const emit = defineEmits(["save", "cancel"]);

const handleSubmit = async () => {
  let response;

  if (isEditingAttendance.value) {
    response = await updateAttendance(
      attendanceFormState.value.id,
      attendanceFormState.value
    );
  } else {
    response = await createAttendance(attendanceFormState.value);
  }

  if (response.success) {
    isEditingAttendance.value = false;
  }

  await emit("cancel");
};
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="attendanceFormState">
    <UFormGroup class="py-3" label="Date" name="date">
      <UInput v-model="attendanceFormState.date" type="date" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Check-In" name="check_in">
      <UInput v-model="attendanceFormState.check_in" type="time" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Check-Out" name="check_out">
      <UInput v-model="attendanceFormState.check_out" type="time" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Notes" name="notes">
      <UTextarea v-model="attendanceFormState.notes" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Employee ID" name="employee_id">
      <UInput v-model="attendanceFormState.employee_id" />
    </UFormGroup>

    <div class="flex justify-end space-x-2">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton color="primary" type="submit">Save</UButton>
    </div>
  </UForm>
</template>
