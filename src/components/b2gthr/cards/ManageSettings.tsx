import React, { useState } from "react";
import SlideCard from "../SlideCard";
import { MoodOption } from "../MoodSelector";

interface ManageSettingsProps {
  currentMood: number;
  setCurrentMood: (index: number) => void;
  moodOptions: MoodOption[];
  onContextSubmit?: (context: string) => void;
  cardStyle?: React.CSSProperties;
}

const ManageSettings: React.FC<ManageSettingsProps> = ({
  currentMood,
  setCurrentMood,
  moodOptions,
  onContextSubmit = () => {},
  cardStyle = {},
}) => {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    moodUpdates: false,
    urgentAlerts: true,
    connectionRequests: true,
    enableWidget: true,
    prioritizeUrgent: true,
  });

  const handleToggleChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  return (
    <SlideCard
      title="Manage Settings"
      currentMood={currentMood}
      setCurrentMood={setCurrentMood}
      moodOptions={moodOptions}
      onContextSubmit={onContextSubmit}
      cardStyle={cardStyle}
    >
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-3 text-white">
            Notification Preferences
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-black/40 backdrop-blur-sm rounded-lg">
              <div>
                <h4 className="font-medium text-white">Mood Updates</h4>
                <p className="text-sm text-white/90">
                  Get notified when connections update their mood
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.moodUpdates}
                  onChange={() => handleToggleChange("moodUpdates")}
                />
                <div
                  className={`w-11 h-6 rounded-full peer ${notificationSettings.moodUpdates ? "bg-cyan-600" : "bg-gray-700"} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                ></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 bg-black/40 backdrop-blur-sm rounded-lg">
              <div>
                <h4 className="font-medium text-white">Urgent Alerts</h4>
                <p className="text-sm text-white/90">
                  Immediate notification when a connection is in an Urgent state
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.urgentAlerts}
                  onChange={() => handleToggleChange("urgentAlerts")}
                />
                <div
                  className={`w-11 h-6 rounded-full peer ${notificationSettings.urgentAlerts ? "bg-cyan-600" : "bg-gray-700"} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                ></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 bg-black/40 backdrop-blur-sm rounded-lg">
              <div>
                <h4 className="font-medium text-white">Connection Requests</h4>
                <p className="text-sm text-white/90">
                  Get notified about new connection requests
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.connectionRequests}
                  onChange={() => handleToggleChange("connectionRequests")}
                />
                <div
                  className={`w-11 h-6 rounded-full peer ${notificationSettings.connectionRequests ? "bg-cyan-600" : "bg-gray-700"} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                ></div>
              </label>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3 text-white">
            Widget Settings
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-black/40 backdrop-blur-sm rounded-lg">
              <div>
                <h4 className="font-medium text-white">Enable Widget</h4>
                <p className="text-sm text-white/90">
                  Show B2GTHR widget on your home screen
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.enableWidget}
                  onChange={() => handleToggleChange("enableWidget")}
                />
                <div
                  className={`w-11 h-6 rounded-full peer ${notificationSettings.enableWidget ? "bg-cyan-600" : "bg-gray-700"} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                ></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 bg-black/40 backdrop-blur-sm rounded-lg">
              <div>
                <h4 className="font-medium text-white">
                  Prioritize Urgent Moods
                </h4>
                <p className="text-sm text-white/90">
                  Show connections with Urgent mood at the top of the widget
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.prioritizeUrgent}
                  onChange={() => handleToggleChange("prioritizeUrgent")}
                />
                <div
                  className={`w-11 h-6 rounded-full peer ${notificationSettings.prioritizeUrgent ? "bg-cyan-600" : "bg-gray-700"} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                ></div>
              </label>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3 text-white">App Theme</h3>
          <div className="p-3 bg-black/40 backdrop-blur-sm rounded-lg">
            <div className="mb-3">
              <h4 className="font-medium mb-2 text-white">Theme Mode</h4>
              <div className="flex gap-3">
                <button className="px-3 py-1 bg-gray-800 rounded-md text-sm font-medium border border-white/20 text-white">
                  System
                </button>
                <button className="px-3 py-1 bg-transparent rounded-md text-sm font-medium text-white">
                  Light
                </button>
                <button className="px-3 py-1 bg-transparent rounded-md text-sm font-medium text-white">
                  Dark
                </button>
              </div>
            </div>
            <p className="text-xs text-white/80">
              Note: Background color will still change based on your selected
              mood.
            </p>
          </div>
        </section>

        {/* Account settings section with notification preferences moved from profile */}
        <section>
          <h3 className="text-lg font-semibold mb-3 text-white">
            Account Settings
          </h3>
          <div className="space-y-3">
            {/* Email Notifications Toggle */}
            <div className="flex items-center justify-between p-3 bg-black/40 backdrop-blur-sm rounded-lg">
              <div>
                <h4 className="font-medium text-white">Email Notifications</h4>
                <p className="text-sm text-white/90">
                  Receive email updates about your connections
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.emailNotifications}
                  onChange={() => handleToggleChange("emailNotifications")}
                />
                <div
                  className={`w-11 h-6 rounded-full peer ${notificationSettings.emailNotifications ? "bg-cyan-600" : "bg-gray-700"} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                ></div>
              </label>
            </div>

            {/* Push Notifications Toggle */}
            <div className="flex items-center justify-between p-3 bg-black/40 backdrop-blur-sm rounded-lg">
              <div>
                <h4 className="font-medium text-white">Push Notifications</h4>
                <p className="text-sm text-white/90">
                  Get alerts when someone reaches out
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.pushNotifications}
                  onChange={() => handleToggleChange("pushNotifications")}
                />
                <div
                  className={`w-11 h-6 rounded-full peer ${notificationSettings.pushNotifications ? "bg-cyan-600" : "bg-gray-700"} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                ></div>
              </label>
            </div>

            {/* Other account settings */}
            <button className="w-full p-3 bg-black/40 backdrop-blur-sm rounded-lg text-left">
              <h4 className="font-medium text-white">Change Password</h4>
              <p className="text-sm text-white/90">
                Update your account password
              </p>
            </button>
            <button className="w-full p-3 bg-black/40 backdrop-blur-sm rounded-lg text-left">
              <h4 className="font-medium text-white">Linked Accounts</h4>
              <p className="text-sm text-white/90">
                Manage connected social accounts
              </p>
            </button>
            <button className="w-full p-3 bg-red-900/40 backdrop-blur-sm rounded-lg text-left">
              <h4 className="font-medium text-red-300">Delete Account</h4>
              <p className="text-sm text-white/90">
                Permanently delete your account and data
              </p>
            </button>
          </div>
        </section>
      </div>
    </SlideCard>
  );
};

export default ManageSettings;
