import React, { useState, useEffect, useCallback } from "react";
import SlideCard from "../SlideCard";
import { MoodOption } from "../MoodSelector";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "../../../components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../services/auth";
import {
  fetchPrivacySettings,
  updateGlobalVisibility,
  updateHiddenMoods,
  updateConnectionSettings,
  ConnectionSetting,
} from "../../../services/privacyService";

interface PrivacyProps {
  currentMood: number;
  setCurrentMood: (index: number) => void;
  moodOptions: MoodOption[];
  onContextSubmit: (context: string) => void;
  cardStyle: React.CSSProperties;
}

interface Connection {
  id: string | number;
  name: string;
  avatar: string;
  canSeeAllMoods: boolean;
}

// Function to export user data
const exportUserData = async (userId: string) => {
  try {
    // Fetch user profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) throw profileError;

    // Fetch user privacy settings
    const { data: privacyData, error: privacyError } = await supabase
      .from("privacy_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (privacyError && privacyError.code !== "PGRST116") throw privacyError;

    // Fetch user connections
    const { data: connectionsData, error: connectionsError } = await supabase
      .from("connections")
      .select("*")
      .eq("user_id", userId);

    if (connectionsError) throw connectionsError;

    // Fetch user mood history (if you have a table for this)
    const { data: moodHistoryData, error: moodHistoryError } = await supabase
      .from("mood_history")
      .select("*")
      .eq("user_id", userId);

    if (moodHistoryError && moodHistoryError.code !== "PGRST116")
      throw moodHistoryError;

    // Combine all data
    const userData = {
      profile: profileData,
      privacy_settings: privacyData || null,
      connections: connectionsData || [],
      mood_history: moodHistoryData || [],
      exported_at: new Date().toISOString(),
    };

    return { data: userData, error: null };
  } catch (error) {
    console.error("Error exporting user data:", error);
    return { data: null, error };
  }
};

// Function to delete mood history
const deleteMoodHistory = async (userId: string) => {
  try {
    // Update the user's mood to neutral
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ mood: "2", context: null })
      .eq("id", userId);

    if (profileError) throw profileError;

    // Delete mood history entries (if you have a table for this)
    const { error: historyError } = await supabase
      .from("mood_history")
      .delete()
      .eq("user_id", userId);

    if (historyError && historyError.code !== "PGRST116") throw historyError;

    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting mood history:", error);
    return { success: false, error };
  }
};

