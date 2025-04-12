import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  const supabase = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseServiceRoleKey
  );

  const clientsData = await readBody(event);
  if (!clientsData) {
    throw createError({ statusCode: 400, message: "Missing clients data" });
  }

  try {
    const { data, error } = await supabase
      .from("clients")
      .insert(clientsData)
      .select()
      .single();

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error creating clients:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
