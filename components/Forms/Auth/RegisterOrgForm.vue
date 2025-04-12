<script setup>
const route = useRoute()

const { orgRegistrationFormState } = useOrganization();

const emit = defineEmits(["save", "cancel"]);

const agreeToTerms = ref(false);

const employeeOptions = ref(["1-5", "6-10", "11-20", "21-30", "31-50", "50+"]);

const organizationTypes = [
  {
    name: "Pharmacy",
    description: "Dispense medicine to patients.",
    link: "/register/pharmacy",
    icon: "i-mdi-pill",
  },
  {
    name: "Hospital",
    description: "Provide comprehensive medical care.",
    link: "/register/hospital",
    icon: "i-mdi-hospital-building",
  },
  {
    name: "Clinic",
    description: "Offer outpatient care and medicine.",
    link: "/register/clinic",
    icon: "i-mdi-stethoscope",
  },
  {
    name: "Community Health Center",
    description: "Support community healthcare needs.",
    link: "/register/community-health-center",
    icon: "i-mdi-hospital-marker",
  },
];

const selectedOrganization = computed(() => {
  return organizationTypes.find((org) => org.link === route.path)?.name || "";
});

orgRegistrationFormState.value.organization_type = selectedOrganization.value;
</script>

<template>
  <UForm :state="orgRegistrationFormState">
    <UFormGroup class="py-3" label="Name" name="name" required>
      <UInput
        v-model="orgRegistrationFormState.name"
        placeholder="Enter Organization Name"
      />
    </UFormGroup>

    <UFormGroup
      class="py-3"
      label="Employees Range"
      name="employees_range"
      required
    >
      <!-- <UInput
        v-model="orgRegistrationFormState.employees_range"
        placeholder="E.g. 10-50, 100-500"
      /> -->
      <USelectMenu
        v-model="orgRegistrationFormState.employees_range"
        :options="employeeOptions"
        placeholder="Select employee range"
        required
      />
    </UFormGroup>

    <UFormGroup
      class="py-3"
      label="Organization Type"
      name="organization_type"
      required
    >
      <UInput v-model="orgRegistrationFormState.organization_type" disabled />
    </UFormGroup>

    <UFormGroup
      class="py-3"
      label="License Number"
      name="license_number"
      required
    >
      <UInput
        v-model="orgRegistrationFormState.license_number"
        placeholder="Enter License Number"
      />
    </UFormGroup>

    <UFormGroup class="py-3">
      <UCheckbox v-model="agreeToTerms" required>
        <template #label>
          I agree to the
          <NuxtLink
            to="https://mitterx.co.ke/terms"
            target="_blank"
            class="text-blue-500 underline"
          >
            Terms and Conditions
          </NuxtLink>
        </template>
      </UCheckbox>
    </UFormGroup>
  </UForm>
</template>
