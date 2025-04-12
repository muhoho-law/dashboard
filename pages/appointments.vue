<script setup lang="ts">
useSeoMeta({
  title: "Appointments",
  ogTitle: "Appointments",
  description: "View and manage appointments.",
  ogDescription: "Keep track of scheduled appointments.",
});

const {
  appointments,
  getAllAppointments,
  getSingleAppointment,
  getAllPatientAppointments,
  deleteAppointment,
  appointmentFormState,
  isEditingAppointment,
} = useAppointment();

const isDrawerOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedAppointmentId = ref(null);
const searchQuery = ref("");

const userId = useHashedCookie<undefined | null | number>("b35db0c4e3bb4");
const userRole = useHashedCookie<string | null | undefined>("aa05f44d53a34");

let response;

if (userRole.value === "patient") {
  response = await getAllPatientAppointments(userId.value);
} else {
  response = await getAllAppointments();
}

const useListView = ref(true);

// Define table columns
const columns = ref([
  { key: "id", label: "ID", sortable: true },
  { key: "title", label: "Title" },
  { key: "status", label: "Status" },
  { key: "description", label: "Description" },
  { key: "date", label: "Date" },
  { key: "time", label: "Time" },
  { key: "location", label: "Location" },
]);

// Open edit drawer
const openEditDrawer = async (id) => {
  isEditingAppointment.value = true;
  selectedAppointmentId.value = id;
  isDrawerOpen.value = true;

  const { data } = await getSingleAppointment(id);
  if (data) {
    appointmentFormState.value = { ...data };
  }
};

// Refresh appointment list
const refreshAppointments = async () => {
  isDrawerOpen.value = false;
  await getAllAppointments();
};

// Confirm delete modal
const confirmDelete = (id) => {
  selectedAppointmentId.value = id;
  isDeleteModalOpen.value = true;
};

// Handle deletion
const handleDelete = async () => {
  if (selectedAppointmentId.value) {
    await deleteAppointment(selectedAppointmentId.value);
    await getAllAppointments();
  }
  isDeleteModalOpen.value = false;
};

const statusLevels = ref(["Confirmed", "Pending", "Cancelled"]);

// Define colors dynamically based on severity level
const statusColors = {
  Confirmed: "green",
  Pending: "yellow",
  Cancelled: "red",
};
</script>

<template>
  <div>
    <SharedTitleBar
      title="Appointments"
      :searchQuery="searchQuery"
      @update:searchQuery="searchQuery = $event"
      :useListView="useListView"
      @update:useListView="useListView = $event"
      addButtonLabel="Add Appointment"
      @add="isDrawerOpen = true"
    />

    <!-- List View -->
    <UCard v-if="useListView">
      <SharedDatagrid :columns="columns" :rows="appointments">
        <template #actions="{ row }">
          <div class="flex space-x-2">
            <UButton
              icon="i-heroicons-pencil"
              size="xs"
              @click="openEditDrawer(row.id)"
            />
            <UButton
              icon="i-heroicons-trash"
              color="red"
              size="xs"
              @click="confirmDelete(row.id)"
            />
          </div>
        </template>

        <!-- Status Column -->
        <template #status="{ row }">
          <UBadge :color="statusColors[row.status] || 'gray'">
            {{ row.status }}
          </UBadge>
        </template>
      </SharedDatagrid>
    </UCard>

    <!-- Grid View -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <CardsAppointmentCard
        v-for="appointment in appointments"
        :key="appointment.id"
        :appointment="appointment"
      >
        <template #actions>
          <div class="flex justify-end space-x-2">
            <UButton
              color="primary"
              variant="solid"
              size="sm"
              icon="lucide-pencil"
              @click="openEditDrawer(appointment.id)"
            />
            <UButton
              color="red"
              variant="solid"
              size="sm"
              icon="lucide-trash"
              @click="confirmDelete(appointment.id)"
            />
          </div>
        </template>
      </CardsAppointmentCard>
    </div>

    <!-- Edit Drawer -->
    <SharedDrawer v-model="isDrawerOpen" title="Edit Appointment">
      <FormsAppointmentsForm @cancel="refreshAppointments" />
    </SharedDrawer>

    <!-- Delete Confirmation Modal -->
    <SharedModal
      :show="isDeleteModalOpen"
      message="Are you sure you want to delete this appointment?"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
