import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const supabase = createClient(
    process.env.NUXT_SUPABASE_URL!,
    process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY!
  );

  const { id } = getQuery(event);
  if (!id) {
    throw createError({ statusCode: 400, message: "Missing directory ID" });
  }

  const updateData = await readBody(event);
  if (!updateData) {
    throw createError({ statusCode: 400, message: "Missing directory data" });
  }

  try {
    const { data, error } = await supabase
      .from("directory")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating directory with id ${id}:`, error.message);
      return { success: false, data: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.error(`Error updating directory with id ${id}:`, err);
    return { success: false, data: "Internal Server Error" };
  }
});
