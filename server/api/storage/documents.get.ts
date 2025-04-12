import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const supabase = createClient(
    process.env.NUXT_SUPABASE_URL!,
    process.env.NUXT_SUPABASE_ANON_KEY!
  );

  if (!supabase) {
    throw createError({
      statusCode: 500,
      message: "Failed to initialize Supabase client.",
    });
  }

  try {
    const bucketName = "images";

    // Get list of files from the bucket
    const { data, error } = await supabase.storage.from(bucketName).list();

    if (error) throw createError({ statusCode: 500, message: error.message });

    // Construct full public URLs
    const files = data.map((file) => ({
      name: file.name,
      url: `${process.env.NUXT_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${file.name}`,
    }));

    return { success: true, files };
  } catch (err) {
    console.error("Error fetching storage files:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
