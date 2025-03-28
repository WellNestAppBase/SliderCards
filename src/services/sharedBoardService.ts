import { supabase } from "./auth";

export interface SharedBoard {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  members: string[]; // Array of user IDs
  content: any; // This will store the whiteboard content (notes, drawings, etc.)
}

/**
 * Create a new shared board between users
 * @param userId - The ID of the user creating the board
 * @param connectionId - The ID of the connection to share with
 * @param title - Optional title for the shared board
 * @returns Object containing the created board ID and any error
 */
export async function createSharedBoard(
  userId: string,
  connectionId: string,
  title: string = "Shared Board",
): Promise<{
  boardId: string | null;
  error: Error | null;
}> {
  try {
    // Create a new shared board
    const newBoard = {
      title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: userId,
      members: [userId, connectionId],
      content: {}, // Empty content initially
    };

    const { data, error } = await supabase
      .from("shared_boards")
      .insert(newBoard)
      .select()
      .single();

    if (error) {
      console.error("Error creating shared board:", error);
      return { boardId: null, error };
    }

    // Update both users' connections to include the shared board ID
    await updateConnectionSharedBoard(userId, connectionId, data.id);

    return { boardId: data.id, error: null };
  } catch (err) {
    console.error("Unexpected error creating shared board:", err);
    return {
      boardId: null,
      error: new Error(
        "An unexpected error occurred while creating the shared board.",
      ),
    };
  }
}

/**
 * Update the connection records to include the shared board ID
 * @param userId - The user's ID
 * @param connectionId - The connection's ID
 * @param boardId - The shared board ID
 */
async function updateConnectionSharedBoard(
  userId: string,
  connectionId: string,
  boardId: string,
): Promise<void> {
  try {
    // This is a placeholder for the actual implementation
    // In a real app, you would update the connection records in your database
    console.log(
      `Updating connection between ${userId} and ${connectionId} with shared board ${boardId}`,
    );

    // For now, we'll just log this. In a real implementation, you would:
    // 1. Update the user's connection record
    // 2. Update the connection's user record
  } catch (err) {
    console.error("Error updating connection shared board:", err);
  }
}

/**
 * Fetch a shared board by ID
 * @param boardId - The shared board ID
 * @returns Object containing the shared board data and any error
 */
export async function fetchSharedBoard(boardId: string): Promise<{
  board: SharedBoard | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from("shared_boards")
      .select("*")
      .eq("id", boardId)
      .single();

    if (error) {
      console.error("Error fetching shared board:", error);
      return { board: null, error };
    }

    return { board: data as SharedBoard, error: null };
  } catch (err) {
    console.error("Unexpected error fetching shared board:", err);
    return {
      board: null,
      error: new Error(
        "An unexpected error occurred while fetching the shared board.",
      ),
    };
  }
}

/**
 * Get all shared boards for a user
 * @param userId - The user's ID
 * @returns Object containing an array of shared boards and any error
 */
export async function getUserSharedBoards(userId: string): Promise<{
  boards: SharedBoard[];
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from("shared_boards")
      .select("*")
      .contains("members", [userId]);

    if (error) {
      console.error("Error fetching user shared boards:", error);
      return { boards: [], error };
    }

    return { boards: data as SharedBoard[], error: null };
  } catch (err) {
    console.error("Unexpected error fetching user shared boards:", err);
    return {
      boards: [],
      error: new Error(
        "An unexpected error occurred while fetching user shared boards.",
      ),
    };
  }
}
