import React from "react";
import SlideCard from "../SlideCard";
import { MoodOption } from "../MoodSelector";

interface HelpProps {
  currentMood: number;
  setCurrentMood: (index: number) => void;
  moodOptions: MoodOption[];
  onContextSubmit?: (context: string) => void;
  cardStyle?: React.CSSProperties;
}

const Help: React.FC<HelpProps> = ({
  currentMood,
  setCurrentMood,
  moodOptions,
  onContextSubmit = () => {},
  cardStyle = {},
}) => {
  return (
    <SlideCard
      title="Help"
      currentMood={currentMood}
      setCurrentMood={setCurrentMood}
      moodOptions={moodOptions}
      onContextSubmit={onContextSubmit}
      cardStyle={cardStyle}
    >
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-3">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-black/30 backdrop-blur-sm rounded-lg">
              <h4 className="font-medium mb-1">
                What does an Urgent mood mean?
              </h4>
              <p className="text-sm opacity-80">
                An Urgent mood (red) indicates a critical state that needs
                immediate attention. When you or a connection selects this mood,
                it signals that support is needed right away.
              </p>
            </div>
            <div className="p-3 bg-black/30 backdrop-blur-sm rounded-lg">
              <h4 className="font-medium mb-1">How do I update my mood?</h4>
              <p className="text-sm opacity-80">
                You can update your mood by selecting one of the six color
                options at the bottom of any screen. You'll have the option to
                add context about how you're feeling.
              </p>
            </div>
            <div className="p-3 bg-black/30 backdrop-blur-sm rounded-lg">
              <h4 className="font-medium mb-1">Who can see my mood?</h4>
              <p className="text-sm opacity-80">
                By default, all your connections can see your mood. You can
                adjust your privacy settings in the Privacy card to control who
                sees your mood updates.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">Support Resources</h3>
          <div className="space-y-3">
            <div className="p-3 bg-black/30 backdrop-blur-sm rounded-lg border-l-4 border-red-500">
              <h4 className="font-medium mb-1">Crisis Support</h4>
              <p className="text-sm opacity-80 mb-2">
                If you or someone you know is in crisis, please reach out for
                help immediately:
              </p>
              <ul className="text-sm space-y-1">
                <li>
                  • National Suicide Prevention Lifeline: 988 or 1-800-273-8255
                </li>
                <li>• Crisis Text Line: Text HOME to 741741</li>
              </ul>
            </div>
            <div className="p-3 bg-black/30 backdrop-blur-sm rounded-lg">
              <h4 className="font-medium mb-1">Mental Health Resources</h4>
              <p className="text-sm opacity-80 mb-2">
                Explore these resources for mental health support:
              </p>
              <ul className="text-sm space-y-1">
                <li>• NAMI HelpLine: 1-800-950-NAMI (6264)</li>
                <li>• Mental Health America: mentalhealthamerica.net</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">Contact Support</h3>
          <div className="p-3 bg-black/30 backdrop-blur-sm rounded-lg">
            <p className="text-sm opacity-80 mb-3">
              Need help with the app? Our support team is here for you.
            </p>
            <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md text-sm font-medium">
              Chat with Support
            </button>
          </div>
        </section>
      </div>
    </SlideCard>
  );
};

export default Help;
