<script setup>
useSeoMeta({
  title: "Products",
  ogTitle: "Products",
  description: "View and manage product listings.",
  ogDescription: "Keep your product catalog up-to-date.",
});

const {
  products,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  productFormState,
  isEditingProduct,
} = useProduct();

const isDrawerOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedProductId = ref(null);

// Fetch all products
const response = await getAllProducts();

// Define the table columns
const columns = ref([
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "price", label: "Price" },
  { key: "stock", label: "Stock" },
  { key: "category", label: "Category" },
]);

// Open the edit drawer for a specific product
const openEditDrawer = async (id) => {
  isEditingProduct.value = true;
  selectedProductId.value = id;
  isDrawerOpen.value = true;

  // Fetch the product data and update the form state
  const { data } = await getSingleProduct(id);
  if (data) {
    productFormState.value = { ...data };
  }
};

// Refresh the product list after add/edit/delete
const refreshProducts = async () => {
  isDrawerOpen.value = false;
  await getAllProducts();
};

// Open the delete confirmation modal
const confirmDelete = (id) => {
  selectedProductId.value = id;
  isDeleteModalOpen.value = true;
};

// Handle product deletion
const handleDelete = async () => {
  if (selectedProductId.value) {
    await deleteProduct(selectedProductId.value);
    await getAllProducts(); // Refresh list after deletion
  }
  isDeleteModalOpen.value = false;
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Products</h1>
      <UButton color="primary" @click="isDrawerOpen = true">
        Add Product
      </UButton>
    </div>

    <UCard>
      <SharedDatagrid :columns="columns" :rows="products">
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

        <!-- Status Column: Optional -->
        <template #status="{ row }">
          <UBadge
            v-if="row.stock > 0"
            color="green"
          >
            In Stock
          </UBadge>

          <UBadge
            v-else
            color="red"
          >
            Out of Stock
          </UBadge>
        </template>
      </SharedDatagrid>
    </UCard>

    <!-- Edit form -->
    <SharedDrawer v-model="isDrawerOpen" title="Edit Product">
      <FormsProductForm @cancel="refreshProducts" />
    </SharedDrawer>

    <!-- Delete Confirmation Modal -->
    <SharedModal
      :show="isDeleteModalOpen"
      message="Are you sure you want to delete this product?"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
