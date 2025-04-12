import { useToast } from "#imports";

export function useAuthentication() {
  const toast = useToast();
  const isLoading = useState<boolean>("is-loading", () => false);
  const user = useState("user", () => null); // Store authenticated user

  const userId = useHashedCookie<undefined | null | number>("b35db0c4e3bb4");
  const userFullName = useHashedCookie<string | null | undefined>(
    "f4720e4c4ca84"
  );
  const userName = useHashedCookie<string | null | undefined>("ef8bb5c379f34");
  const userProfileImage = useHashedCookie<string | null | undefined>(
    "f8cd3228568c4"
  );
  const userEmail = useHashedCookie<string | null | undefined>("3c19312bc3e34");
  const userRole = useHashedCookie<string | null | undefined>("aa05f44d53a34");
  const userPhone = useHashedCookie<string | null | undefined>("c967092aae604");
  const userFamilyId = useHashedCookie<number | null | undefined>(
    "8111621a36fc4"
  );

  const route = useRoute();

  const registeringAs = route.params?.type;

  const loginFormState = useState("login-formstate", () => ({
    email: "",
    password: "",
  }));

  const resetLoginFormState = () => {
    loginFormState.value = {
      email: "",
      password: "",
    };
  };

  // Register Form State (Includes username & account_id)
  const registerFormState = useState("register-formstate", () => ({
    email: "",
    full_name: "",
    phone_number: "",
    username: "",
    password: "",
  }));

  const resetRegisterFormState = () => {
    registerFormState.value = {
      email: "",
      full_name: "",
      phone_number: "",
      username: "",
      password: "",
    };
  };

  const forgotPasswordFormState = useState("forgot-password-formstate", () => ({
    email: "",
  }));

  const clearForgotPasswordFormState = () => {
    forgotPasswordFormState.value = {
      email: "",
    };
  };

  const resetPasswordFormState = useState("reset-password-formstate", () => ({
    password: "",
    current_password: "",
    confirm_password: "",
  }));

  const clearResetPasswordFOrmState = () => {
    resetPasswordFormState.value = {
      password: "",
      current_password: "",
      confirm_password: "",
    };
  };

  // Function to Set Cookies After Login
  const setUserCookies = (user: any) => {
    userId.value = user?.id;
    userRole.value = user?.role;
    userFullName.value = user?.full_name;
    userName.value = user?.username;
    userProfileImage.value = user?.image_url;
    userEmail.value = user?.email;
    userPhone.value = user?.phone_number;
    userFamilyId.value = user?.family_id;
  };

  const generateAccountId = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let accountId = "MRX_";
    for (let i = 0; i < 7; i++) {
      accountId += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return accountId;
  };

  const slugify = (text: string): string => {
    return text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^a-z0-9\-]/g, "") // Remove invalid characters
      .replace(/-+/g, "-"); // Remove multiple hyphens
  };

  /**
   * Handles login with credentials via API and stores user session.
   */
  const login = async () => {
    try {
      isLoading.value = true;

      const response = await $fetch<ILoginResponse>("/api/auth/login", {
        method: "POST",
        body: {
          email: loginFormState.value.email,
          password: loginFormState.value.password,
        },
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to login");
      }

      user.value = response.user; // Store user in state
      setUserCookies(response.user); // Store user in cookies

      toast.add({
        title: "Success",
        description: "Login successful!",
        color: "green",
      });

      navigateTo("/dashboard");
    } catch (error) {
      toast.add({
        title: "Error",
        description: error.message || "Failed to login.",
        color: "red",
      });

      console.error("Error in login:", error);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Handles login with credentials via API and stores user session.
   */
  const autoLogin = async () => {
    try {
      isLoading.value = true;

      const response = await $fetch<ILoginResponse>("/api/auth/login", {
        method: "POST",
        body: {
          email: loginFormState.value.email,
          password: loginFormState.value.password,
        },
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to login");
      }

      user.value = response.user; // Store user in state
      setUserCookies(response.user); // Store user in cookies

      toast.add({
        title: "Success",
        description: "Login successful!",
        color: "green",
      });

      navigateTo("/dashboard");
    } catch (error) {
      toast.add({
        title: "Error",
        description: error.message || "Failed to login.",
        color: "red",
      });

      console.error("Error in login:", error);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Handles user registration.
   */
  const register = async () => {
    try {
      isLoading.value = true;

      const { success, user, message } = await $fetch("/api/auth/register", {
        method: "POST",
        body: {
          email: registerFormState.value.email,
          full_name: registerFormState.value.full_name,
          phone_number: registerFormState.value.phone_number,
          password: registerFormState.value.password,
          account_id: generateAccountId(),
          role:
            registeringAs === "individual" ? "patient" : "organization_admin",
          username: slugify(registerFormState.value.full_name),
        },
      });

      if (!success) {
        toast.add({ title: "Error", description: message, color: "red" });
        return;
      } else {
        toast.add({
          title: "Success",
          description: "Registration successful!",
          color: "green",
        });

        // login user automatically
        loginFormState.value.email = registerFormState.value.email;
        loginFormState.value.password = registerFormState.value.password;

        await autoLogin();

        await resetRegisterFormState();
      }

      navigateTo("/dashboard");
    } catch (error) {
      console.error("Error in register:", error);
      toast.add({
        title: "Error",
        description: "Failed to register.",
        color: "red",
      });
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetch the logged-in user's profile.
   */
  const fetchUser = async () => {
    try {
      const response = await $fetch<ILoginResponse>("/api/auth/me", {
        method: "GET",
      });

      if (response.success) {
        user.value = response.user;
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  /**
   * Fetch the logged-in user's profile.
   */
  const forgotPassword = async () => {
    try {
      const response = await $fetch("/api/auth/forgot-password", {
        method: "POST",
        body: { email: forgotPasswordFormState.value.email },
      });

      toast.add({
        title: "Success",
        description: response.message,
        color: "green",
      });
    } catch (error) {
      toast.add({
        title: "Error",
        description: "Failed to send reset email.",
        color: "red",
      });
      console.error("Failed to send reset email:", error);
    }
  };

  /**
   * Fetch the logged-in user's profile.
   */
  const resetPassword = async () => {
    try {
      const response = await $fetch("/api/auth/reset-password", {
        method: "POST",
        body: { password: resetPasswordFormState.value.password },
      });

      toast.add({
        title: "Success",
        description: response.message,
        color: "green",
      });
    } catch (error) {
      toast.add({
        title: "Error",
        description: "Failed to reset password.",
        color: "red",
      });
      console.error("Failed to send reset email:", error);
    }
  };

  return {
    loginFormState,
    registerFormState,
    isLoading,
    login,
    autoLogin,
    register,
    forgotPassword,
    resetPassword,
    user,
    fetchUser,
    resetLoginFormState,
    resetRegisterFormState,
    resetPasswordFormState,
    clearResetPasswordFOrmState,
    forgotPasswordFormState,
    clearForgotPasswordFormState,
  };
}
