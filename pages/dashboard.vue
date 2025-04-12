<script setup lang="ts">
import { ref, onMounted } from "vue";

useSeoMeta({
  title: "Dashboard",
  ogTitle: "Dashboard",
  description: "View your dashboard overview.",
  ogDescription: "Stay updated with your dashboard insights.",
});

const stats = ref<any[]>([]);

// Get role from hashed cookie
const userRole = useHashedCookie<string | null | undefined>("aa05f44d53a34");

const fetchStats = async () => {
  try {
    const casesResponse = await $fetch("/api/stats/cases");

    // If the user is a client, only show the cases card
    if (userRole.value === "client") {
      stats.value = [
        {
          title: "Cases",
          icon: "mdi:file",
          subTitle: "Ongoing cases",
          total: casesResponse.count || 0,
          link: "/cases",
          color: "bg-blue-100 text-blue-600",
        },
      ];
      return;
    }

    // Otherwise, fetch all other stats
    const [clientsResponse, staffResponse, usersResponse] = await Promise.all([
      $fetch("/api/stats/clients"),
      $fetch("/api/stats/staff"),
      $fetch("/api/stats/users"),
    ]);

    stats.value = [
      {
        title: "Cases",
        icon: "mdi:file",
        subTitle: "Ongoing cases",
        total: casesResponse.count || 0,
        link: "/cases",
        color: "bg-blue-100 text-blue-600",
      },
      {
        title: "Clients",
        icon: "mdi:account",
        subTitle: "All Clients",
        total: clientsResponse.count || 0,
        link: "/clients",
        color: "bg-green-100 text-green-600",
      },
      {
        title: "Staff",
        icon: "mdi:account",
        subTitle: "All Staff",
        total: staffResponse.count || 0,
        link: "/staff",
        color: "bg-yellow-100 text-yellow-600",
      },
      {
        title: "Users",
        icon: "mdi:account-group",
        subTitle: "System Users",
        total: usersResponse.count || 0,
        link: "/users",
        color: "bg-red-100 text-red-600",
      },
    ];
  } catch (error) {
    console.error("Failed to fetch stats:", error);
  }
};

onMounted(fetchStats);
</script>


<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Dashboard</h1>
    </div>
    <!-- Charts Data -->
    <div class="grid grid-cols-12 gap-[15px] lg:gap-[15px]">
      <div
        class="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-3"
        v-for="item in stats"
        :key="item.title"
      >
        <NuxtLink :to="item.link">
          <UCard class="h-full flex flex-col justify-center">
            <div class="flex gap-2">
              <div
                class="rounded-full h-8 w-8 flex items-center justify-center"
                :class="item.color"
              >
                <Icon :name="item.icon" />
              </div>
              <p class="mb-0 text-lg opacity-60">{{ item.title }}</p>
            </div>

            <div class="mt-3 mb-14">
              <p class="opacity-60 text-sm">{{ item.subTitle }}</p>
              <p class="text-foreground font-normal text-2xl -mt-1">
                {{ Intl.NumberFormat().format(item.total) }}
              </p>
            </div>
            <Chart></Chart>
          </UCard>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
