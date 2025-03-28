import { supabase } from "./auth";

export interface GroupMember {
  id: string;
  name: string;
  mood: number;
  avatar: string;
}

export interface Group {
  id: number;
  name: string;
  members: GroupMember[];
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch all groups for a user
 * @param userId - The user's ID
 * @returns Object containing groups data and any error
 */
export async function fetchUserGroups(userId: string): Promise<{
  data: Group[] | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user groups:", error);
      return { data: null, error };
    }

    // For each group, fetch its members
    const groupsWithMembers = await Promise.all(
      data.map(async (group) => {
        const { data: membersData, error: membersError } = await supabase
          .from("group_members")
          .select("*")
          .eq("group_id", group.id);

        if (membersError) {
          console.error("Error fetching group members:", membersError);
          return { ...group, members: [] };
        }

        return { ...group, members: membersData || [] };
      }),
    );

    return { data: groupsWithMembers, error: null };
  } catch (err) {
    console.error("Unexpected error fetching user groups:", err);
    return {
      data: null,
      error: new Error(
        "An unexpected error occurred while fetching user groups.",
      ),
    };
  }
}

/**
 * Create a new group
 * @param userId - The user's ID
 * @param groupName - The name of the new group
 * @returns Object containing the new group ID and any error
 */
export async function createGroup(
  userId: string,
  groupName: string,
): Promise<{
  data: { id: number } | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from("groups")
      .insert([
        {
          name: groupName,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Error creating group:", error);
      return { data: null, error };
    }

    return { data: { id: data[0].id }, error: null };
  } catch (err) {
    console.error("Unexpected error creating group:", err);
    return {
      data: null,
      error: new Error(
        "An unexpected error occurred while creating the group.",
      ),
    };
  }
}

/**
 * Update an existing group
 * @param groupId - The group ID
 * @param groupName - The updated name of the group
 * @returns Object containing success status and any error
 */
export async function updateGroup(
  groupId: number,
  groupName: string,
): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const { error } = await supabase
      .from("groups")
      .update({
        name: groupName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", groupId);

    if (error) {
      console.error("Error updating group:", error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error updating group:", err);
    return {
      success: false,
      error: new Error(
        "An unexpected error occurred while updating the group.",
      ),
    };
  }
}

/**
 * Delete a group
 * @param groupId - The group ID
 * @returns Object containing success status and any error
 */
export async function deleteGroup(groupId: number): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    // First delete all members of the group
    const { error: membersError } = await supabase
      .from("group_members")
      .delete()
      .eq("group_id", groupId);

    if (membersError) {
      console.error("Error deleting group members:", membersError);
      return { success: false, error: membersError };
    }

    // Then delete the group itself
    const { error } = await supabase.from("groups").delete().eq("id", groupId);

    if (error) {
      console.error("Error deleting group:", error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error deleting group:", err);
    return {
      success: false,
      error: new Error(
        "An unexpected error occurred while deleting the group.",
      ),
    };
  }
}

/**
 * Add a member to a group
 * @param groupId - The group ID
 * @param member - The member to add
 * @returns Object containing success status and any error
 */
export async function addGroupMember(
  groupId: number,
  member: Omit<GroupMember, "id">,
): Promise<{
  success: boolean;
  error: Error | null;
  memberId?: string;
}> {
  try {
    const memberId = crypto.randomUUID();
    const { error } = await supabase.from("group_members").insert([
      {
        id: memberId,
        group_id: groupId,
        name: member.name,
        mood: member.mood,
        avatar: member.avatar,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error adding group member:", error);
      return { success: false, error };
    }

    return { success: true, error: null, memberId };
  } catch (err) {
    console.error("Unexpected error adding group member:", err);
    return {
      success: false,
      error: new Error(
        "An unexpected error occurred while adding the group member.",
      ),
    };
  }
}

/**
 * Remove a member from a group
 * @param memberId - The member ID
 * @returns Object containing success status and any error
 */
export async function removeGroupMember(memberId: string): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("id", memberId);

    if (error) {
      console.error("Error removing group member:", error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error removing group member:", err);
    return {
      success: false,
      error: new Error(
        "An unexpected error occurred while removing the group member.",
      ),
    };
  }
}
