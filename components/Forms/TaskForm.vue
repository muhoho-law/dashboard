<script setup lang="ts">
const { createTask, updateTask, taskFormState } = useTask();
const emit = defineEmits(["save", "cancel"]);

const toast = useToast();

const { getAllUsers } = useUsers();

const handleSubmit = async () => {
  let response;

  if (taskFormState.value.id) {
    response = await updateTask(taskFormState.value.id, taskFormState.value);
  } else {
    response = await createTask(taskFormState.value);
  }

  if (response.success) {
    emit("save", response.data);
  }
  emit("cancel");
};

const priorityLevels = ref(["High", "Medium", "Low"]);

const statusLevels = ref(["Draft", "In Progress", "Completed"]);

const clientOptions = ref<{ label: string; value: string }[]>([]);
const fetchUsers = async () => {
  try {
    const usersResponse = await getAllUsers();
    // Adjust filtering logic based on your backend data structure
    clientOptions.value = usersResponse.map((user: any) => ({
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

// Computed binding for Client selection
const selectedClient = computed({
  get() {
    return (
      clientOptions.value.find(
        (option) => option.value === taskFormState.value.assigned_to
      ) || null
    );
  },
  set(newOption) {
    taskFormState.value.assigned_to = newOption ? newOption.value : null;
  },
});

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="taskFormState">
    <UFormGroup class="py-3" label="Title" name="title">
      <UInput v-model="taskFormState.title" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Description" name="description">
      <UInput v-model="taskFormState.description" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Priority" name="priority">
      <USelectMenu
        v-model="taskFormState.priority"
        :options="priorityLevels"
        placeholder="Select Priority"
        searchable
      />
    </UFormGroup>

    <UFormGroup class="py-3" label="Due Date" name="due_date">
      <UInput v-model="taskFormState.due_date" type="date" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Status" name="status">
      <USelectMenu
        v-model="taskFormState.status"
        :options="statusLevels"
        placeholder="Select Status"
        searchable
      />
    </UFormGroup>

    <UFormGroup class="py-3" label="Assign to" name="assigned_to">
      <USelectMenu
        v-model="selectedClient"
        :options="clientOptions"
        placeholder="Assign to "
      />
    </UFormGroup>

    <div class="flex justify-end space-x-2">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton color="primary" type="submit">Save</UButton>
    </div>
  </UForm>
</template>
