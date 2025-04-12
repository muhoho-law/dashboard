import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  const supabase = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseServiceRoleKey
  );

  const paymentsData = await readBody(event);
  if (!paymentsData) {
    throw createError({ statusCode: 400, message: "Missing payments data" });
  }

  try {
    const { data, error } = await supabase
      .from("payments")
      .insert(paymentsData)
      .select()
      .single();

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error creating payments:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