const Privacy: React.FC<PrivacyProps> = ({
  currentMood,
  setCurrentMood,
  moodOptions,
  onContextSubmit,
  cardStyle,
}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("visibility"); // visibility, data, terms
  const [globalVisibility, setGlobalVisibility] = useState("all"); // all, selected, none
  const [hiddenMoods, setHiddenMoods] = useState<number[]>([5]); // Hide "Urgent" by default
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // State for connections
  const [connections, setConnections] = useState<Connection[]>([]);

  // Load user connections
  const loadUserConnections = async () => {
    if (!user) return;

    try {
      // Import the getUserConnections function from connectionService
      const { getUserConnections } = await import(
        "../../../services/connectionService"
      );

      const { data, error } = await getUserConnections(user.id);
      if (error) {
        console.error("Error loading user connections:", error);
        toast({
          title: "Error",
          description: "Failed to load connections. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Transform the data to match our UI format
      const formattedConnections = data.map((conn) => ({
        id: conn.connection_id,
        name: conn.profile?.full_name || "Unknown User",
        avatar:
          conn.profile?.avatar_url ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${conn.connection_id}`,
        canSeeAllMoods: true, // Default value, will be updated from privacy settings
      }));

      setConnections(formattedConnections);
    } catch (err) {
      console.error("Unexpected error loading user connections:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Fetch privacy settings and connections on component mount
  useEffect(() => {
    if (user) {
      loadPrivacySettings();
      loadUserConnections();
    }
  }, [user]);

  const loadPrivacySettings = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await fetchPrivacySettings(user.id);
      if (error) {
        console.error("Error loading privacy settings:", error);
        toast({
          title: "Error",
          description: "Failed to load privacy settings. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setGlobalVisibility(data.global_visibility);
        setHiddenMoods(data.hidden_moods || [5]);

        // Update connections with saved settings
        if (data.connection_settings && data.connection_settings.length > 0) {
          const updatedConnections = connections.map((conn) => {
            const savedSetting = data.connection_settings.find(
              (setting: ConnectionSetting) =>
                setting.connection_id === String(conn.id),
            );
            return {
              ...conn,
              canSeeAllMoods: savedSetting
                ? savedSetting.can_see_all_moods
                : conn.canSeeAllMoods,
            };
          });
          setConnections(updatedConnections);
        }
      }
    } catch (err) {
      console.error("Unexpected error loading privacy settings:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle global visibility change
  const handleGlobalVisibilityChange = async (visibility: string) => {
    if (!user) return;
    setGlobalVisibility(visibility);

    setIsSaving(true);
    try {
      const { success, error } = await updateGlobalVisibility(
        user.id,
        visibility,
      );
      if (!success) {
        console.error("Error saving global visibility:", error);
        toast({
          title: "Error",
          description: "Failed to save visibility settings. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Visibility settings saved successfully.",
      });
    } catch (err) {
      console.error("Unexpected error saving global visibility:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle mood visibility toggle
  const handleMoodVisibilityToggle = async (
    moodIndex: number,
    isVisible: boolean,
  ) => {
    if (!user) return;

    let newHiddenMoods: number[];
    if (isVisible) {
      // Remove from hidden moods
      newHiddenMoods = hiddenMoods.filter((idx) => idx !== moodIndex);
    } else {
      // Add to hidden moods
      newHiddenMoods = [...hiddenMoods, moodIndex];
    }

    setHiddenMoods(newHiddenMoods);

    setIsSaving(true);
    try {
      const { success, error } = await updateHiddenMoods(
        user.id,
        newHiddenMoods,
      );
      if (!success) {
        console.error("Error saving hidden moods:", error);
        toast({
          title: "Error",
          description:
            "Failed to save mood visibility settings. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Mood visibility settings saved successfully.",
      });
    } catch (err) {
      console.error("Unexpected error saving hidden moods:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle connection visibility toggle
  const handleConnectionVisibilityToggle = async (
    connectionId: string | number,
    canSeeAllMoods: boolean,
  ) => {
    if (!user) return;

    // Update local state
    const updatedConnections = connections.map((conn) =>
      conn.id === connectionId ? { ...conn, canSeeAllMoods } : conn,
    );
    setConnections(updatedConnections);

    // Prepare connection settings for API
    const connectionSettings: ConnectionSetting[] = updatedConnections.map(
      (conn) => ({
        connection_id: String(conn.id),
        can_see_all_moods: conn.canSeeAllMoods,
      }),
    );

    setIsSaving(true);
    try {
      const { success, error } = await updateConnectionSettings(
        user.id,
        connectionSettings,
      );
      if (!success) {
        console.error("Error saving connection settings:", error);
        toast({
          title: "Error",
          description: "Failed to save connection settings. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Connection settings saved successfully.",
      });
    } catch (err) {
      console.error("Unexpected error saving connection settings:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle exporting user data
  const handleExportData = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to export your data.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await exportUserData(user.id);
      if (error) {
        toast({
          title: "Error",
          description: "Failed to export data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Convert data to JSON string
      const jsonData = JSON.stringify(data, null, 2);

      // Create a blob and download link
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `b2gthr_data_export_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      setTimeout(() => URL.revokeObjectURL(url), 100);

      toast({
        title: "Success",
        description: "Your data has been exported successfully.",
      });
    } catch (err) {
      console.error("Unexpected error exporting data:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle deleting mood history
  const handleDeleteMoodHistory = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete your mood history.",
        variant: "destructive",
      });
      return;
    }

    // Show confirmation dialog
    if (
      !window.confirm(
        "Are you sure you want to delete your entire mood history? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsSaving(true);
    try {
      const { success, error } = await deleteMoodHistory(user.id);
      if (!success) {
        toast({
          title: "Error",
          description: "Failed to delete mood history. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Your mood history has been deleted successfully.",
      });

      // Update the current mood to neutral
      setCurrentMood(2);
    } catch (err) {
      console.error("Unexpected error deleting mood history:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle deleting user account
  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  // Confirm account deletion
  const confirmDeleteAccount = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete your account.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Delete user data from all tables
      // Note: We're using RLS policies, so these operations will only succeed if the user is authorized

      // Delete user settings
      const { error: settingsError } = await supabase
        .from("user_settings")
        .delete()
        .eq("user_id", user.id);

      if (settingsError && settingsError.code !== "PGRST116") {
        console.warn("Error deleting user settings:", settingsError);
      }

      // Delete privacy settings
      const { error: privacyError } = await supabase
        .from("privacy_settings")
        .delete()
        .eq("user_id", user.id);

      if (privacyError && privacyError.code !== "PGRST116") {
        console.warn("Error deleting privacy settings:", privacyError);
      }

      // Delete connection requests
      const { error: requestsError } = await supabase
        .from("connection_requests")
        .delete()
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);

      if (requestsError && requestsError.code !== "PGRST116") {
        console.warn("Error deleting connection requests:", requestsError);
      }

      // Delete connections
      const { error: connectionsError } = await supabase
        .from("connections")
        .delete()
        .or(`user_id.eq.${user.id},connection_id.eq.${user.id}`);

      if (connectionsError && connectionsError.code !== "PGRST116") {
        console.warn("Error deleting connections:", connectionsError);
      }

      // Delete mood history
      const { error: moodHistoryError } = await supabase
        .from("mood_history")
        .delete()
        .eq("user_id", user.id);

      if (moodHistoryError && moodHistoryError.code !== "PGRST116") {
        console.warn("Error deleting mood history:", moodHistoryError);
      }

      // Delete profile
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (profileError) {
        console.warn("Error deleting profile:", profileError);
      }

      // Since we can't use admin.deleteUser from the client, we'll sign out the user
      // and display a message about contacting support for full account deletion
      toast({
        title: "Account Data Deleted",
        description:
          "Your account data has been deleted. Please contact support to fully delete your authentication account.",
      });

      // Sign out and redirect to home
      await signOut();
      navigate("/");
    } catch (err) {
      console.error("Unexpected error deleting account:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <SlideCard
      title="Privacy"
      currentMood={currentMood}
      setCurrentMood={setCurrentMood}
      moodOptions={moodOptions}
      onContextSubmit={onContextSubmit}
      cardStyle={cardStyle}
    >
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-white/20">
          <button
            className={`px-4 py-2 font-medium ${activeTab === "visibility" ? "border-b-2 border-cyan-500 text-white" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("visibility")}
          >
            Mood Visibility
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "data" ? "border-b-2 border-cyan-500 text-white" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("data")}
          >
            Data Settings
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "terms" ? "border-b-2 border-cyan-500 text-white" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("terms")}
          >
            Terms & Policies
          </button>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          /* Tab content */
          <div className="max-h-[350px] overflow-y-auto pr-2">
            {activeTab === "visibility" && (
              <div className="space-y-4">
                <p className="opacity-80">
                  Control who can see your mood and when. You can hide specific
                  moods from certain connections.
                </p>

                <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                  <h4 className="font-medium mb-3">Global Mood Visibility</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="visibility"
                          className="accent-cyan-500"
                          checked={globalVisibility === "all"}
                          onChange={() => handleGlobalVisibilityChange("all")}
                          disabled={isSaving}
                        />
                        <span>All connections can see my mood</span>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="visibility"
                          className="accent-cyan-500"
                          checked={globalVisibility === "selected"}
                          onChange={() =>
                            handleGlobalVisibilityChange("selected")
                          }
                          disabled={isSaving}
                        />
                        <span>Only selected connections can see my mood</span>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="visibility"
                          className="accent-cyan-500"
                          checked={globalVisibility === "none"}
                          onChange={() => handleGlobalVisibilityChange("none")}
                          disabled={isSaving}
                        />
                        <span>No one can see my mood</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                  <h4 className="font-medium mb-3">Hide Specific Moods</h4>
                  <div className="space-y-3">
                    {moodOptions.map((mood, idx) => {
                      const isVisible = !hiddenMoods.includes(idx);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: mood.color }}
                            ></div>
                            <span>{mood.name}</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={isVisible}
                              onChange={() =>
                                handleMoodVisibilityToggle(idx, !isVisible)
                              }
                              disabled={isSaving}
                            />
                            <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                            <span className="ml-2 text-sm font-medium">
                              {isVisible ? "Visible" : "Hidden"}
                            </span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                  <h4 className="font-medium mb-3">Per-Connection Settings</h4>
                  <div className="space-y-3">
                    {connections.map((connection) => (
                      <div
                        key={connection.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30">
                            <img
                              src={connection.avatar}
                              alt={connection.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span>{connection.name}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={connection.canSeeAllMoods}
                            onChange={() =>
                              handleConnectionVisibilityToggle(
                                connection.id,
                                !connection.canSeeAllMoods,
                              )
                            }
                            disabled={isSaving}
                          />
                          <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                          <span className="ml-2 text-sm font-medium">
                            {connection.canSeeAllMoods
                              ? "All moods"
                              : "Limited"}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "data" && (
              <div className="space-y-4">
                <p className="opacity-80">
                  Manage how your data is stored, shared, and used within the
                  app.
                </p>

                <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                  <h4 className="font-medium mb-3">Data Collection</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Mood History</p>
                        <p className="text-sm opacity-70">
                          Store your mood history for personal tracking
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Usage Analytics</p>
                        <p className="text-sm opacity-70">
                          Help us improve by sharing anonymous usage data
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Location Data</p>
                        <p className="text-sm opacity-70">
                          Allow location-based features
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                  <h4 className="font-medium mb-3">Data Management</h4>
                  <div className="space-y-3">
                    <button
                      className="w-full py-2 rounded-md bg-black/30 hover:bg-black/50 text-sm text-left px-3 flex justify-between items-center"
                      onClick={handleExportData}
                      disabled={isSaving}
                    >
                      <span>Export My Data</span>
                      {isSaving && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      )}
                    </button>
                    <button
                      className="w-full py-2 rounded-md bg-black/30 hover:bg-black/50 text-sm text-left px-3 flex justify-between items-center"
                      onClick={handleDeleteMoodHistory}
                      disabled={isSaving}
                    >
                      <span>Delete Mood History</span>
                      {isSaving && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      )}
                    </button>
                    <button
                      className="w-full py-2 rounded-md bg-red-900/30 hover:bg-red-900/50 text-sm text-left px-3 flex justify-between items-center"
                      onClick={handleDeleteAccount}
                      disabled={isSaving}
                    >
                      <span>Delete My Account</span>
                      {isSaving && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "terms" && (
              <div className="space-y-4">
                <p className="opacity-80">
                  Review our terms of service, privacy policy, and other legal
                  documents.
                </p>

                <div className="space-y-3">
                  <a
                    href="#"
                    className="block p-4 rounded-lg bg-black/20 border border-white/10 hover:bg-black/30"
                  >
                    <h4 className="font-medium">Terms of Service</h4>
                    <p className="text-sm opacity-70 mt-1">
                      Last updated: June 1, 2023
                    </p>
                  </a>
                  <a
                    href="#"
                    className="block p-4 rounded-lg bg-black/20 border border-white/10 hover:bg-black/30"
                  >
                    <h4 className="font-medium">Privacy Policy</h4>
                    <p className="text-sm opacity-70 mt-1">
                      Last updated: June 1, 2023
                    </p>
                  </a>
                  <a
                    href="#"
                    className="block p-4 rounded-lg bg-black/20 border border-white/10 hover:bg-black/30"
                  >
                    <h4 className="font-medium">Data Processing Agreement</h4>
                    <p className="text-sm opacity-70 mt-1">
                      Last updated: June 1, 2023
                    </p>
                  </a>
                  <a
                    href="#"
                    className="block p-4 rounded-lg bg-black/20 border border-white/10 hover:bg-black/30"
                  >
                    <h4 className="font-medium">Cookie Policy</h4>
                    <p className="text-sm opacity-70 mt-1">
                      Last updated: June 1, 2023
                    </p>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20">
          <div className="bg-gray-900 p-4 rounded-lg w-80 border border-white/20">
            <h3 className="text-lg font-medium mb-3 text-red-400">
              Delete Account
            </h3>

            <p className="mb-4 text-sm">
              Are you sure you want to delete your account? This action cannot
              be undone and all your data will be permanently deleted.
            </p>

            <div className="flex justify-end space-x-2 pt-2 border-t border-white/10">
              <button
                className="px-3 py-1.5 rounded-md bg-black/30 hover:bg-black/50 text-sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-500 text-sm flex items-center gap-1"
                onClick={confirmDeleteAccount}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>Delete Account</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </SlideCard>
  );
};

export default Privacy;
