<script setup>
useSeoMeta({
  title: "Tasks",
  ogTitle: "Tasks",
  description: "View and manage task transactions.",
  ogDescription: "Stay updated with all incoming and outgoing tasks.",
});

const {
  tasks,
  getAllTasks,
  getSingleTask,
  deleteTask,
  taskFormState,
  isEditingTask,
} = useTask();

const isDrawerOpen = ref(false);

const isDeleteModalOpen = ref(false);

const selectedTaskId = ref(null);

const response = await getAllTasks();

const columns = ref([
  { key: "id", label: "ID", sortable: true },
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "priority", label: "Priority" },
  { key: "due_date", label: "Due Date" },
  { key: "status", label: "Status" },
  { key: "users.full_name", label: "Assigned To" },
]);

const openEditDrawer = async (id) => {
  isEditingTask.value = true;
  selectedTaskId.value = id;
  isDrawerOpen.value = true;

  // Fetch the task data and update the form state
  const { data } = await getSingleTask(id);
  if (data) {
    taskFormState.value = { ...data };
  }
};

const refreshTasks = async () => {
  isDrawerOpen.value = false;
  await getAllTasks();
};

const confirmDelete = (id) => {
  selectedTaskId.value = id;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (selectedTaskId.value) {
    await deleteTask(selectedTaskId.value);
    await getAllTasks(); // Refresh list after deletion
  }
  isDeleteModalOpen.value = false;
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Tasks</h1>
      <UButton color="primary" @click="isDrawerOpen = true"> Add Task </UButton>
    </div>

    <UCard>
      <SharedDatagrid :columns="columns" :rows="tasks">
        <template #actions="{ row }">
          <div class="flex space-x-2">
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

        <template #status="{ row }">
          <UBadge
            v-if="row.status === 'Active' || row.status === 'active'"
            color="green"
          >
            {{ row.status }}
          </UBadge>

          <UBadge
            v-else-if="row.status === 'Inactive' || row.status === 'inactive'"
            color="red"
          >
            {{ row.status }}
          </UBadge>
        </template>
      </SharedDatagrid>
    </UCard>

    <SharedDrawer v-model="isDrawerOpen" title="Edit Task">
      <FormsTaskForm @cancel="refreshTasks" />
    </SharedDrawer>

    <SharedModal
      :show="isDeleteModalOpen"
      message="Are you sure you want to delete this task?"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
