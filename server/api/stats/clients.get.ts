import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();

  const supabase = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseServiceRoleKey
  );

  if (!supabase) {
    throw createError({
      statusCode: 500,
      message: "Failed to initialize Supabase client.",
    });
  }

  const { data, error, count } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, count };
});
