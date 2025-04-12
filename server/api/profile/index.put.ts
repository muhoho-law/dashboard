import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  const supabase = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseServiceRoleKey
  );

  // const { id } = getQuery(event);
  // if (!id) {
  //   throw createError({ statusCode: 400, message: "Missing users ID" });
  // }

  const updateData = await readBody(event);
  if (!updateData) {
    throw createError({ statusCode: 400, message: "Missing users data" });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", updateData.id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating users with id ${updateData.id}:`, error.message);
      return { success: false, data: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.error(`Error updating users with id ${updateData.id}:`, err);
    return { success: false, data: "Internal Server Error" };
  }
});
