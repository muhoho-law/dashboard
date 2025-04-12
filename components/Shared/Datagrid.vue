<script setup lang="ts">
interface DataGridProps2 {
  columns: { key: string; label?: string; sortable?: boolean }[];
  rows: any;
  meta?: IMeta;
}

const props = defineProps<DataGridProps2>();

const columnsTable = computed(() => {
  const columnsWithActions = [
    ...props.columns,
    { key: "actions", label: "Actions", sortable: false },
  ];
  return columnsWithActions;
});
</script>

<template>
  <UTable
    :rows="rows"
    :columns="columnsTable"
    class="w-full"
    :ui="{ td: { padding: 'px-4 py-2' }, th: { base: 'sticky top-0' } }"
  >
    <template #actions-data="{ row }">
      <slot name="actions" :row="row" />
    </template>

    <template #role-data="{ row }">
      <slot name="role" :row="row" />
    </template>

    <template #download-data="{ row }">
      <slot name="download" :row="row" />
    </template>

    <template #status-data="{ row }">
      <slot name="status" :row="row" />
    </template>

    <template #public_url-data="{ row }">
      <slot name="public_url" :row="row" />
    </template>

    <template #category-data="{ row }">
      <slot name="category" :row="row" />
    </template>

    <!-- ----------------------------------------- -->
    <!-- Product images -->
    <!-- ----------------------------------------- -->
    <template
      v-for="column in ['images']"
      #[`${column}-data`]="{ row }"
      :key="column"
    >
      <img
        :src="row[column]"
        alt="Profile"
        class="h-10 w-10 object-cover mx-auto"
        style="border-radius: 50%"
      />
    </template>

    <!-- ----------------------------------------- -->
    <!-- Table images -->
    <!-- ----------------------------------------- -->
    <template
      v-for="column in ['media.logo', 'logo', 'image', 'image_url', 'url']"
      #[`${column}-data`]="{ row }"
      :key="column"
    >
      <img
        :src="row[column]"
        alt="Profile"
        class="h-10 w-10 object-cover mx-auto"
        style="border-radius: 50%"
      />
    </template>
  </UTable>
</template>
