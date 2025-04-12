import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  const supabase = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseServiceRoleKey
  );

  const { email, password } = await readBody(event);

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: "Missing email or password",
    });
  }

  try {
    // Authenticate User
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      throw createError({
        statusCode: 401,
        message: authError?.message || "Invalid credentials",
      });
    }

    // Fetch Full User Data
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (userError) {
      throw createError({
        statusCode: 500,
        message: "Failed to fetch user data",
      });
    }

    return {
      success: true,
      message: "Login successful",
      user: userData,
      token: authData.session?.access_token, // Optional: Return token if needed
    };
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Failed to Authenticate" };
  }
});
