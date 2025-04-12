<script setup lang="ts">
// Composables for case operations and user data
const { updateCase, createCase, caseFormState, isEditingCase } = useCase();
const { getAllUsers } = useUsers();
const toast = useToast();

// Emits for handling events
const emit = defineEmits(["save", "cancel"]);

// Option arrays for USelectMenu fields
const caseStageOptions = ref([
  { label: "Investigation", value: "investigation" },
  { label: "Discovery", value: "discovery" },
  { label: "Trial", value: "trial" },
  { label: "Closed", value: "closed" },
]);

const statusOptions = ref([
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
]);

const caseTypeOptions = ref([
  { label: "Civil", value: "civil" },
  { label: "Criminal", value: "criminal" },
]);

const billingStatusOptions = ref([
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Overdue", value: "overdue" },
]);

// Client and Lead Lawyer options fetched from the backend
const clientOptions = ref<{ label: string; value: string }[]>([]);
const leadLawyerOptions = ref<{ label: string; value: string }[]>([]);

const fetchUsers = async () => {
  try {
    const usersResponse = await getAllUsers();
    // Adjust filtering logic based on your backend data structure
    clientOptions.value = usersResponse
      .filter((user: any) => user.role === "client")
      .map((user: any) => ({
        label: user.full_name,
        value: user.id,
      }));
    leadLawyerOptions.value = usersResponse
      .filter((user: any) => user.role === "lawyer")
      .map((user: any) => ({
        label: user.full_name,
        value: user.id,
      }));
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.add({
      title: "Error",
      description: "Failed to load user options.",
      color: "red",
      id: "user-fetch-error",
    });
  }
};

onMounted(() => {
  fetchUsers();
});

// Computed binding for Client selection
const selectedClient = computed({
  get() {
    return (
      clientOptions.value.find(
        (option) => option.value === caseFormState.value.client_id
      ) || null
    );
  },
  set(newOption) {
    caseFormState.value.client_id = newOption ? newOption.value : null;
  },
});

// Computed binding for Lead Lawyer selection
const selectedLeadLawyer = computed({
  get() {
    return (
      leadLawyerOptions.value.find(
        (option) => option.value === caseFormState.value.lead_lawyer_id
      ) || null
    );
  },
  set(newOption) {
    caseFormState.value.lead_lawyer_id = newOption ? newOption.value : null;
  },
});

// Prepares the final payload according to backend requirements
const preparePayload = () => {
  const form = caseFormState.value;
  return {
    case_number: form.case_number,
    // Rename case_title to title
    title: form.case_title,
    // Extract the value from the object fields
    case_stage: form.case_stage?.value || null,
    status: form.status?.value || null,
    case_type: form.case_type?.value || null,
    client_id: form.client_id,
    description: form.description,
    lead_lawyer_id: form.lead_lawyer_id,
    filed_date: form.filed_date,
    opposing_party: form.opposing_party,
    opposing_lawyer: form.opposing_lawyer,
    billing_status: form.billing_status?.value || null,
  };
};

// Handle form submission and send the payload
const handleSubmit = async () => {
  const payload = preparePayload();

  let response;
  if (isEditingCase.value) {
    // Assumes payload.id exists for editing; adjust as needed
    response = await updateCase(caseFormState.value.id, payload);
  } else {
    response = await createCase(payload);
  }
  if (response.success) {
    isEditingCase.value = false;
    toast.add({
      title: "Success",
      description: "Case saved successfully!",
      color: "green",
      id: "case-save-success",
    });
  } else {
    toast.add({
      title: "Error",
      description: "There was a problem saving the case.",
      color: "red",
      id: "case-save-error",
    });
  }
  emit("cancel");
};
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="caseFormState">
    <UFormGroup class="py-3" label="Case Number" name="case_number">
      <UInput v-model="caseFormState.case_number" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Case Title" name="case_title">
      <UInput v-model="caseFormState.case_title" />
    </UFormGroup>

    <!-- Case Stage -->
    <UFormGroup class="py-3" label="Case Stage" name="case_stage">
      <USelectMenu
        v-model="caseFormState.case_stage"
        :options="caseStageOptions"
        placeholder="Select Case Stage"
      />
    </UFormGroup>

    <!-- Status -->
    <UFormGroup class="py-3" label="Status" name="status">
      <USelectMenu
        v-model="caseFormState.status"
        :options="statusOptions"
        placeholder="Select Status"
      />
    </UFormGroup>

    <!-- Case Type -->
    <UFormGroup class="py-3" label="Case Type" name="case_type">
      <USelectMenu
        v-model="caseFormState.case_type"
        :options="caseTypeOptions"
        placeholder="Select Case Type"
      />
    </UFormGroup>

    <!-- Client -->
    <UFormGroup class="py-3" label="Client" name="client_id">
      <USelectMenu
        v-model="selectedClient"
        :options="clientOptions"
        placeholder="Select a Client"
      />
    </UFormGroup>

    <UFormGroup class="py-3" label="Description" name="description">
      <UTextarea v-model="caseFormState.description" />
    </UFormGroup>

    <!-- Lead Lawyer -->
    <UFormGroup class="py-3" label="Lead Lawyer" name="lead_lawyer_id">
      <USelectMenu
        v-model="selectedLeadLawyer"
        :options="leadLawyerOptions"
        placeholder="Select a Lead Lawyer"
      />
    </UFormGroup>

    <UFormGroup class="py-3" label="Opposing Lawyer" name="opposing_lawyer">
      <UInput v-model="caseFormState.opposing_lawyer" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Filed Date" name="filed_date">
      <UInput v-model="caseFormState.filed_date" type="date" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Opposing Party" name="opposing_party">
      <UInput v-model="caseFormState.opposing_party" />
    </UFormGroup>

    <!-- Billing Status -->
    <UFormGroup class="py-3" label="Billing Status" name="billing_status">
      <USelectMenu
        v-model="caseFormState.billing_status"
        :options="billingStatusOptions"
        placeholder="Select Billing Status"
      />
    </UFormGroup>

    <div class="flex justify-end space-x-2">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton color="primary" type="submit">Save</UButton>
    </div>
  </UForm>
</template>
