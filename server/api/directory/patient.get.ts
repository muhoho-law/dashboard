import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  // Initialize Supabase Client with the Service Role Key
  const supabase = createClient(
    process.env.NUXT_SUPABASE_URL!,
    process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY! // Service Role Key for full access
  );

  if (!supabase) {
    throw createError({
      statusCode: 500,
      message: "Failed to initialize Supabase client.",
    });
  }

  // Extract user ID from query parameters
  const { user_id } = getQuery(event);

  if (!user_id) {
    throw createError({
      statusCode: 400,
      message: "User ID is required.",
    });
  }

  try {
    // Fetch directory where patient_id matches user_id
    const { data, error } = await supabase
      .from("directory")
      .select("*, patient:users(full_name), organization:organizations(name)")
      .eq("user_id", user_id) // Only directory for this user
      .order("created_at", { ascending: false });

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error fetching user directory:", err);
    return { success: false, message: "Failed to fetch user directory." };
  }
});
