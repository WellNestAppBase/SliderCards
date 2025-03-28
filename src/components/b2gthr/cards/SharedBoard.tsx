import React, { useState, useEffect } from "react";
import SlideCard from "../SlideCard";
import { MoodOption } from "../MoodSelector";
import { useAuth } from "../../../contexts/AuthContext";
import { Connection } from "../../../hooks/useRealtimeMoodUpdates";
import {
  fetchSharedBoard,
  getUserSharedBoards,
  SharedBoard as SharedBoardType,
} from "../../../services/sharedBoardService";
import { toast } from "../../../components/ui/use-toast";

interface SharedBoardProps {
  currentMood: number;
  setCurrentMood: (index: number) => void;
  moodOptions: MoodOption[];
  onContextSubmit: (context: string) => void;
  cardStyle: React.CSSProperties;
  selectedConnectionId?: number; // Optional ID of the connection to focus on
}

interface BoardMember {
  id: number;
  name: string;
  mood: number;
  avatar: string;
}

interface BoardData {
  id: string;
  name: string;
  members: BoardMember[];
  lastUpdated: string;
  content?: any; // This will store the whiteboard content (notes, drawings, etc.)
}

const SharedBoard: React.FC<SharedBoardProps> = ({
  currentMood,
  setCurrentMood,
  moodOptions,
  onContextSubmit,
  cardStyle,
  selectedConnectionId,
}) => {
  const { user } = useAuth();
  const [sharedBoards, setSharedBoards] = useState<BoardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<BoardData | null>(null);
  const [showBoardContent, setShowBoardContent] = useState(false);

  // Load user's shared boards
  useEffect(() => {
    if (user) {
      loadUserSharedBoards();
    }
  }, [user]);

  // Load shared boards for the user
  const loadUserSharedBoards = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // In a real implementation, this would fetch from the database
      // For now, we'll use mock data

      // This would be the actual implementation:
      // const { boards, error } = await getUserSharedBoards(user.id);
      // if (error) throw error;
      // const formattedBoards = boards.map(formatBoardData);
      // setSharedBoards(formattedBoards);

      // Mock data for shared boards
      const mockBoards = [
        {
          id: "board-1",
          name: "Family",
          lastUpdated: "2 hours ago",
          members: [
            {
              id: 101,
              name: "Mom",
              mood: 1, // Calm and Peaceful
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mom",
            },
            {
              id: 102,
              name: "Dad",
              mood: 2, // Mild/Neutral
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dad",
            },
            {
              id: 103,
              name: "Sister",
              mood: 0, // Deeply Serene
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sister",
            },
          ],
          content: {
            notes: ["Family dinner on Sunday", "Mom's birthday next week"],
            resources: ["Family budget spreadsheet"],
          },
        },
        {
          id: "board-2",
          name: "Emma's Board",
          lastUpdated: "30 min ago",
          members: [
            {
              id: 201,
              name: "Emma",
              mood: 5, // Urgent
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
            },
            {
              id: 999, // This would be the current user
              name: "You",
              mood: currentMood,
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
            },
          ],
          content: {
            notes: [
              "Meeting tomorrow at 3pm",
              "Don't forget to bring the report",
            ],
            resources: ["Project timeline", "Budget proposal"],
          },
        },
        {
          id: "board-3",
          name: "Work Team",
          lastUpdated: "1 day ago",
          members: [
            {
              id: 301,
              name: "Boss",
              mood: 3, // Something Feels Off
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=boss",
            },
            {
              id: 302,
              name: "Coworker 1",
              mood: 2, // Mild/Neutral
              avatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=coworker1",
            },
            {
              id: 303,
              name: "Coworker 2",
              mood: 1, // Calm and Peaceful
              avatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=coworker2",
            },
            {
              id: 999, // This would be the current user
              name: "You",
              mood: currentMood,
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
            },
          ],
          content: {
            notes: ["Team meeting on Friday", "Project deadline extended"],
            resources: ["Team handbook", "Vacation schedule"],
          },
        },
      ];

      setSharedBoards(mockBoards);

      // If a specific connection is selected, find their board
      if (selectedConnectionId) {
        const connectionBoard = mockBoards.find((board) =>
          board.members.some((member) => member.id === selectedConnectionId),
        );
        if (connectionBoard) {
          setSelectedBoard(connectionBoard);
          setShowBoardContent(true);
        }
      }
    } catch (err) {
      console.error("Error loading shared boards:", err);
      toast({
        title: "Error",
        description: "Failed to load shared boards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to check if any board member has an urgent mood
  const hasUrgentMember = (members: BoardMember[]) => {
    return members.some((member) => member.mood === 5);
  };

  // Sort boards to prioritize those with urgent members
  const sortedBoards = [...sharedBoards].sort((a, b) => {
    const aHasUrgent = hasUrgentMember(a.members);
    const bHasUrgent = hasUrgentMember(b.members);
    if (aHasUrgent && !bHasUrgent) return -1;
    if (!aHasUrgent && bHasUrgent) return 1;
    return 0;
  });

  // Handle viewing a board's content
  const handleViewBoard = (board: BoardData) => {
    setSelectedBoard(board);
    setShowBoardContent(true);
  };

  // Handle going back to the board list
  const handleBackToList = () => {
    setSelectedBoard(null);
    setShowBoardContent(false);
  };

  // Render the board content view
  const renderBoardContent = () => {
    if (!selectedBoard) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={handleBackToList}
            className="p-1.5 rounded-md bg-black/30 hover:bg-black/50"
            title="Back to boards"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h3 className="text-lg font-semibold flex-grow">
            {selectedBoard.name}
          </h3>
          <span className="text-sm opacity-70">
            Last updated: {selectedBoard.lastUpdated}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {selectedBoard.members.map((member) => (
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
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium bg-black/70 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                {member.name}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-lg bg-black/20 border border-white/10">
          <h4 className="font-medium mb-2">Shared Notes & Resources</h4>
          <p className="text-sm opacity-80 mb-4">
            This is where you'll be able to share notes, drawings, and resources
            with your connections.
          </p>

          <div className="bg-black/30 p-3 rounded-md mb-3">
            <h5 className="text-sm font-medium mb-2">Notes</h5>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {selectedBoard.content?.notes?.map(
                (note: string, index: number) => <li key={index}>{note}</li>,
              ) || <li className="opacity-70">No notes yet</li>}
            </ul>
          </div>

          <div className="bg-black/30 p-3 rounded-md">
            <h5 className="text-sm font-medium mb-2">Resources</h5>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {selectedBoard.content?.resources?.map(
                (resource: string, index: number) => (
                  <li key={index}>{resource}</li>
                ),
              ) || <li className="opacity-70">No resources yet</li>}
            </ul>
          </div>

          <div className="mt-4 flex justify-center">
            <p className="text-sm opacity-70 text-center max-w-md">
              Whiteboard functionality coming soon! You'll be able to draw, add
              images, and collaborate in real-time.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Render the board list view
  const renderBoardList = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <p className="opacity-80">
            Private boards for sharing notes and resources with your
            connections.
          </p>
          <button className="px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-sm flex items-center gap-1">
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            New Board
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : sortedBoards.length === 0 ? (
          <div className="text-center py-8 opacity-70">
            <p>You don't have any shared boards yet.</p>
            <p className="text-sm mt-2">
              Create a new board or connect with someone to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2">
            {sortedBoards.map((board) => {
              const hasUrgent = hasUrgentMember(board.members);
              return (
                <div
                  key={board.id}
                  className={`p-4 rounded-lg ${hasUrgent ? "bg-red-900/30 border border-red-500/50" : "bg-black/20 border border-white/10"}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold flex items-center">
                      {board.name}
                      {hasUrgent && (
                        <span className="ml-2 text-red-400 animate-pulse">
                          ⚠️
                        </span>
                      )}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        className="p-1.5 rounded-md bg-black/30 hover:bg-black/50"
                        title="Edit board"
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
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        className="p-1.5 rounded-md bg-black/30 hover:bg-black/50"
                        title="View board"
                        onClick={() => handleViewBoard(board)}
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
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {board.members.map((member) => (
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
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium bg-black/70 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                          {member.name}
                        </div>
                      </div>
                    ))}
                    <button
                      className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center"
                      title="Add member"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
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
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-sm opacity-80">
                    <span>{board.members.length} members</span>
                    <span>Updated {board.lastUpdated}</span>
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
    );
  };

  return (
    <SlideCard
      title="Shared Boards"
      currentMood={currentMood}
      setCurrentMood={setCurrentMood}
      moodOptions={moodOptions}
      onContextSubmit={onContextSubmit}
      cardStyle={cardStyle}
    >
      {showBoardContent && selectedBoard
        ? renderBoardContent()
        : renderBoardList()}
    </SlideCard>
  );
};

export default SharedBoard;
