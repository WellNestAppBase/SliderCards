import React, { useState, useEffect } from "react";
import SlideCard from "../SlideCard";
import { MoodOption } from "../MoodSelector";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "../../../components/ui/use-toast";
import {
  fetchPrivacySettings,
  updateGlobalVisibility,
  updateHiddenMoods,
  updateConnectionSettings,
  ConnectionSetting,
} from "../../../services/privacyService";
import { createSharedBoard } from "../../../services/sharedBoardService";
import {
  searchUsers,
  sendConnectionRequest,
  getPendingConnectionRequests,
  acceptConnectionRequest,
  declineConnectionRequest,
  getUserConnections,
  removeConnection,
  UserSearchResult,
  ConnectionRequest as ConnectionRequestType,
} from "../../../services/connectionService";

interface ManageConnectionsProps {
  currentMood: number;
  setCurrentMood: (index: number) => void;
  moodOptions: MoodOption[];
  onContextSubmit: (context: string) => void;
  cardStyle: React.CSSProperties;
}

interface Connection {
  id: number;
  name: string;
  mood: number;
  avatar: string;
  visibility?: string;
  canSeeAllMoods: boolean;
  sharedBoardId?: string;
}

interface ConnectionRequestUI {
  id: string;
  name: string;
  avatar: string;
}

interface SuggestedConnection {
  id: number;
  name: string;
  mutualConnections: number;
  avatar: string;
}

