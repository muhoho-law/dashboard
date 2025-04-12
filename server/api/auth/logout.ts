import { defineEventHandler } from "h3";
import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
  }

  const { error } = await client.auth.signOut();

  if (error) {
    throw createError({
      statusCode: error.status,
      statusMessage: error.message,
    });
  }

  return { message: "Logged out successfully" };
});
