import React, { useState, useEffect, useRef } from "react";
import SlideCard from "../SlideCard";
import { MoodOption } from "../MoodSelector";
import { useTheme } from "../../../contexts/ThemeContext";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "../../../components/ui/use-toast";
import { supabase } from "../../../services/auth";

interface ManageSettingsProps {
  currentMood: number;
  setCurrentMood: (index: number) => void;
  moodOptions: MoodOption[];
  onContextSubmit?: (context: string) => void;
  cardStyle?: React.CSSProperties;
}

// Interface for notification settings
interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  moodUpdates: boolean;
  urgentAlerts: boolean;
  connectionRequests: boolean;
  enableWidget: boolean;
  prioritizeUrgent: boolean;
}

// Function to save notification settings to the database
const saveNotificationSettings = async (
  userId: string,
  settings: NotificationSettings,
) => {
  try {
    const { error } = await supabase.from("user_settings").upsert({
      user_id: userId,
      notification_settings: settings,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error("Error saving notification settings:", error);
    return { success: false, error };
  }
};

// Function to load notification settings from the database
const loadNotificationSettings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("user_settings")
      .select("notification_settings, theme")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return {
      data: {
        notification_settings: data?.notification_settings,
        theme: data?.theme,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error loading notification settings:", error);
    return { data: null, error };
  }
};

const ManageSettings: React.FC<ManageSettingsProps> = ({
  currentMood,
  setCurrentMood,
  moodOptions,
  onContextSubmit = () => {},
  cardStyle = {},
}) => {
  const { theme, setTheme } = useTheme();
  const { user, updatePassword } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showLinkedAccountsModal, setShowLinkedAccountsModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Ref to track if settings have been loaded
  const settingsLoaded = useRef(false);
  const [currentTheme, setCurrentTheme] = useState(theme);

  // Update local state when theme context changes
  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  const handleThemeChange = async (newTheme: "system" | "light" | "dark") => {
    setTheme(newTheme);
    setCurrentTheme(newTheme);

    // Save theme preference to database
    if (user) {
      try {
        const { error } = await supabase.from("user_settings").upsert({
          user_id: user.id,
          theme: newTheme,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          console.error("Error saving theme preference:", error);
          toast({
            title: "Error",
            description: "Failed to save theme preference. Please try again.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Unexpected error saving theme preference:", err);
      }
    }
  };

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      emailNotifications: true,
      pushNotifications: true,
      moodUpdates: false,
      urgentAlerts: true,
      connectionRequests: true,
      enableWidget: true,
      prioritizeUrgent: true,
    });

  // Load notification settings on component mount
  useEffect(() => {
    if (user && !settingsLoaded.current) {
      loadUserSettings();
      settingsLoaded.current = true;
    }
  }, [user]);

  // Load user settings from the database
  const loadUserSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await loadNotificationSettings(user.id);
      if (error) {
        console.error("Error loading notification settings:", error);
        return;
      }

      if (data?.notification_settings) {
        setNotificationSettings(data.notification_settings);
      }

      if (data?.theme) {
        // Update the theme in context if it exists in the database
        setCurrentTheme(data.theme as "system" | "light" | "dark");
        setTheme(data.theme as "system" | "light" | "dark");
      }
    } catch (err) {
      console.error("Unexpected error loading notification settings:", err);
    }
  };

  // Handle toggle change and save to database
  const handleToggleChange = async (setting: keyof NotificationSettings) => {
    if (!user) return;

    const newSettings = {
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    };

    setNotificationSettings(newSettings);

    // Save to database
    try {
      const { success, error } = await saveNotificationSettings(
        user.id,
        newSettings,
      );
      if (!success) {
        console.error("Error saving notification settings:", error);
        toast({
          title: "Error",
          description: "Failed to save settings. Please try again.",
          variant: "destructive",
        });
        return;
      }
    } catch (err) {
      console.error("Unexpected error saving notification settings:", err);
    }
  };

  // Handle change password
  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  // Handle linked accounts
  const handleLinkedAccounts = () => {
    setShowLinkedAccountsModal(true);
  };

  // Submit password change
  const submitPasswordChange = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to change your password.",
        variant: "destructive",
      });
      return;
    }

    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    // Check for password complexity
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      setPasswordError(
        "Password must include uppercase, lowercase, numbers, and special characters",
      );
      return;
    }

    setIsSaving(true);
    try {
      // First verify current password by trying to sign in
      const { signIn } = await import("../../../services/auth");
      const { error: signInError } = await signIn(
        user.email || "",
        currentPassword,
      );

      if (signInError) {
        setPasswordError("Current password is incorrect");
        setIsSaving(false);
        return;
      }

      // Update password
      const result = await updatePassword(newPassword);

      if (result.error) {
        setPasswordError(result.error.message);
        return;
      }

      toast({
        title: "Success",
        description: "Your password has been updated successfully.",
      });

      setShowChangePasswordModal(false);

      // Clear the password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Unexpected error changing password:", err);
      setPasswordError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SlideCard
      title="Manage Settings"
      currentMood={currentMood}
      setCurrentMood={setCurrentMood}
      moodOptions={moodOptions}
      onContextSubmit={onContextSubmit}
      cardStyle={cardStyle}
    >
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-3 text-white">
            Notification Preferences
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-black/40 backdrop-blur-sm rounded-lg">
              <div>
                <h4 className="font-medium text-white">Mood Updates</h4>
                <p className="text-sm text-white/90">
                  Get notified when connections update their mood
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.moodUpdates}
                  onChange={() => handleToggleChange("moodUpdates")}
                />
                <div
                  className={`w-11 h-6 rounded-full peer ${notificationSettings.moodUpdates ? "bg-cyan-600" : "bg-gray-700"} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                ></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 bg-black/40 backdrop-blur-sm rounded-lg">
              <div>
                <h4 className="font-medium text-white">Urgent Alerts</h4>
                <p className="text-sm text-white/90">
                  Immediate notification when a connection is in an Urgent state
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.urgentAlerts}
                  onChange={() => handleToggleChange("urgentAlerts")}
                />
                <div
                  className={`w-11 h-6 rounded-full peer ${notificationSettings.urgentAlerts ? "bg-cyan-600" : "bg-gray-700"} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                ></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 bg-black/40 backdrop-blur-sm rounded-lg">
              <div>
                <h4 className="font-medium text-white">Connection Requests</h4>
                <p className="text-sm text-white/90">
                  Get notified about new connection requests
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.connectionRequests}
                  onChange={() => handleToggleChange("connectionRequests")}
                />
                <div
                  className={`w-11 h-6 rounded-full peer ${notificationSettings.connectionRequests ? "bg-cyan-600" : "bg-gray-700"} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                ></div>
              </label>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3 text-white">
            Widget Settings
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-black/40 backdrop-blur-sm rounded-lg">
              <div>
                <h4 className="font-medium text-white">Enable Widget</h4>
                <p className="text-sm text-white/90">
                  Show B2GTHR widget on your home screen
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.enableWidget}
                  onChange={() => handleToggleChange("enableWidget")}
                />
                <div
                  className={`w-11 h-6 rounded-full peer ${notificationSettings.enableWidget ? "bg-cyan-600" : "bg-gray-700"} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                ></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 bg-black/40 backdrop-blur-sm rounded-lg">
              <div>
                <h4 className="font-medium text-white">
                  Prioritize Urgent Moods
                </h4>
                <p className="text-sm text-white/90">
                  Show connections with Urgent mood at the top of the widget
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.prioritizeUrgent}
                  onChange={() => handleToggleChange("prioritizeUrgent")}
                />
                <div
                  className={`w-11 h-6 rounded-full peer ${notificationSettings.prioritizeUrgent ? "bg-cyan-600" : "bg-gray-700"} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                ></div>
              </label>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3 text-white">App Theme</h3>
          <div className="p-3 bg-black/40 backdrop-blur-sm rounded-lg">
            <div className="mb-3">
              <h4 className="font-medium mb-2 text-white">Theme Mode</h4>
              <div className="flex gap-3">
                <button
                  onClick={() => handleThemeChange("system")}
                  className={`px-3 py-1 rounded-md text-sm font-medium text-white ${currentTheme === "system" ? "bg-gray-800 border border-white/20" : "bg-transparent"}`}
                >
                  System
                </button>
                <button
                  onClick={() => handleThemeChange("light")}
                  className={`px-3 py-1 rounded-md text-sm font-medium text-white ${currentTheme === "light" ? "bg-gray-800 border border-white/20" : "bg-transparent"}`}
                >
                  Light
                </button>
                <button
                  onClick={() => handleThemeChange("dark")}
                  className={`px-3 py-1 rounded-md text-sm font-medium text-white ${currentTheme === "dark" ? "bg-gray-800 border border-white/20" : "bg-transparent"}`}
                >
                  Dark
                </button>
              </div>
            </div>
            <p className="text-xs text-white/80">
              Note: Background color will still change based on your selected
              mood.
            </p>
          </div>
        </section>

        {/* Account settings section with notification preferences moved from profile */}
        <section>
          <h3 className="text-lg font-semibold mb-3 text-white">
            Account Settings
          </h3>
          <div className="space-y-3">
            {/* Email Notifications Toggle */}
            <div className="flex items-center justify-between p-3 bg-black/40 backdrop-blur-sm rounded-lg">
              <div>
                <h4 className="font-medium text-white">Email Notifications</h4>
                <p className="text-sm text-white/90">
                  Receive email updates about your connections
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.emailNotifications}
                  onChange={() => handleToggleChange("emailNotifications")}
                />
                <div
                  className={`w-11 h-6 rounded-full peer ${notificationSettings.emailNotifications ? "bg-cyan-600" : "bg-gray-700"} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                ></div>
              </label>
            </div>

            {/* Push Notifications Toggle */}
            <div className="flex items-center justify-between p-3 bg-black/40 backdrop-blur-sm rounded-lg">
              <div>
                <h4 className="font-medium text-white">Push Notifications</h4>
                <p className="text-sm text-white/90">
                  Get alerts when someone reaches out
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.pushNotifications}
                  onChange={() => handleToggleChange("pushNotifications")}
                />
                <div
                  className={`w-11 h-6 rounded-full peer ${notificationSettings.pushNotifications ? "bg-cyan-600" : "bg-gray-700"} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                ></div>
              </label>
            </div>

            {/* Other account settings */}
            <button
              className="w-full p-3 bg-black/40 backdrop-blur-sm rounded-lg text-left"
              onClick={handleChangePassword}
            >
              <h4 className="font-medium text-white">Change Password</h4>
              <p className="text-sm text-white/90">
                Update your account password
              </p>
            </button>
            <button
              className="w-full p-3 bg-black/40 backdrop-blur-sm rounded-lg text-left"
              onClick={handleLinkedAccounts}
            >
              <h4 className="font-medium text-white">Linked Accounts</h4>
              <p className="text-sm text-white/90">
                Manage connected social accounts
              </p>
            </button>
            <button
              className="w-full p-3 bg-red-900/40 backdrop-blur-sm rounded-lg text-left"
              onClick={() => {
                // Navigate to the Privacy tab which has the delete account functionality
                // This is a placeholder - in a real app, you would implement navigation to the Privacy tab
                toast({
                  title: "Info",
                  description:
                    "Please go to the Privacy tab to delete your account.",
                });
              }}
            >
              <h4 className="font-medium text-red-300">Delete Account</h4>
              <p className="text-sm text-white/90">
                Permanently delete your account and data
              </p>
            </button>
          </div>
        </section>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20">
          <div className="bg-gray-900 p-4 rounded-lg w-80 border border-white/20">
            <h3 className="text-lg font-medium mb-3">Change Password</h3>

            {passwordError && (
              <div className="mb-3 p-2 bg-red-900/30 text-red-300 text-sm rounded">
                {passwordError}
              </div>
            )}

            <div className="space-y-3 mb-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="current-password"
                >
                  Current Password
                </label>
                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter your current password"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="new-password"
                >
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="confirm-password"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-white/10">
              <button
                className="px-3 py-1.5 rounded-md bg-black/30 hover:bg-black/50 text-sm"
                onClick={() => setShowChangePasswordModal(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-sm flex items-center gap-1"
                onClick={submitPasswordChange}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>Update Password</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Linked Accounts Modal */}
      {showLinkedAccountsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20">
          <div className="bg-gray-900 p-4 rounded-lg w-80 border border-white/20">
            <h3 className="text-lg font-medium mb-3">Linked Accounts</h3>

            <div className="space-y-3 mb-4">
              <div className="p-3 rounded-lg bg-black/30 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                    </svg>
                    <span>Facebook</span>
                  </div>
                  <button className="px-2 py-1 rounded-md bg-cyan-600 hover:bg-cyan-500 text-xs">
                    Connect
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/30 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                    <span>Twitter</span>
                  </div>
                  <button className="px-2 py-1 rounded-md bg-cyan-600 hover:bg-cyan-500 text-xs">
                    Connect
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/30 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M7.8 2h8.4c1.94 0 3.5 1.56 3.5 3.5v13c0 1.94-1.56 3.5-3.5 3.5h-8.4c-1.94 0-3.5-1.56-3.5-3.5v-13c0-1.94 1.56-3.5 3.5-3.5zm-1.5 3.5v13c0 .83.67 1.5 1.5 1.5h8.4c.83 0 1.5-.67 1.5-1.5v-13c0-.83-.67-1.5-1.5-1.5h-8.4c-.83 0-1.5.67-1.5 1.5zm4.2 3.5c0-.28.22-.5.5-.5h3.6c.28 0 .5.22.5.5s-.22.5-.5.5h-3.6c-.28 0-.5-.22-.5-.5zm0 3c0-.28.22-.5.5-.5h3.6c.28 0 .5.22.5.5s-.22.5-.5.5h-3.6c-.28 0-.5-.22-.5-.5zm0 3c0-.28.22-.5.5-.5h3.6c.28 0 .5.22.5.5s-.22.5-.5.5h-3.6c-.28 0-.5-.22-.5-.5z" />
                    </svg>
                    <span>Google</span>
                  </div>
                  <button className="px-2 py-1 rounded-md bg-cyan-600 hover:bg-cyan-500 text-xs">
                    Connect
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-white/10">
              <button
                className="px-3 py-1.5 rounded-md bg-black/30 hover:bg-black/50 text-sm"
                onClick={() => setShowLinkedAccountsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </SlideCard>
  );
};

export default ManageSettings;
