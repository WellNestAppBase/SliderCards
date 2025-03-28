import { supabase } from "./auth";

interface ProfileData {
  id: string;
  full_name?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  mood?: string;
  context?: string;
  [key: string]: any; // Allow additional fields
}

/**
 * Update a user's mood
 * @param userId - The user's ID
 * @param mood - The new mood value
 * @param context - Optional context for the mood
 * @returns Object containing success status and any error
 */
export async function updateUserMood(
  userId: string,
  mood: number,
  context?: string,
): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const updateData: { mood: string; context?: string } = {
      mood: mood.toString(),
    };

    if (context !== undefined) {
      updateData.context = context;
    }

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId);

    if (error) {
      console.error("Error updating user mood:", error);
      return { success: false, error };
    }

    // Add to mood history if we have a mood_history table
    try {
      await supabase.from("mood_history").insert({
        user_id: userId,
        mood: mood.toString(),
        context: context || null,
        created_at: new Date().toISOString(),
      });
    } catch (historyError) {
      // Don't fail the whole operation if mood history fails
      console.warn("Could not save to mood history:", historyError);
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error updating user mood:", err);
    return {
      success: false,
      error: new Error(
        "An unexpected error occurred while updating user mood.",
      ),
    };
  }
}

/**
 * Update a user's profile data
 * @param profileData - Object containing profile data to update
 * @returns Object containing success status and any error
 */
export async function updateUserProfile(profileData: ProfileData): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const { id, ...updateData } = profileData;

    // Remove any undefined values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating user profile:", error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error updating user profile:", err);
    return {
      success: false,
      error: new Error(
        "An unexpected error occurred while updating user profile.",
      ),
    };
  }
}

/**
 * Fetch a user's profile data
 * @param userId - The user's ID
 * @returns Object containing profile data and any error
 */
export async function fetchUserProfile(userId: string): Promise<{
  data: any | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error fetching user profile:", err);
    return {
      data: null,
      error: new Error(
        "An unexpected error occurred while fetching user profile.",
      ),
    };
  }
}

/**
 * Create a new user profile if it doesn't exist
 * @param userId - The user's ID
 * @param email - The user's email
 * @param fullName - The user's full name (optional)
 * @returns Object containing success status and any error
 */
export async function createUserProfile(
  userId: string,
  email: string,
  fullName?: string,
): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    // If profile exists, don't create a new one
    if (existingProfile) {
      return { success: true, error: null };
    }

    // Create new profile
    const { error } = await supabase.from("profiles").insert([
      {
        id: userId,
        email,
        full_name: fullName || email.split("@")[0], // Use part of email as name if not provided
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        mood: "2", // Default to neutral mood
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error creating user profile:", error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error creating user profile:", err);
    return {
      success: false,
      error: new Error(
        "An unexpected error occurred while creating user profile.",
      ),
    };
  }
}
