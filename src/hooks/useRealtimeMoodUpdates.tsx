import { useEffect, useState, useCallback } from "react";
import { supabase } from "../services/auth";
import { toast } from "../components/ui/use-toast";

export interface Connection {
  id: number;
  name: string;
  mood: number;
  lastUpdated: string;
  avatar: string;
  context: string;
  sharedBoardId?: string; // ID of the shared board between users
  hasUrgentUpdate?: boolean; // Flag for urgent mood updates
}

/**
 * Custom hook for subscribing to real-time mood updates
 * @param initialConnections - Initial array of connections
 * @returns Object containing connections, loading state, and urgent connections
 */
export function useRealtimeMoodUpdates(initialConnections: Connection[]) {
  const [connections, setConnections] =
    useState<Connection[]>(initialConnections);
  const [loading, setLoading] = useState(false);
  const [urgentConnections, setUrgentConnections] = useState<Connection[]>([]);

  // Function to show notification for urgent mood updates
  const showUrgentNotification = useCallback((connection: Connection) => {
    toast({
      title: "Urgent Mood Update",
      description: `${connection.name} is in an urgent state${connection.context ? `: ${connection.context}` : ""}`,
      variant: "destructive",
      duration: 10000, // Show for 10 seconds
    });
  }, []);

  useEffect(() => {
    // Update connections when initialConnections change (for initial load)
    setConnections(initialConnections);

    // Check for any initial urgent connections
    const initialUrgent = initialConnections.filter((conn) => conn.mood === 5);
    setUrgentConnections(initialUrgent);
  }, [initialConnections]);

  useEffect(() => {
    // Set up real-time subscription to the profiles table
    setLoading(true);

    // Subscribe to changes in the profiles table
    const subscription = supabase
      .channel("profiles-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "profiles", // Mood data is stored in the profiles table
        },
        (payload) => {
          console.log("Real-time update received:", payload);

          // Handle different event types
          if (payload.eventType === "UPDATE") {
            const updatedProfile = payload.new;
            const previousProfile = payload.old;
            const newMood =
              updatedProfile.mood !== undefined
                ? parseInt(updatedProfile.mood)
                : undefined;

            // Check if this is a new urgent mood (changed from non-urgent to urgent)
            const isNewUrgentMood =
              newMood === 5 &&
              previousProfile.mood !== undefined &&
              parseInt(previousProfile.mood) !== 5;

            // Update the connection in the state if it exists
            setConnections((prevConnections) => {
              const updatedConnections = prevConnections.map((connection) => {
                // Check if this is the updated profile
                if (connection.id.toString() === updatedProfile.id) {
                  const updatedConnection = {
                    ...connection,
                    mood: newMood !== undefined ? newMood : connection.mood,
                    context: updatedProfile.context || connection.context,
                    lastUpdated: "just now", // Update the timestamp
                    sharedBoardId:
                      updatedProfile.shared_board_id ||
                      connection.sharedBoardId,
                    hasUrgentUpdate: isNewUrgentMood, // Flag if this is a new urgent update
                  };

                  // If this is a new urgent mood, show notification
                  if (isNewUrgentMood) {
                    // We'll handle this outside the state update to avoid issues
                    setTimeout(
                      () => showUrgentNotification(updatedConnection),
                      0,
                    );
                  }

                  return updatedConnection;
                }
                return connection;
              });

              return updatedConnections;
            });

            // Update urgent connections list
            if (newMood !== undefined) {
              setUrgentConnections((prev) => {
                // If mood is urgent (5), add to urgent list if not already there
                if (newMood === 5) {
                  const existingUrgent = prev.some(
                    (conn) => conn.id.toString() === updatedProfile.id,
                  );
                  if (!existingUrgent) {
                    const urgentConnection = connections.find(
                      (conn) => conn.id.toString() === updatedProfile.id,
                    );
                    if (urgentConnection) {
                      return [
                        ...prev,
                        {
                          ...urgentConnection,
                          mood: newMood,
                          context:
                            updatedProfile.context || urgentConnection.context,
                          lastUpdated: "just now",
                        },
                      ];
                    }
                  }
                } else {
                  // If mood is no longer urgent, remove from urgent list
                  return prev.filter(
                    (conn) => conn.id.toString() !== updatedProfile.id,
                  );
                }
                return prev;
              });
            }
          } else if (payload.eventType === "INSERT") {
            // Handle new profile/connection if needed
            const newProfile = payload.new;
            const newMood =
              newProfile.mood !== undefined ? parseInt(newProfile.mood) : 2;
            const isUrgent = newMood === 5;

            // Check if this profile is not already in our connections
            setConnections((prevConnections) => {
              const exists = prevConnections.some(
                (conn) => conn.id.toString() === newProfile.id,
              );

              if (!exists && newProfile.full_name) {
                // Create a new connection object from the profile data
                const newConnection: Connection = {
                  id: parseInt(newProfile.id),
                  name: newProfile.full_name || "Unknown User",
                  mood: newMood,
                  lastUpdated: "just now",
                  avatar:
                    newProfile.avatar_url ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${newProfile.id}`,
                  context: newProfile.context || "",
                  sharedBoardId: newProfile.shared_board_id || undefined,
                  hasUrgentUpdate: isUrgent, // Flag if this is an urgent mood
                };

                // If urgent, show notification and add to urgent list
                if (isUrgent) {
                  setTimeout(() => showUrgentNotification(newConnection), 0);
                  setUrgentConnections((prev) => [...prev, newConnection]);
                }

                return [...prevConnections, newConnection];
              }

              return prevConnections;
            });
          } else if (payload.eventType === "DELETE") {
            // Remove the deleted profile from connections
            const deletedProfileId = payload.old.id;
            setConnections((prevConnections) => {
              return prevConnections.filter(
                (conn) => conn.id.toString() !== deletedProfileId,
              );
            });

            // Also remove from urgent connections if present
            setUrgentConnections((prev) =>
              prev.filter((conn) => conn.id.toString() !== deletedProfileId),
            );
          }
        },
      )
      .subscribe();

    setLoading(false);

    // Clean up subscription when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Sort connections to prioritize urgent moods
  const sortedConnections = [...connections].sort((a, b) => {
    // Prioritize urgent moods (5) at the top
    if (a.mood === 5 && b.mood !== 5) return -1;
    if (a.mood !== 5 && b.mood === 5) return 1;
    // Then high alert (4)
    if (a.mood === 4 && b.mood !== 4 && b.mood !== 5) return -1;
    if (a.mood !== 4 && a.mood !== 5 && b.mood === 4) return 1;
    // Otherwise sort alphabetically by name
    return a.name.localeCompare(b.name);
  });

  return {
    connections: sortedConnections,
    loading,
    urgentConnections,
  };
}
