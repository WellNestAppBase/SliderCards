import React, { useState, useEffect } from "react";
import SlideCard from "../SlideCard";
import { MoodOption } from "../MoodSelector";

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
}

interface ConnectionRequest {
  id: number;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("current"); // current, add, requests
  const [showAddUsernameForm, setShowAddUsernameForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [selectedConnection, setSelectedConnection] =
    useState<Connection | null>(null);
  const [visibilityOption, setVisibilityOption] = useState("all");
  const [isEditing, setIsEditing] = useState(false);

  // Mock data for connections
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: 1,
      name: "Emma Rodriguez",
      mood: 5, // Urgent
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      visibility: "all",
    },
    {
      id: 2,
      name: "Michael Chen",
      mood: 2, // Mild/Neutral
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      visibility: "all",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      mood: 1, // Calm and Peaceful
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      visibility: "all",
    },
    {
      id: 4,
      name: "David Kim",
      mood: 4, // High Alert
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      visibility: "all",
    },
    {
      id: 5,
      name: "Alex Morgan",
      mood: 0, // Deeply Serene
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      visibility: "all",
    },
  ]);

  // Mock data for connection requests
  const [connectionRequests, setConnectionRequests] = useState<
    ConnectionRequest[]
  >([
    {
      id: 101,
      name: "Jordan Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jordan",
    },
    {
      id: 102,
      name: "Riley Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=riley",
    },
  ]);

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

  // Filter connections based on search term
  const filteredConnections = connections.filter((connection) =>
    connection.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle adding a new connection by username
  const handleAddByUsername = () => {
    setShowAddUsernameForm(true);
  };

  // Handle submitting the new username form
  const handleUsernameSubmit = () => {
    if (newUsername.trim()) {
      // Create a new connection with the entered username
      const newConnection: Connection = {
        id: Date.now(), // Use timestamp as a unique ID
        name: newUsername,
        mood: 2, // Default to Mild/Neutral
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUsername.toLowerCase().replace(/\s+/g, "")}_${Date.now()}`,
        visibility: "all",
      };

      setConnections([...connections, newConnection]);
      setNewUsername("");
      setShowAddUsernameForm(false);
      setShowSaveMessage(true);

      // Hide the save message after 3 seconds
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 3000);
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
  const handleRemoveConnection = (id: number) => {
    const updatedConnections = connections.filter((conn) => conn.id !== id);
    setConnections(updatedConnections);
    setShowSaveMessage(true);

    // Hide the save message after 3 seconds
    setTimeout(() => {
      setShowSaveMessage(false);
    }, 3000);
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

  // Handle accepting a connection request
  const handleAcceptRequest = (request: ConnectionRequest) => {
    // Create a new connection from the request
    const newConnection: Connection = {
      id: request.id,
      name: request.name,
      mood: 2, // Default to Mild/Neutral
      avatar: request.avatar,
      visibility: "all",
    };

    // Add to connections and remove from requests
    setConnections([...connections, newConnection]);
    setConnectionRequests(
      connectionRequests.filter((req) => req.id !== request.id),
    );
    setShowSaveMessage(true);

    // Hide the save message after 3 seconds
    setTimeout(() => {
      setShowSaveMessage(false);
    }, 3000);
  };

  // Handle declining a connection request
  const handleDeclineRequest = (id: number) => {
    setConnectionRequests(connectionRequests.filter((req) => req.id !== id));
    setShowSaveMessage(true);

    // Hide the save message after 3 seconds
    setTimeout(() => {
      setShowSaveMessage(false);
    }, 3000);
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

        {/* Search bar */}
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
                  <h4 className="font-medium mb-2">Add by Username</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter username..."
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-black/30 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                      className="px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-sm"
                      onClick={handleUsernameSubmit}
                    >
                      Add
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-md bg-black/30 hover:bg-black/50 text-sm"
                      onClick={() => setShowAddUsernameForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
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
                    Add by Username
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
              {connectionRequests.length === 0 ? (
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
                      >
                        Decline
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-sm"
                        onClick={() => handleAcceptRequest(request)}
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))
              )}
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
      </div>

      {/* Add animation styles */}
      <style jsx>{`
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
