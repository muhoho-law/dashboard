import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  const supabase = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseServiceRoleKey
  );

  const notesData = await readBody(event);
  if (!notesData) {
    throw createError({ statusCode: 400, message: "Missing notes data" });
  }

  try {
    const { data, error } = await supabase
      .from("notes")
      .insert(notesData)
      .select()
      .single();

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error creating notes:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
