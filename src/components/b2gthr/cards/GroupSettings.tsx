import React, { useState, useEffect } from "react";
import SlideCard from "../SlideCard";
import { MoodOption } from "../MoodSelector";
import { useAuth } from "../../../contexts/AuthContext";
import {
  fetchUserGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  addGroupMember,
  removeGroupMember,
  Group,
  GroupMember,
} from "../../../services/groupService";
import {
  AlertTriangle,
  Plus,
  Edit,
  Eye,
  Trash2,
  X,
  Check,
  Loader2,
} from "lucide-react";

interface GroupSettingsProps {
  currentMood: number;
  setCurrentMood: (index: number) => void;
  moodOptions: MoodOption[];
  onContextSubmit: (context: string) => void;
  cardStyle: React.CSSProperties;
}

interface NewMemberForm {
  name: string;
  mood: number;
  avatar: string;
}

const GroupSettings: React.FC<GroupSettingsProps> = ({
  currentMood,
  setCurrentMood,
  moodOptions,
  onContextSubmit,
  cardStyle,
}) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editingGroupName, setEditingGroupName] = useState("");
  const [showAddMemberForm, setShowAddMemberForm] = useState<number | null>(
    null,
  );
  const [newMember, setNewMember] = useState<NewMemberForm>({
    name: "",
    mood: 2, // Default to neutral
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substring(7)}`,
  });

  // Fetch groups on component mount
  useEffect(() => {
    if (user) {
      loadGroups();
    }
  }, [user]);

  const loadGroups = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await fetchUserGroups(user.id);

      if (error) {
        throw error;
      }

      setGroups(data || []);
    } catch (err) {
      console.error("Error loading groups:", err);
      setError("Failed to load groups. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to check if any group member has an urgent mood
  const hasUrgentMember = (members: GroupMember[]) => {
    return members.some((member) => member.mood === 5);
  };

  // Sort groups to prioritize those with urgent members
  const sortedGroups = [...groups].sort((a, b) => {
    const aHasUrgent = hasUrgentMember(a.members);
    const bHasUrgent = hasUrgentMember(b.members);
    if (aHasUrgent && !bHasUrgent) return -1;
    if (!aHasUrgent && bHasUrgent) return 1;
    return 0;
  });

  // Handle creating a new group
  const handleCreateGroup = async () => {
    if (!user || !newGroupName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await createGroup(user.id, newGroupName.trim());

      if (error) {
        throw error;
      }

      // Reload groups to get the new group
      await loadGroups();

      // Reset form
      setNewGroupName("");
      setShowNewGroupForm(false);
    } catch (err) {
      console.error("Error creating group:", err);
      setError("Failed to create group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle updating a group
  const handleUpdateGroup = async () => {
    if (!editingGroupId || !editingGroupName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { success, error } = await updateGroup(
        editingGroupId,
        editingGroupName.trim(),
      );

      if (error) {
        throw error;
      }

      // Reload groups to get the updated group
      await loadGroups();

      // Reset form
      setEditingGroupId(null);
      setEditingGroupName("");
    } catch (err) {
      console.error("Error updating group:", err);
      setError("Failed to update group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a group
  const handleDeleteGroup = async (groupId: number) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;

    setLoading(true);
    setError(null);

    try {
      const { success, error } = await deleteGroup(groupId);

      if (error) {
        throw error;
      }

      // Reload groups to remove the deleted group
      await loadGroups();
    } catch (err) {
      console.error("Error deleting group:", err);
      setError("Failed to delete group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a member to a group
  const handleAddMember = async (groupId: number) => {
    if (!newMember.name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { success, error } = await addGroupMember(groupId, {
        name: newMember.name.trim(),
        mood: newMember.mood,
        avatar: newMember.avatar,
      });

      if (error) {
        throw error;
      }

      // Reload groups to get the updated members
      await loadGroups();

      // Reset form
      setNewMember({
        name: "",
        mood: 2,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substring(7)}`,
      });
      setShowAddMemberForm(null);
    } catch (err) {
      console.error("Error adding member:", err);
      setError("Failed to add member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle removing a member from a group
  const handleRemoveMember = async (memberId: string) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    setLoading(true);
    setError(null);

    try {
      const { success, error } = await removeGroupMember(memberId);

      if (error) {
        throw error;
      }

      // Reload groups to remove the deleted member
      await loadGroups();
    } catch (err) {
      console.error("Error removing member:", err);
      setError("Failed to remove member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SlideCard
      title="Group Settings"
      currentMood={currentMood}
      setCurrentMood={setCurrentMood}
      moodOptions={moodOptions}
      onContextSubmit={onContextSubmit}
      cardStyle={cardStyle}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <p className="opacity-80">
            Create and manage subgroups of your connected accounts.
          </p>
          {!showNewGroupForm ? (
            <button
              onClick={() => setShowNewGroupForm(true)}
              className="px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-sm flex items-center gap-1"
              disabled={loading}
            >
              <Plus className="h-4 w-4" />
              New Group
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Group name"
                className="px-3 py-1.5 rounded-md bg-black/30 border border-white/20 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                autoFocus
              />
              <button
                onClick={handleCreateGroup}
                className="p-1.5 rounded-md bg-green-600 hover:bg-green-500 text-white"
                disabled={loading || !newGroupName.trim()}
                title="Save"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => {
                  setShowNewGroupForm(false);
                  setNewGroupName("");
                }}
                className="p-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white"
                disabled={loading}
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-md bg-red-900/30 border border-red-500/50 text-red-200 mb-4">
            {error}
          </div>
        )}

        {loading && groups.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-8 opacity-70">
            <p>You don't have any groups yet.</p>
            <p className="text-sm mt-2">
              Create a group to organize your connections.
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2">
            {sortedGroups.map((group) => {
              const hasUrgent = hasUrgentMember(group.members);
              return (
                <div
                  key={group.id}
                  className={`p-4 rounded-lg ${hasUrgent ? "bg-red-900/30 border border-red-500/50" : "bg-black/20 border border-white/10"}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    {editingGroupId === group.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingGroupName}
                          onChange={(e) => setEditingGroupName(e.target.value)}
                          placeholder="Group name"
                          className="px-2 py-1 rounded-md bg-black/30 border border-white/20 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          autoFocus
                        />
                        <button
                          onClick={handleUpdateGroup}
                          className="p-1 rounded-md bg-green-600 hover:bg-green-500 text-white"
                          disabled={loading || !editingGroupName.trim()}
                          title="Save"
                        >
                          {loading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEditingGroupId(null);
                            setEditingGroupName("");
                          }}
                          className="p-1 rounded-md bg-red-600 hover:bg-red-500 text-white"
                          disabled={loading}
                          title="Cancel"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <h3 className="text-lg font-semibold flex items-center">
                        {group.name}
                        {hasUrgent && (
                          <span className="ml-2 text-red-400 animate-pulse">
                            <AlertTriangle className="h-4 w-4" />
                          </span>
                        )}
                      </h3>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingGroupId(group.id);
                          setEditingGroupName(group.name);
                        }}
                        className="p-1.5 rounded-md bg-black/30 hover:bg-black/50"
                        title="Edit group"
                        disabled={loading || editingGroupId !== null}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className="p-1.5 rounded-md bg-black/30 hover:bg-red-900/50"
                        title="Delete group"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {group.members.map((member) => (
                      <div
                        key={member.id}
                        className="relative group"
                        title={`${member.name}: ${moodOptions[member.mood].name}`}
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div
                          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-black"
                          style={{
                            backgroundColor: moodOptions[member.mood].color,
                          }}
                        ></div>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove member"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium bg-black/70 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                          {member.name}
                        </div>
                      </div>
                    ))}
                    {showAddMemberForm === group.id ? (
                      <div className="flex items-center gap-2 p-2 bg-black/30 rounded-lg">
                        <input
                          type="text"
                          value={newMember.name}
                          onChange={(e) =>
                            setNewMember({ ...newMember, name: e.target.value })
                          }
                          placeholder="Member name"
                          className="px-2 py-1 rounded-md bg-black/30 border border-white/20 text-xs w-24 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          autoFocus
                        />
                        <select
                          value={newMember.mood}
                          onChange={(e) =>
                            setNewMember({
                              ...newMember,
                              mood: parseInt(e.target.value),
                            })
                          }
                          className="px-2 py-1 rounded-md bg-black/30 border border-white/20 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        >
                          {moodOptions.map((mood, idx) => (
                            <option key={idx} value={idx}>
                              {mood.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAddMember(group.id)}
                          className="p-1 rounded-md bg-green-600 hover:bg-green-500 text-white"
                          disabled={loading || !newMember.name.trim()}
                          title="Add"
                        >
                          {loading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setShowAddMemberForm(null);
                            setNewMember({
                              name: "",
                              mood: 2,
                              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substring(7)}`,
                            });
                          }}
                          className="p-1 rounded-md bg-red-600 hover:bg-red-500 text-white"
                          disabled={loading}
                          title="Cancel"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowAddMemberForm(group.id)}
                        className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center"
                        title="Add member"
                        disabled={loading}
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-sm opacity-80">
                    <span>{group.members.length} members</span>
                    {hasUrgent && (
                      <span className="text-red-300">
                        Urgent attention needed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SlideCard>
  );
};

export default GroupSettings;
