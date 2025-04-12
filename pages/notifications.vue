<script setup lang="ts">
useSeoMeta({
  title: "Notifications",
  ogTitle: "Notifications",
  description: "View and manage system notifications.",
  ogDescription: "Manage notification messages, status, and timestamps.",
});

const {
  notifications,
  getAllNotifications,
  getAllUserNotifications,
  getSingleNotification,
  deleteNotification,
  notificationFormState,
  isEditingNotification,
} = useNotification();

const isDrawerOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedNotificationId = ref(null);
const useListView = ref(true); // Toggle between grid & list views

const userId = useHashedCookie<undefined | null | number>("b35db0c4e3bb4");
const userRole = useHashedCookie<string | null | undefined>("aa05f44d53a34");

let response;

if (userRole.value === "patient") {
  response = await getAllUserNotifications(userId.value);
} else {
  response = await getAllNotifications();
}

// Define table columns for list view
const columns = ref([
  { key: "id", label: "ID", sortable: true },
  { key: "message", label: "Message" },
  { key: "type", label: "Type" },
  { key: "status", label: "Status" },
  { key: "date", label: "Date" },
]);

// Open edit drawer
const openEditDrawer = async (id) => {
  isEditingNotification.value = true;
  selectedNotificationId.value = id;
  isDrawerOpen.value = true;

  const { data } = await getSingleNotification(id);
  if (data) {
    notificationFormState.value = { ...data };
  }
};

// Refresh notification list
const refreshNotifications = async () => {
  isDrawerOpen.value = false;
  await getAllNotifications();
};

// Confirm delete modal
const confirmDelete = (id) => {
  selectedNotificationId.value = id;
  isDeleteModalOpen.value = true;
};

// Handle deletion
const handleDelete = async () => {
  if (selectedNotificationId.value) {
    await deleteNotification(selectedNotificationId.value);
    await getAllNotifications();
  }
  isDeleteModalOpen.value = false;
};

const notificationStatusColors = {
  high: "red",
  medium: "yellow",
  low: "green",
};

const notificationTypeColors = {
  info: "blue",
  message: "purple",
  alert: "red",
  reminder: "orange",
  update: "cyan",
};
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Notifications</h1>
    </div>

    <!-- View Toggle -->
    <div class="flex justify-end mb-4 space-x-2">
      <UButton
        :color="useListView ? 'gray' : 'primary'"
        @click="useListView = false"
      >
        <Icon name="lucide-grid" class="w-5 h-5 mr-2" /> Grid
      </UButton>

      <UButton
        :color="useListView ? 'primary' : 'gray'"
        @click="useListView = true"
      >
        <Icon name="lucide-list" class="w-5 h-5 mr-2" /> List
      </UButton>
    </div>

    <!-- List View -->
    <UCard v-if="useListView">
      <SharedDatagrid :columns="columns" :rows="notifications">
        <template #actions="{ row }">
          <div class="flex space-x-2">
            <!-- <UButton
              icon="i-heroicons-pencil"
              size="xs"
              @click="openEditDrawer(row.id)"
            /> -->
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
          <UBadge :color="notificationStatusColors[row.status] || 'gray'">
            {{ row.status }}
          </UBadge>
        </template>

        <!-- Type Column -->
        <template #type="{ row }">
          <UBadge :color="notificationTypeColors[row.type] || 'gray'">
            {{ row.type }}
          </UBadge>
        </template>
      </SharedDatagrid>
    </UCard>

    <!-- Grid View -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <CardsNotificationCard
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
      >
        <template #actions>
          <div class="flex justify-end space-x-2">
            <!-- <UButton
              color="primary"
              variant="solid"
              size="sm"
              icon="lucide-pencil"
              @click="openEditDrawer(notification.id)"
            /> -->
            <UButton
              color="red"
              variant="solid"
              size="sm"
              icon="lucide-trash"
              @click="confirmDelete(notification.id)"
            />
          </div>
        </template>
      </CardsNotificationCard>
    </div>

    <!-- Edit Drawer -->
    <SharedDrawer v-model="isDrawerOpen" title="Edit Notification">
      <FormsNotificationsForm @cancel="refreshNotifications" />
    </SharedDrawer>

    <!-- Delete Confirmation Modal -->
    <SharedModal
      :show="isDeleteModalOpen"
      message="Are you sure you want to delete this notification?"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
