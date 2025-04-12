import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  const supabase = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseServiceRoleKey
  );

  const document_uploadsData = await readBody(event);
  if (!document_uploadsData) {
    throw createError({ statusCode: 400, message: "Missing document_uploads data" });
  }

  try {
    const { data, error } = await supabase
      .from("document_uploads")
      .insert(document_uploadsData)
      .select()
      .single();

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error creating document_uploads:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
