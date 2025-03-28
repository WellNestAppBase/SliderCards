import { supabase } from "./auth";

export interface UserSearchResult {
  id: string;
  full_name: string;
  avatar_url: string;
  email?: string;
}

export interface ConnectionRequest {
  id: string;
  sender_id: string;
  recipient_id: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  sender?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  recipient?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

/**
 * Search for users by name or email
 */
export async function searchUsers(query: string): Promise<{
  data: UserSearchResult[];
  error: Error | null;
}> {
  try {
    if (!query || query.length < 3) {
      return { data: [], error: null };
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, email")
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(10);

    if (error) {
      console.error("Error searching users:", error);
      return { data: [], error };
    }

    return { data: data as UserSearchResult[], error: null };
  } catch (err) {
    console.error("Unexpected error searching users:", err);
    return {
      data: [],
      error: new Error("An unexpected error occurred while searching users."),
    };
  }
}

/**
 * Send a connection request to another user
 */
export async function sendConnectionRequest(
  senderId: string,
  recipientId: string,
): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    // Check if a connection request already exists
    const { data: existingRequest, error: checkError } = await supabase
      .from("connection_requests")
      .select("*")
      .or(
        `and(sender_id.eq.${senderId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${senderId})`,
      )
      .in("status", ["pending", "accepted"]);

    if (checkError) {
      console.error("Error checking existing connection request:", checkError);
      return { success: false, error: checkError };
    }

    if (existingRequest && existingRequest.length > 0) {
      return {
        success: false,
        error: new Error(
          "A connection request already exists between these users.",
        ),
      };
    }

    // Create a new connection request
    const { error } = await supabase.from("connection_requests").insert({
      sender_id: senderId,
      recipient_id: recipientId,
      status: "pending",
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error sending connection request:", error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error sending connection request:", err);
    return {
      success: false,
      error: new Error(
        "An unexpected error occurred while sending the connection request.",
      ),
    };
  }
}

/**
 * Get pending connection requests for a user
 */
export async function getPendingConnectionRequests(userId: string): Promise<{
  data: ConnectionRequest[];
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from("connection_requests")
      .select(
        "*, sender:sender_id(id, full_name, avatar_url), recipient:recipient_id(id, full_name, avatar_url)",
      )
      .eq("recipient_id", userId)
      .eq("status", "pending");

    if (error) {
      console.error("Error fetching connection requests:", error);
      return { data: [], error };
    }

    return { data: data as ConnectionRequest[], error: null };
  } catch (err) {
    console.error("Unexpected error fetching connection requests:", err);
    return {
      data: [],
      error: new Error(
        "An unexpected error occurred while fetching connection requests.",
      ),
    };
  }
}

/**
 * Accept a connection request
 */
export async function acceptConnectionRequest(requestId: string): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    // Get the connection request details
    const { data: requestData, error: fetchError } = await supabase
      .from("connection_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (fetchError) {
      console.error("Error fetching connection request:", fetchError);
      return { success: false, error: fetchError };
    }

    // Update the request status to accepted
    const { error: updateError } = await supabase
      .from("connection_requests")
      .update({ status: "accepted" })
      .eq("id", requestId);

    if (updateError) {
      console.error("Error accepting connection request:", updateError);
      return { success: false, error: updateError };
    }

    // Create connection entries in the connections table (if you have one)
    // This is a simplified example - you might want to create entries for both users
    const { error: connectionError } = await supabase
      .from("connections")
      .insert([
        {
          user_id: requestData.recipient_id,
          connection_id: requestData.sender_id,
          created_at: new Date().toISOString(),
        },
        {
          user_id: requestData.sender_id,
          connection_id: requestData.recipient_id,
          created_at: new Date().toISOString(),
        },
      ]);

    if (connectionError) {
      console.error("Error creating connection entries:", connectionError);
      return { success: false, error: connectionError };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error accepting connection request:", err);
    return {
      success: false,
      error: new Error(
        "An unexpected error occurred while accepting the connection request.",
      ),
    };
  }
}

/**
 * Decline a connection request
 */
export async function declineConnectionRequest(requestId: string): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const { error } = await supabase
      .from("connection_requests")
      .update({ status: "declined" })
      .eq("id", requestId);

    if (error) {
      console.error("Error declining connection request:", error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error declining connection request:", err);
    return {
      success: false,
      error: new Error(
        "An unexpected error occurred while declining the connection request.",
      ),
    };
  }
}

/**
 * Get all connections for a user
 */
export async function getUserConnections(userId: string): Promise<{
  data: any[];
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from("connections")
      .select(
        "*, profile:connection_id(id, full_name, avatar_url, mood, context)",
      )
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user connections:", error);
      return { data: [], error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error fetching user connections:", err);
    return {
      data: [],
      error: new Error(
        "An unexpected error occurred while fetching user connections.",
      ),
    };
  }
}

/**
 * Remove a connection between users
 */
export async function removeConnection(
  userId: string,
  connectionId: string,
): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    // Remove both connection entries
    const { error } = await supabase
      .from("connections")
      .delete()
      .or(
        `and(user_id.eq.${userId},connection_id.eq.${connectionId}),and(user_id.eq.${connectionId},connection_id.eq.${userId})`,
      );

    if (error) {
      console.error("Error removing connection:", error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error removing connection:", err);
    return {
      success: false,
      error: new Error(
        "An unexpected error occurred while removing the connection.",
      ),
    };
  }
}
