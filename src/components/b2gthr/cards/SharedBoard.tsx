import React from "react";
import SlideCard from "../SlideCard";
import { MoodOption } from "../MoodSelector";

interface SharedBoardProps {
  currentMood: number;
  setCurrentMood: (index: number) => void;
  moodOptions: MoodOption[];
  onContextSubmit: (context: string) => void;
  cardStyle: React.CSSProperties;
}

const SharedBoard: React.FC<SharedBoardProps> = ({
  currentMood,
  setCurrentMood,
  moodOptions,
  onContextSubmit,
  cardStyle,
}) => {
  // Mock data for shared boards
  const sharedBoards = [
    {
      id: 1,
      name: "Family",
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
    },
    {
      id: 2,
      name: "Close Friends",
      members: [
        {
          id: 201,
          name: "Emma",
          mood: 5, // Urgent
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
        },
        {
          id: 202,
          name: "Michael",
          mood: 2, // Mild/Neutral
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
        },
        {
          id: 203,
          name: "Sarah",
          mood: 1, // Calm and Peaceful
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        },
        {
          id: 204,
          name: "David",
          mood: 4, // High Alert
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
        },
      ],
    },
    {
      id: 3,
      name: "Work Team",
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
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=coworker1",
        },
        {
          id: 303,
          name: "Coworker 2",
          mood: 1, // Calm and Peaceful
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=coworker2",
        },
      ],
    },
  ];

  // Function to check if any board member has an urgent mood
  const hasUrgentMember = (members) => {
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

  return (
    <SlideCard
      title="SharedBoard Manager"
      currentMood={currentMood}
      setCurrentMood={setCurrentMood}
      moodOptions={moodOptions}
      onContextSubmit={onContextSubmit}
      cardStyle={cardStyle}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <p className="opacity-80">
            Manage your shared boards and group connections.
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
                      title="View details"
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
      </div>
    </SlideCard>
  );
};

export default SharedBoard;
