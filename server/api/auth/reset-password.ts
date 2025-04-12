import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  const supabase = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseServiceRoleKey
  );

  const body = await readBody(event);
  const { token, newPassword } = body;

  if (!token || !newPassword) {
    throw createError({
      statusCode: 400,
      message: "Token and password are required.",
    });
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return { success: true, message: "Password updated successfully." };
});
