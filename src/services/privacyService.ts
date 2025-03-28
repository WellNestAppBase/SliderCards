import { supabase } from "./auth";

export interface PrivacySettings {
  id?: string;
  user_id: string;
  global_visibility: string; // 'all', 'selected', 'none'
  hidden_moods: number[]; // Array of mood indices that are hidden
  connection_settings: ConnectionSetting[];
  created_at?: string;
  updated_at?: string;
}

export interface ConnectionSetting {
  connection_id: string;
  can_see_all_moods: boolean;
}

/**
 * Fetch privacy settings for a user
 */
export async function fetchPrivacySettings(userId: string): Promise<{
  data: PrivacySettings | null;
  error: Error | null;
}> {
  try {
    // First check if the user has privacy settings
    const { data, error } = await supabase
      .from("privacy_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is the error code for no rows returned
      console.error("Error fetching privacy settings:", error);
      return { data: null, error };
    }

    if (!data) {
      // If no settings exist, create default settings
      return createDefaultPrivacySettings(userId);
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error fetching privacy settings:", err);
    return {
      data: null,
      error: new Error(
        "An unexpected error occurred while fetching privacy settings.",
      ),
    };
  }
}

/**
 * Create default privacy settings for a new user
 */
export async function createDefaultPrivacySettings(userId: string): Promise<{
  data: PrivacySettings | null;
  error: Error | null;
}> {
  try {
    const defaultSettings: PrivacySettings = {
      user_id: userId,
      global_visibility: "all", // Default to all connections can see mood
      hidden_moods: [5], // Hide "Urgent" mood by default (index 5)
      connection_settings: [], // No connection-specific settings by default
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("privacy_settings")
      .insert(defaultSettings)
      .select()
      .single();

    if (error) {
      console.error("Error creating default privacy settings:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error creating default privacy settings:", err);
    return {
      data: null,
      error: new Error(
        "An unexpected error occurred while creating default privacy settings.",
      ),
    };
  }
}

/**
 * Update privacy settings for a user
 */
export async function updatePrivacySettings(
  settings: PrivacySettings,
): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    // Update the updated_at timestamp
    settings.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from("privacy_settings")
      .upsert(settings)
      .eq("user_id", settings.user_id);

    if (error) {
      console.error("Error updating privacy settings:", error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error updating privacy settings:", err);
    return {
      success: false,
      error: new Error(
        "An unexpected error occurred while updating privacy settings.",
      ),
    };
  }
}

/**
 * Update global visibility setting
 */
export async function updateGlobalVisibility(
  userId: string,
  visibility: string,
): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const { error } = await supabase
      .from("privacy_settings")
      .update({
        global_visibility: visibility,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating global visibility:", error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error updating global visibility:", err);
    return {
      success: false,
      error: new Error(
        "An unexpected error occurred while updating global visibility.",
      ),
    };
  }
}

/**
 * Update hidden moods
 */
export async function updateHiddenMoods(
  userId: string,
  hiddenMoods: number[],
): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const { error } = await supabase
      .from("privacy_settings")
      .update({
        hidden_moods: hiddenMoods,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating hidden moods:", error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error updating hidden moods:", err);
    return {
      success: false,
      error: new Error(
        "An unexpected error occurred while updating hidden moods.",
      ),
    };
  }
}

/**
 * Update connection settings
 */
export async function updateConnectionSettings(
  userId: string,
  connectionSettings: ConnectionSetting[],
): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const { error } = await supabase
      .from("privacy_settings")
      .update({
        connection_settings: connectionSettings,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating connection settings:", error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error updating connection settings:", err);
    return {
      success: false,
      error: new Error(
        "An unexpected error occurred while updating connection settings.",
      ),
    };
  }
}
