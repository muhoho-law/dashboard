<script setup>
useSeoMeta({
  title: "Attendance",
  ogTitle: "Attendance",
  description: "Track employee attendance and work shifts.",
  ogDescription: "View real-time attendance data and shift records.",
});

const {
  attendance,
  getAllattendance,
  getSingleAttendance,
  deleteAttendance,
  attendanceFormState,
  isEditingAttendance,
} = useAttendance();

const isDrawerOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedAttendanceId = ref(null);

await getAllattendance();

const columns = ref([
  { key: "id", label: "ID", sortable: true },
  { key: "date", label: "Date" },
  { key: "check_in", label: "Check-In" },
  { key: "check_out", label: "Check-Out" },
  { key: "notes", label: "Notes" },
  { key: "employee_id", label: "Employee ID" },
]);

const openEditDrawer = async (id) => {
  isEditingAttendance.value = true;
  selectedAttendanceId.value = id;
  isDrawerOpen.value = true;

  const { data } = await getSingleAttendance(id);
  if (data) {
    attendanceFormState.value = { ...data };
  }
};

const refreshattendance = async () => {
  isDrawerOpen.value = false;
  await getAllattendance();
};

const confirmDelete = (id) => {
  selectedAttendanceId.value = id;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (selectedAttendanceId.value) {
    await deleteAttendance(selectedAttendanceId.value);
    await getAllattendance();
  }
  isDeleteModalOpen.value = false;
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Attendance Records</h1>
      <UButton color="primary" @click="isDrawerOpen = true">
        Add Attendance
      </UButton>
    </div>

    <UCard>
      <SharedDatagrid :columns="columns" :rows="attendance">
        <template #actions="{ row }">
          <div>
            <UButton
              icon="mdi:pencil"
              size="xs"
              @click="openEditDrawer(row.id)"
            />
            <UButton
              icon="mdi:trash-can"
              color="red"
              size="xs"
              @click="confirmDelete(row.id)"
            />
          </div>
        </template>
      </SharedDatagrid>
    </UCard>

    <SharedDrawer v-model="isDrawerOpen" title="Edit Attendance">
      <FormsAttendanceForm @cancel="refreshattendance" />
    </SharedDrawer>

    <SharedModal
      :show="isDeleteModalOpen"
      message="Are you sure you want to delete this attendance record?"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
