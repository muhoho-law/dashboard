import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const supabase = createClient(
    process.env.NUXT_SUPABASE_URL!,
    process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY!
  );

  const { id } = getQuery(event);
  if (!id) {
    throw createError({ statusCode: 400, message: "Missing tasks ID" });
  }

  try {
    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }
    return { success: true, data };
  } catch (err) {
    console.error(`Error deleting tasks with id ${id}:`, err);
    return { success: false, message: "Internal Server Error" };
  }
});
