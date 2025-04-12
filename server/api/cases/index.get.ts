// import { serverSupabaseClient } from "#supabase/server";
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  // const supabase = await serverSupabaseClient(event);

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

  try {
    const { data, error } = await supabase
    .from("cases")
    .select(`
      *,
      client:users!cases_client_id_fkey(*),
      lead_lawyer:users!cases_lead_lawyer_id_fkey(*)
    `);

    if (error) throw createError({ statusCode: 500, message: error.message });

    return { success: true, data };
  } catch (err) {
    console.error("Error fetching cases:", err);
    return { success: false, message: "Internal Server Error", err };
  }
});
