import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const supabase = createClient(
    process.env.NUXT_SUPABASE_URL!,
    process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY!
  );

  const appointmentsData = await readBody(event);
  if (!appointmentsData) {
    throw createError({ statusCode: 400, message: "Missing appointments data" });
  }

  try {
    const { data, error } = await supabase
      .from("appointments")
      .insert(appointmentsData)
      .select()
      .single();

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error creating appointments:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
