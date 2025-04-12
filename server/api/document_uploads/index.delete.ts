import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  const supabase = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseServiceRoleKey
  );

  const { id } = getQuery(event);
  if (!id) {
    throw createError({ statusCode: 400, message: "Missing document_uploads ID" });
  }

  try {
    const { data, error } = await supabase
      .from("document_uploads")
      .delete()
      .eq("id", id);

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }
    return { success: true, data };
  } catch (err) {
    console.error(`Error deleting document_uploads with id ${id}:`, err);
    return { success: false, message: "Internal Server Error" };
  }
});
