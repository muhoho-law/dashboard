import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  const supabase = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseServiceRoleKey
  );

  const staffData = await readBody(event);
  if (!staffData) {
    throw createError({ statusCode: 400, message: "Missing staff data" });
  }

  try {
    const { data, error } = await supabase
      .from("staff")
      .insert(staffData)
      .select()
      .single();

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error creating staff:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
