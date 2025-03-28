import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  signIn,
  signUp,
  signOut,
  resetPassword,
  updatePassword,
  getCurrentUser,
  getSession,
  AuthError,
} from "../services/auth";
import {
  fetchPrivacySettings,
  updateGlobalVisibility,
  updateHiddenMoods,
  updateConnectionSettings,
  PrivacySettings,
  ConnectionSetting,
} from "../services/privacyService";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  clearError: () => void;
  // Privacy settings methods
  fetchPrivacySettings: (userId: string) => Promise<{
    data: PrivacySettings | null;
    error: Error | null;
  }>;
  updateGlobalVisibility: (
    userId: string,
    visibility: string,
  ) => Promise<{
    success: boolean;
    error: Error | null;
  }>;
  updateHiddenMoods: (
    userId: string,
    hiddenMoods: number[],
  ) => Promise<{
    success: boolean;
    error: Error | null;
  }>;
  updateConnectionSettings: (
    userId: string,
    connectionSettings: ConnectionSetting[],
  ) => Promise<{
    success: boolean;
    error: Error | null;
  }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define AuthProvider as a named function component with explicit export
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session on mount
    const checkUser = async () => {
      try {
        setLoading(true);
        const session = await getSession();
        if (session) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user: authUser, error: authError } = await signIn(
        email,
        password,
      );

      if (authError) {
        setError(authError);
        return;
      }

      setUser(authUser);
      navigate("/b2gthr");
    } catch (err) {
      setError({ message: "An unexpected error occurred during login." });
      console.error("Sign in error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    name: string,
  ) => {
    try {
      setLoading(true);
      setError(null);
      const { user: authUser, error: authError } = await signUp(
        email,
        password,
        name,
      );

      if (authError) {
        setError(authError);
        return;
      }

      setUser(authUser);
      navigate("/b2gthr");
    } catch (err) {
      setError({ message: "An unexpected error occurred during signup." });
      console.error("Sign up error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error: authError } = await signOut();

      if (authError) {
        setError(authError);
        return;
      }

      setUser(null);
      navigate("/");
    } catch (err) {
      setError({ message: "An unexpected error occurred during logout." });
      console.error("Sign out error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const { error: authError } = await resetPassword(email);

      if (authError) {
        setError(authError);
        return;
      }
    } catch (err) {
      setError({
        message:
          "An unexpected error occurred while sending the password reset email.",
      });
      console.error("Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { error: authError } = await updatePassword(password);

      if (authError) {
        setError(authError);
        return;
      }
    } catch (err) {
      setError({
        message: "An unexpected error occurred while updating the password.",
      });
      console.error("Update password error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
    clearError,
    // Privacy settings methods
    fetchPrivacySettings,
    updateGlobalVisibility,
    updateHiddenMoods,
    updateConnectionSettings,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Define useAuth as a named function with explicit export
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
