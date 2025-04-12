import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  const supabase = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseServiceRoleKey
  );

  const memosData = await readBody(event);
  if (!memosData) {
    throw createError({ statusCode: 400, message: "Missing memos data" });
  }

  try {
    const { data, error } = await supabase
      .from("memos")
      .insert(memosData)
      .select()
      .single();

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error creating memos:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
