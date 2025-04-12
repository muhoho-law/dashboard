export const admin = [
  {
    section: "General",
    items: [
      { label: "Dashboard", icon: "mdi:home", to: "/dashboard" },
      { label: "Memos", icon: "mdi:pin", to: "/memos" },
    ],
  },
  {
    section: "People",
    items: [
      { label: "Clients", icon: "mdi:account", to: "/clients" },
      { label: "Staff", icon: "mdi:account-group", to: "/staff" },
    ],
  },
  {
    section: "Cases",
    items: [
      { label: "All Cases", icon: "mdi:clipboard-list", to: "/cases" },
      { label: "Tasks & Todos", icon: "mdi:check", to: "/tasks" },
      { label: "Appointments", icon: "mdi:calendar", to: "/appointments" },
    ],
  },
  {
    section: "Archive",
    items: [
      { label: "Publications", icon: "mdi:library", to: "/document-uploads" },
      { label: "Notes", icon: "mdi:note", to: "/notes" },
    ],
  },
  // {
  //   section: "Finance",
  //   items: [{ label: "Billing", icon: "mdi:credit-card", to: "/payments" }],
  // },
  {
    section: "System",
    items: [
      {
        label: "Authenticated Users",
        icon: "mdi:account-circle",
        to: "/users",
      },
      { label: "Images Storage", icon: "mdi:image", to: "/images-storage" },
      {
        label: "Documents Storage",
        icon: "mdi:file",
        to: "/documents-storage",
      },
    ],
  },
  {
    section: "Your Profile",
    items: [
      { label: "Notifications", icon: "mdi:bell", to: "/notifications" },
      { label: "Settings", icon: "mdi:cogs", to: "/settings" },
      { label: "Profile", icon: "mdi:account", to: "/profile" },
    ],
  },
];

export const lawyer = [
  {
    section: "General",
    items: [
      { label: "Dashboard", icon: "mdi:home", to: "/dashboard" },
      { label: "Memos", icon: "mdi:pin", to: "/memos" },
    ],
  },
  {
    section: "People",
    items: [
      { label: "Clients", icon: "mdi:account", to: "/clients" },
    ],
  },
  // {
  //   section: "Finance",
  //   items: [{ label: "Billing", icon: "mdi:credit-card", to: "/payments" }],
  // },
  {
    section: "Archive",
    items: [
      { label: "Publications", icon: "mdi:library", to: "/document-uploads" },
      { label: "Notes", icon: "mdi:note", to: "/notes" },
    ],
  },
  {
    section: "My Work",
    items: [
      { label: "My Cases", icon: "mdi:clipboard-list", to: "/cases" },
      { label: "Tasks & Todos", icon: "mdi:check", to: "/tasks" },
      { label: "My Appointments", icon: "mdi:calendar", to: "/appointments" },
      // { label: "My Documents", icon: "mdi:file", to: "/document-uploads" },
    ],
  },
  {
    section: "Your Profile",
    items: [
      { label: "Notifications", icon: "mdi:bell", to: "/notifications" },
      { label: "Settings", icon: "mdi:cogs", to: "/settings" },
      { label: "Profile", icon: "mdi:account", to: "/profile" },
    ],
  },
];

export const client = [
  {
    section: "General",
    items: [{ label: "Dashboard", icon: "mdi:home", to: "/dashboard" }],
  },
  {
    section: "Cases",
    items: [
      { label: "My Cases", icon: "mdi:clipboard-list", to: "/cases" },
      { label: "My Appointments", icon: "mdi:calendar", to: "/appointments" },
      { label: "Case Documents", icon: "mdi:calendar", to: "/document-uploads" },

    ],
  },
  // {
  //   section: "Finance",
  //   items: [{ label: "Billing", icon: "mdi:credit-card", to: "/payments" }],
  // },
  {
    section: "Your Profile",
    items: [
      { label: "Notifications", icon: "mdi:bell", to: "/notifications" },
      { label: "Settings", icon: "mdi:cogs", to: "/settings" },
      { label: "Profile", icon: "mdi:account", to: "/profile" },
    ],
  },
];
