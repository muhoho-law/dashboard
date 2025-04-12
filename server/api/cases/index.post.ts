import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  const supabase = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseServiceRoleKey
  );

  const caseData = await readBody(event);
  if (!caseData) {
    throw createError({ statusCode: 400, message: "Missing case data" });
  }

  try {
    const { data, error } = await supabase
      .from("cases")
      .insert(caseData)
      .select()
      .single();

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error creating case:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