const ManageConnections: React.FC<ManageConnectionsProps> = ({
  currentMood,
  setCurrentMood,
  moodOptions,
  onContextSubmit,
  cardStyle,
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("current"); // current, add, requests, privacy
  const [showAddUsernameForm, setShowAddUsernameForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [selectedConnection, setSelectedConnection] =
    useState<Connection | null>(null);
  const [visibilityOption, setVisibilityOption] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isCreatingSharedBoard, setIsCreatingSharedBoard] = useState(false);
  const [selectedConnectionForBoard, setSelectedConnectionForBoard] =
    useState<Connection | null>(null);
  const [sharedBoardTitle, setSharedBoardTitle] = useState("");

  // Privacy settings
  const [globalVisibility, setGlobalVisibility] = useState("all"); // all, selected, none
  const [hiddenMoods, setHiddenMoods] = useState<number[]>([5]); // Hide "Urgent" by default
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock data for connections
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: 1,
      name: "Emma Rodriguez",
      mood: 5, // Urgent
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      visibility: "all",
      canSeeAllMoods: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      mood: 2, // Mild/Neutral
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      visibility: "all",
      canSeeAllMoods: false,
    },
    {
      id: 3,
      name: "Sarah Johnson",
      mood: 1, // Calm and Peaceful
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      visibility: "all",
      canSeeAllMoods: true,
    },
    {
      id: 4,
      name: "David Kim",
      mood: 4, // High Alert
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      visibility: "all",
      canSeeAllMoods: false,
    },
    {
      id: 5,
      name: "Alex Morgan",
      mood: 0, // Deeply Serene
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      visibility: "all",
      canSeeAllMoods: true,
    },
  ]);

  // Connection requests state
  const [connectionRequests, setConnectionRequests] = useState<
    ConnectionRequestUI[]
  >([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  // Mock data for suggested connections
  const [suggestedConnections, setSuggestedConnections] = useState<
    SuggestedConnection[]
  >([
    {
      id: 201,
      name: "Casey Williams",
      mutualConnections: 3,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=casey",
    },
    {
      id: 202,
      name: "Taylor Swift",
      mutualConnections: 2,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=taylor",
    },
    {
      id: 203,
      name: "Jamie Lee",
      mutualConnections: 1,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jamie",
    },
  ]);

  // Fetch privacy settings and connection requests on component mount
  useEffect(() => {
    if (user) {
      loadPrivacySettings();
      loadConnectionRequests();
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

  // Filter connections based on search term
  const filteredConnections = connections.filter((connection) =>
    connection.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Search results state
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Handle adding a new connection by username
  const handleAddByUsername = () => {
    setShowAddUsernameForm(true);
    setSearchResults([]);
  };

  // Handle searching for users
  const handleUserSearch = async () => {
    if (newUsername.trim().length < 3) {
      toast({
        title: "Search Error",
        description: "Please enter at least 3 characters to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await searchUsers(newUsername.trim());
      if (error) {
        toast({
          title: "Search Error",
          description: "Failed to search for users. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Filter out the current user from search results
      const filteredResults = data.filter((result) => result.id !== user?.id);
      setSearchResults(filteredResults);

      if (filteredResults.length === 0) {
        toast({
          title: "No Results",
          description: "No users found matching your search criteria.",
        });
      }
    } catch (err) {
      console.error("Error searching for users:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Handle sending a connection request
  const handleSendConnectionRequest = async (userId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to send connection requests.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { success, error } = await sendConnectionRequest(user.id, userId);
      if (!success) {
        toast({
          title: "Error",
          description:
            error?.message ||
            "Failed to send connection request. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Connection request sent successfully.",
      });

      // Remove the user from search results
      setSearchResults(searchResults.filter((result) => result.id !== userId));

      // Refresh connection requests
      loadConnectionRequests();
    } catch (err) {
      console.error("Error sending connection request:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle submitting the new username form
  const handleUsernameSubmit = () => {
    if (newUsername.trim()) {
      handleUserSearch();
    }
  };

  // Handle importing contacts
  const handleImportContacts = () => {
    // In a real app, this would open the device's contacts
    // For this mock, we'll just add a random new contact
    const randomNames = [
      "Pat Johnson",
      "Sam Wilson",
      "Morgan Freeman",
      "Chris Evans",
      "Scarlett Johansson",
    ];
    const randomName =
      randomNames[Math.floor(Math.random() * randomNames.length)];

    const newContact: Connection = {
      id: Date.now(),
      name: randomName,
      mood: Math.floor(Math.random() * 6), // Random mood
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomName.toLowerCase().replace(/\s+/g, "")}_${Date.now()}`,
      visibility: "all",
      canSeeAllMoods: true,
    };

    setConnections([...connections, newContact]);
    setShowSaveMessage(true);

    // Hide the save message after 3 seconds
    setTimeout(() => {
      setShowSaveMessage(false);
    }, 3000);
  };

  // Handle editing visibility
  const handleEditVisibility = (connection: Connection) => {
    setSelectedConnection(connection);
    setVisibilityOption(connection.visibility || "all");
    setIsEditing(true);
  };

  // Save visibility changes
  const saveVisibilityChanges = () => {
    if (selectedConnection) {
      const updatedConnections = connections.map((conn) =>
        conn.id === selectedConnection.id
          ? { ...conn, visibility: visibilityOption }
          : conn,
      );

      setConnections(updatedConnections);
      setIsEditing(false);
      setSelectedConnection(null);
      setShowSaveMessage(true);

      // Hide the save message after 3 seconds
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 3000);
    }
  };

  // Handle removing a connection
  const handleRemoveConnection = async (id: number) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to remove connections.",
        variant: "destructive",
      });
      return;
    }

    // Show confirmation dialog
    if (!window.confirm("Are you sure you want to remove this connection?")) {
      return;
    }

    setIsSaving(true);
    try {
      const { success, error } = await removeConnection(user.id, String(id));
      if (!success) {
        console.error("Error removing connection:", error);
        toast({
          title: "Error",
          description: "Failed to remove connection. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const updatedConnections = connections.filter((conn) => conn.id !== id);
      setConnections(updatedConnections);

      toast({
        title: "Success",
        description: "Connection removed successfully.",
      });

      setShowSaveMessage(true);
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 3000);
    } catch (err) {
      console.error("Unexpected error removing connection:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle connecting with a suggested connection
  const handleConnect = (suggestedConnection: SuggestedConnection) => {
    // Create a new connection from the suggested connection
    const newConnection: Connection = {
      id: suggestedConnection.id,
      name: suggestedConnection.name,
      mood: 2, // Default to Mild/Neutral
      avatar: suggestedConnection.avatar,
      visibility: "all",
      canSeeAllMoods: true,
    };

    // Add to connections and remove from suggested
    setConnections([...connections, newConnection]);
    setSuggestedConnections(
      suggestedConnections.filter((conn) => conn.id !== suggestedConnection.id),
    );
    setShowSaveMessage(true);

    // Hide the save message after 3 seconds
    setTimeout(() => {
      setShowSaveMessage(false);
    }, 3000);
  };

  // Load connection requests
  const loadConnectionRequests = async () => {
    if (!user) return;

    setIsLoadingRequests(true);
    try {
      const { data, error } = await getPendingConnectionRequests(user.id);
      if (error) {
        console.error("Error loading connection requests:", error);
        toast({
          title: "Error",
          description: "Failed to load connection requests. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Transform the data to match our UI format
      const formattedRequests = data.map((request) => ({
        id: request.id,
        name: request.sender?.full_name || "Unknown User",
        avatar:
          request.sender?.avatar_url ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.sender_id}`,
      }));

      setConnectionRequests(formattedRequests);

      // Update the tab badge count
      if (formattedRequests.length > 0 && activeTab !== "requests") {
        // You could add a visual indicator or notification here
        console.log(
          `You have ${formattedRequests.length} pending connection requests`,
        );
      }
    } catch (err) {
      console.error("Unexpected error loading connection requests:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRequests(false);
    }
  };

  // Load user connections
  const loadUserConnections = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
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
        id: parseInt(conn.connection_id),
        name: conn.profile?.full_name || "Unknown User",
        mood: conn.profile?.mood ? parseInt(conn.profile.mood) : 2,
        avatar:
          conn.profile?.avatar_url ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${conn.connection_id}`,
        visibility: "all",
        canSeeAllMoods: true,
        sharedBoardId: conn.profile?.shared_board_id,
      }));

      // Sort connections to prioritize urgent moods
      const sortedConnections = [...formattedConnections].sort((a, b) => {
        // Prioritize urgent moods (5) at the top
        if (a.mood === 5 && b.mood !== 5) return -1;
        if (a.mood !== 5 && b.mood === 5) return 1;
        // Then high alert (4)
        if (a.mood === 4 && b.mood !== 4 && b.mood !== 5) return -1;
        if (a.mood !== 4 && a.mood !== 5 && b.mood === 4) return 1;
        // Otherwise sort alphabetically by name
        return a.name.localeCompare(b.name);
      });

      setConnections(sortedConnections);
    } catch (err) {
      console.error("Unexpected error loading user connections:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle accepting a connection request
  const handleAcceptRequest = async (request: ConnectionRequestUI) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to accept connection requests.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { success, error } = await acceptConnectionRequest(request.id);
      if (!success) {
        console.error("Error accepting connection request:", error);
        toast({
          title: "Error",
          description: "Failed to accept connection request. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Remove from requests
      setConnectionRequests(
        connectionRequests.filter((req) => req.id !== request.id),
      );

      // Reload connections
      await loadUserConnections();

      toast({
        title: "Success",
        description: "Connection request accepted successfully.",
      });

      setShowSaveMessage(true);
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 3000);
    } catch (err) {
      console.error("Unexpected error accepting connection request:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle declining a connection request
  const handleDeclineRequest = async (id: string) => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { success, error } = await declineConnectionRequest(id);
      if (!success) {
        console.error("Error declining connection request:", error);
        toast({
          title: "Error",
          description:
            "Failed to decline connection request. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Remove from requests
      setConnectionRequests(connectionRequests.filter((req) => req.id !== id));

      toast({
        title: "Success",
        description: "Connection request declined successfully.",
      });

      setShowSaveMessage(true);
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 3000);
    } catch (err) {
      console.error("Unexpected error declining connection request:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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
    connectionId: number,
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

  // Open privacy settings for a specific connection
  const openConnectionPrivacy = (connection: Connection) => {
    setSelectedConnection(connection);
    setShowPrivacyModal(true);
  };

  // Handle creating a shared board with a connection
  const handleCreateSharedBoard = (connection: Connection) => {
    setSelectedConnectionForBoard(connection);
    setSharedBoardTitle(`Shared Board with ${connection.name}`);
    setIsCreatingSharedBoard(true);
  };

  // Create the shared board in the database
  const createNewSharedBoard = async () => {
    if (!user || !selectedConnectionForBoard) return;

    setIsSaving(true);
    try {
      const { boardId, error } = await createSharedBoard(
        user.id,
        String(selectedConnectionForBoard.id),
        sharedBoardTitle,
      );

      if (error) {
        console.error("Error creating shared board:", error);
        toast({
          title: "Error",
          description: "Failed to create shared board. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Update the connection with the shared board ID
      const updatedConnections = connections.map((conn) =>
        conn.id === selectedConnectionForBoard.id
          ? { ...conn, sharedBoardId: boardId }
          : conn,
      );
      setConnections(updatedConnections);

      toast({
        title: "Success",
        description: `Shared board "${sharedBoardTitle}" created successfully.`,
      });

      setIsCreatingSharedBoard(false);
      setSelectedConnectionForBoard(null);
      setSharedBoardTitle("");
      setShowSaveMessage(true);

      // Hide the save message after 3 seconds
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 3000);
    } catch (err) {
      console.error("Unexpected error creating shared board:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Clear the save message when changing tabs
  useEffect(() => {
    setShowSaveMessage(false);
  }, [activeTab]);

  return (
    <SlideCard
      title="Manage Connections"
      currentMood={currentMood}
      setCurrentMood={setCurrentMood}
      moodOptions={moodOptions}
      onContextSubmit={onContextSubmit}
      cardStyle={cardStyle}
    >
      <div className="space-y-4 relative">
        {/* Save message */}
        {showSaveMessage && (
          <div className="absolute top-0 left-0 right-0 bg-green-500/80 text-white py-2 px-4 rounded-md text-center z-10 animate-fade-in-out">
            Changes saved successfully!
          </div>
        )}

        {/* Search bar - only show for connections tab */}
        {activeTab === "current" && (
          <div className="relative">
            <input
              type="text"
              placeholder="Search connections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-white/20">
          <button
            className={`px-4 py-2 font-medium ${activeTab === "current" ? "border-b-2 border-cyan-500 text-white" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("current")}
          >
            Current
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "add" ? "border-b-2 border-cyan-500 text-white" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("add")}
          >
            Add New
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "requests" ? "border-b-2 border-cyan-500 text-white" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("requests")}
          >
            Requests
            {connectionRequests.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-cyan-500 text-white rounded-full">
                {connectionRequests.length}
              </span>
            )}
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "privacy" ? "border-b-2 border-cyan-500 text-white" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("privacy")}
          >
            Privacy
          </button>
        </div>

        {/* Tab content */}
        <div className="max-h-[350px] overflow-y-auto pr-2">
          {activeTab === "current" && (
            <div className="space-y-3">
              {filteredConnections.length === 0 ? (
                <p className="text-center py-4 text-gray-400">
                  No connections found matching "{searchTerm}"
                </p>
              ) : (
                filteredConnections.map((connection) => (
                  <div
                    key={connection.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30">
                          <img
                            src={connection.avatar}
                            alt={connection.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div
                          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-black"
                          style={{
                            backgroundColor: moodOptions[connection.mood].color,
                          }}
                        ></div>
                      </div>
                      <div>
                        <h4 className="font-medium">{connection.name}</h4>
                        <span className="text-xs opacity-70">
                          {moodOptions[connection.mood].name}
                          {connection.visibility &&
                            connection.visibility !== "all" && (
                              <span className="ml-2 text-cyan-400">
                                •{" "}
                                {connection.visibility === "friends"
                                  ? "Friends only"
                                  : "Private"}
                              </span>
                            )}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-1.5 rounded-md bg-black/30 hover:bg-black/50"
                        title={
                          connection.canSeeAllMoods
                            ? "Can see all moods"
                            : "Limited mood visibility"
                        }
                        onClick={() => openConnectionPrivacy(connection)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke={
                            connection.canSeeAllMoods
                              ? "currentColor"
                              : "#f87171"
                          }
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        className="p-1.5 rounded-md bg-black/30 hover:bg-black/50"
                        title="Create shared board"
                        onClick={() => handleCreateSharedBoard(connection)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                          />
                        </svg>
                      </button>
                      <button
                        className="p-1.5 rounded-md bg-black/30 hover:bg-black/50 text-xs"
                        title="Edit visibility"
                        onClick={() => handleEditVisibility(connection)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        className="p-1.5 rounded-md bg-red-900/30 hover:bg-red-900/50 text-xs"
                        title="Remove connection"
                        onClick={() => handleRemoveConnection(connection.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "add" && (
            <div className="space-y-4">
              {showAddUsernameForm ? (
                <div className="p-3 rounded-lg bg-black/20 border border-white/10">
                  <h4 className="font-medium mb-2">Search for Users</h4>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Enter name or email..."
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-black/30 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                      className="px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-sm flex items-center gap-1"
                      onClick={handleUsernameSubmit}
                      disabled={isSearching || newUsername.trim().length < 3}
                    >
                      {isSearching ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Searching...
                        </>
                      ) : (
                        <>Search</>
                      )}
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-md bg-black/30 hover:bg-black/50 text-sm"
                      onClick={() => setShowAddUsernameForm(false)}
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <h5 className="text-sm font-medium">Search Results</h5>
                      {searchResults.map((result) => (
                        <div
                          key={result.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30">
                              <img
                                src={
                                  result.avatar_url ||
                                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.id}`
                                }
                                alt={result.full_name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {result.full_name}
                              </p>
                              {result.email && (
                                <p className="text-xs opacity-70">
                                  {result.email}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            className="px-2 py-1 rounded-md bg-cyan-600 hover:bg-cyan-500 text-xs"
                            onClick={() =>
                              handleSendConnectionRequest(result.id)
                            }
                            disabled={isSaving}
                          >
                            {isSaving ? "Sending..." : "Connect"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.length === 0 &&
                    newUsername.trim().length >= 3 &&
                    !isSearching && (
                      <p className="text-sm text-center opacity-70 mt-2">
                        No users found matching your search.
                      </p>
                    )}
                </div>
              ) : (
                <div className="flex gap-2 mb-4">
                  <button
                    className="flex-1 py-2 rounded-md bg-black/30 hover:bg-black/50 text-sm"
                    onClick={handleAddByUsername}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mx-auto mb-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Search for Users
                  </button>
                  <button
                    className="flex-1 py-2 rounded-md bg-black/30 hover:bg-black/50 text-sm"
                    onClick={handleImportContacts}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mx-auto mb-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Import Contacts
                  </button>
                </div>
              )}

              <h4 className="font-medium text-sm opacity-80 mt-4">
                Suggested Connections
              </h4>
              <div className="space-y-3">
                {suggestedConnections.length === 0 ? (
                  <p className="text-center py-4 text-gray-400">
                    No suggested connections available
                  </p>
                ) : (
                  suggestedConnections.map((connection) => (
                    <div
                      key={connection.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30">
                          <img
                            src={connection.avatar}
                            alt={connection.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{connection.name}</h4>
                          <span className="text-xs opacity-70">
                            {connection.mutualConnections} mutual connection
                            {connection.mutualConnections !== 1 && "s"}
                          </span>
                        </div>
                      </div>
                      <button
                        className="px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-sm"
                        onClick={() => handleConnect(connection)}
                      >
                        Connect
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "requests" && (
            <div className="space-y-3">
              {isLoadingRequests ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
              ) : connectionRequests.length === 0 ? (
                <p className="text-center py-4 text-gray-400">
                  No pending connection requests
                </p>
              ) : (
                connectionRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30">
                        <img
                          src={request.avatar}
                          alt={request.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{request.name}</h4>
                        <span className="text-xs opacity-70">
                          Wants to connect with you
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1.5 rounded-md bg-red-900/30 hover:bg-red-900/50 text-sm"
                        onClick={() => handleDeclineRequest(request.id)}
                        disabled={isSaving}
                      >
                        {isSaving ? "Processing..." : "Decline"}
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-sm"
                        onClick={() => handleAcceptRequest(request)}
                        disabled={isSaving}
                      >
                        {isSaving ? "Processing..." : "Accept"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "privacy" && (
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
                <h4 className="font-medium mb-3">Data Management</h4>
                <div className="space-y-3">
                  <button className="w-full py-2 rounded-md bg-black/30 hover:bg-black/50 text-sm text-left px-3">
                    Export My Data
                  </button>
                  <button className="w-full py-2 rounded-md bg-black/30 hover:bg-black/50 text-sm text-left px-3">
                    Delete Mood History
                  </button>
                  <button className="w-full py-2 rounded-md bg-red-900/30 hover:bg-red-900/50 text-sm text-left px-3">
                    Delete My Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit Visibility Modal */}
        {isEditing && selectedConnection && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20">
            <div className="bg-gray-900 p-4 rounded-lg w-80 border border-white/20">
              <h3 className="text-lg font-medium mb-3">
                Edit Visibility for {selectedConnection.name}
              </h3>

              <div className="space-y-2 mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="visibility"
                    value="all"
                    checked={visibilityOption === "all"}
                    onChange={() => setVisibilityOption("all")}
                    className="text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Visible to all connections</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="visibility"
                    value="friends"
                    checked={visibilityOption === "friends"}
                    onChange={() => setVisibilityOption("friends")}
                    className="text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Visible to friends only</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={visibilityOption === "private"}
                    onChange={() => setVisibilityOption("private")}
                    className="text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Private (only visible to you)</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  className="px-3 py-1.5 rounded-md bg-black/30 hover:bg-black/50 text-sm"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedConnection(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-sm"
                  onClick={saveVisibilityChanges}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Connection Privacy Modal */}
        {showPrivacyModal && selectedConnection && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20">
            <div className="bg-gray-900 p-4 rounded-lg w-80 border border-white/20">
              <h3 className="text-lg font-medium mb-3">
                Privacy Settings for {selectedConnection.name}
              </h3>

              <div className="space-y-4 mb-4">
                <div className="flex items-center justify-between">
                  <span>Can see my moods</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={selectedConnection.canSeeAllMoods}
                      onChange={() =>
                        handleConnectionVisibilityToggle(
                          selectedConnection.id,
                          !selectedConnection.canSeeAllMoods,
                        )
                      }
                      disabled={isSaving}
                    />
                    <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                  </label>
                </div>

                {selectedConnection.canSeeAllMoods && (
                  <div className="pt-2 border-t border-white/10">
                    <h4 className="font-medium mb-2">Hidden Moods</h4>
                    <p className="text-xs opacity-70 mb-2">
                      Select specific moods to hide from this connection
                    </p>

                    {moodOptions.map((mood, idx) => {
                      const isVisible = !hiddenMoods.includes(idx);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-1"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: mood.color }}
                            ></div>
                            <span className="text-sm">{mood.name}</span>
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
                            <div className="w-8 h-4 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-cyan-600"></div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-white/10">
                <button
                  className="px-3 py-1.5 rounded-md bg-black/30 hover:bg-black/50 text-sm"
                  onClick={() => {
                    setShowPrivacyModal(false);
                    setSelectedConnection(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Shared Board Modal */}
        {isCreatingSharedBoard && selectedConnectionForBoard && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20">
            <div className="bg-gray-900 p-4 rounded-lg w-96 border border-white/20">
              <h3 className="text-lg font-medium mb-3">
                Create Shared Board with {selectedConnectionForBoard.name}
              </h3>

              <div className="space-y-4 mb-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="board-title"
                  >
                    Board Title
                  </label>
                  <input
                    id="board-title"
                    type="text"
                    value={sharedBoardTitle}
                    onChange={(e) => setSharedBoardTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter a title for your shared board"
                  />
                </div>

                <div className="pt-2">
                  <p className="text-sm opacity-70 mb-2">
                    This will create a private board where you and{" "}
                    {selectedConnectionForBoard.name} can share notes,
                    resources, and collaborate together.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-white/10">
                <button
                  className="px-3 py-1.5 rounded-md bg-black/30 hover:bg-black/50 text-sm"
                  onClick={() => {
                    setIsCreatingSharedBoard(false);
                    setSelectedConnectionForBoard(null);
                    setSharedBoardTitle("");
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-sm flex items-center gap-1"
                  onClick={createNewSharedBoard}
                  disabled={isSaving || !sharedBoardTitle.trim()}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    <>Create Board</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add animation styles */}
      <style>{`
        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
        .animate-fade-in-out {
          animation: fadeInOut 3s ease-in-out;
        }
      `}</style>
    </SlideCard>
  );
};

export default ManageConnections;
