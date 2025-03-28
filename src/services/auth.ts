import { createClient } from "@supabase/supabase-js";
import { type User } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResponse {
  user: User | null;
  error: AuthError | null;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      return { user: null, error: { message: error.message } };
    }

    // Create a user profile in the public.profiles table (if you have one)
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: name,
        email: email,
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error("Error creating user profile:", profileError);
      }
    }

    return { user: data.user, error: null };
  } catch (err) {
    console.error("Signup error:", err);
    return {
      user: null,
      error: { message: "An unexpected error occurred during signup." },
    };
  }
}

/**
 * Sign in a user with email and password
 */
export async function signIn(
  email: string,
  password: string,
): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: { message: error.message } };
    }

    return { user: data.user, error: null };
  } catch (err) {
    console.error("Login error:", err);
    return {
      user: null,
      error: { message: "An unexpected error occurred during login." },
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: { message: error.message } };
    }
    return { error: null };
  } catch (err) {
    console.error("Logout error:", err);
    return {
      error: { message: "An unexpected error occurred during logout." },
    };
  }
}

/**
 * Send a password reset email
 */
export async function resetPassword(
  email: string,
): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { error: { message: error.message } };
    }
    return { error: null };
  } catch (err) {
    console.error("Password reset error:", err);
    return {
      error: {
        message:
          "An unexpected error occurred while sending the password reset email.",
      },
    };
  }
}

/**
 * Update user's password
 */
export async function updatePassword(
  password: string,
): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return { error: { message: error.message } };
    }
    return { error: null };
  } catch (err) {
    console.error("Update password error:", err);
    return {
      error: {
        message: "An unexpected error occurred while updating the password.",
      },
    };
  }
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Get the current session
 */
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    return data.session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}
