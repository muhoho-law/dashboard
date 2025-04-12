<script setup lang="ts">
import { admin, lawyer, client } from "~~/components/Navigation/SidebarItems";

const commandPaletteRef = ref();

const router = useRouter();

const emit = defineEmits(["close"]);

// // Sidebar navigation items array
// const sidebarItems = [
//   {
//     section: "General",
//     items: [
//       { label: "Dashboard", icon: "mdi:home", to: "/dashboard" },
//       { label: "Employees", icon: "mdi:account-group", to: "/staff" },
//       { label: "Orders", icon: "mdi:cart", to: "/orders" },
//       { label: "Customers", icon: "mdi:account", to: "/customers" },
//       { label: "Products", icon: "mdi:package", to: "/products" },
//       { label: "Inventory", icon: "mdi:clipboard-list", to: "/inventory" },
//       { label: "Payments", icon: "mdi:credit-card", to: "/payments" },
//       { label: "Suppliers", icon: "mdi:truck", to: "/suppliers" },
//       { label: "Users", icon: "mdi:account-circle", to: "/users" },
//       {
//         label: "Attendance",
//         icon: "mdi:calendar-check", // MDI equivalent of calendar-check
//         to: "/attendance",
//       },
//       { label: "Storage", icon: "mdi:image", to: "/images-storage" },
//     ],
//   },
//   {
//     section: "Notifications",
//     items: [
//       { label: "Notifications", icon: "mdi:bell", to: "/notifications" },
//       { label: "Help", icon: "mdi:lifebuoy", to: "/dashboard/help" },
//     ],
//   },
// ];

const { auth: authAction } = useSupabaseClient();

const userRole = useHashedCookie<string | null | undefined>("aa05f44d53a34");

userRole.value = "admin";

const getSidebarItems = (role: string | null | undefined) => {
  switch (role) {
    case "admin":
      return admin;
    case "lawyer":
      return lawyer;
    case "client":
      return client;
    default:
      return []; // Empty array if role is not recognized
  }
};

const sidebarItems = computed(() => getSidebarItems(userRole.value));

const commands = [
  // Manually define shortcuts based on sidebarItems
  ...sidebarItems.value.flatMap((section) =>
    section.items.map((item) => ({
      id: item.label.toLowerCase().replace(/\s+/g, "-"), // Unique ID based on label
      label: item.label,
      icon: item.icon,
      click: () => {
        router.push(item.to); // Navigate to the respective route
        emit("close"); // Close the shortcut panel
      },
    }))
  ),
];

const groups = [
  {
    key: "shortcuts",
    label: "Shortcuts",
    inactive: "Shortcut",
    commands,
  },
];

const ui = {
  searchable: false,
  placeholder: "Search recent pages",
  wrapper:
    "flex flex-col flex-1 min-h-0 divide-y divide-gray-200 dark:divide-gray-700 bg-gray-50 dark:bg-gray-800",
  container:
    "relative flex-1 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700 scroll-py-2",
  input: {
    base: "w-full h-14 px-4 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 text-gray-900 dark:text-white focus:ring-0 focus:outline-none",
  },
  group: {
    label: "px-2 my-2 text-xs font-semibold text-gray-500 dark:text-gray-400",
    command: {
      base: "flex justify-between select-none cursor-default items-center rounded-md px-2 py-2 gap-2 relative",
      active: "bg-gray-200 dark:bg-gray-700/50 text-gray-900 dark:text-white",
      container: "flex items-center gap-3 min-w-0",
      icon: {
        base: "flex-shrink-0 w-5 h-5",
        active: "text-gray-900 dark:text-white",
        inactive: "text-gray-400 dark:text-gray-500",
      },
      avatar: {
        size: "2xs",
      },
    },
  },
};

function onSelect(option: any) {
  if (option.click) {
    option.click();
  } else if (option.to) {
    router.push(option.to);
  } else if (option.href) {
    window.open(option.href, "_blank");
  }
}
</script>

<template>
  <UCommandPalette
    ref="commandPaletteRef"
    :groups="groups"
    icon=""
    :ui="ui"
    :autoselect="false"
    placeholder="Search for pages"
    @update:model-value="onSelect"
  />
</template>
