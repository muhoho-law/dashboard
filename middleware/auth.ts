export default defineNuxtRouteMiddleware(() => {
  const user = useSupabaseUser()
  const route = useRoute()

  // If user is not logged in and trying to access a protected route (e.g., /dashboard)
  if (!user.value && route.path !== '/') {
    return navigateTo('/')
  }

  // If user is logged in and trying to access the login page
  if (user.value && route.path === '/') {
    return navigateTo('/dashboard')
  }

  // If user is logged in and trying to access the dashboard page, do nothing (no redirect)
  if (user.value && route.path === '/dashboard') {
    return
  }
})
