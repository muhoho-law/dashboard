import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const supabase = createClient(
    process.env.NUXT_SUPABASE_URL!,
    process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY!
  );

  const tasksData = await readBody(event);
  if (!tasksData) {
    throw createError({ statusCode: 400, message: "Missing tasks data" });
  }

  try {
    const { data, error } = await supabase
      .from("tasks")
      .insert(tasksData)
      .select()
      .single();

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error creating tasks:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
