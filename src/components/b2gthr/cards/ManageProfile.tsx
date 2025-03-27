import React, { useState, useRef, ChangeEvent } from "react";
import SlideCard from "../SlideCard";
import { MoodOption } from "../MoodSelector";
import { Camera } from "lucide-react";

interface ManageProfileProps {
  currentMood: number;
  setCurrentMood: (index: number) => void;
  moodOptions: MoodOption[];
  onContextSubmit: (context: string) => void;
  cardStyle: React.CSSProperties;
}

const ManageProfile: React.FC<ManageProfileProps> = ({
  currentMood,
  setCurrentMood,
  moodOptions,
  onContextSubmit,
  cardStyle,
}) => {
  // Mock user data
  const [userData, setUserData] = useState({
    name: "Samuel",
    email: "samuel@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Just a regular person trying to stay connected with loved ones.",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=samuel",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, "");

    // Format based on length (assuming US format as default)
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setUserData((prev) => ({
      ...prev,
      phone: formattedPhone,
    }));
  };

  const handleProfilePictureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file);
      setUserData((prev) => ({
        ...prev,
        profilePicture: imageUrl,
      }));
    }
  };

  return (
    <SlideCard
      title="Manage Profile"
      currentMood={currentMood}
      setCurrentMood={setCurrentMood}
      moodOptions={moodOptions}
      onContextSubmit={onContextSubmit}
      cardStyle={cardStyle}
    >
      <div className="space-y-6">
        {/* Profile picture with enhanced functionality */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/30 bg-gray-800">
              <img
                src={userData.profilePicture}
                alt="Your profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={handleProfilePictureClick}
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-cyan-600 hover:bg-cyan-500 border-2 border-black transition-colors"
              title="Change profile picture"
              type="button"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: moodOptions[currentMood].color }}
            ></div>
            <span className="text-sm">{moodOptions[currentMood].name}</span>
          </div>
        </div>

        {/* Profile form with enhanced fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={userData.phone}
              onChange={handlePhoneChange}
              className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={userData.bio}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Tell others a bit about yourself..."
            />
          </div>

          <div className="pt-2">
            <button
              className="w-full px-4 py-2 rounded-lg font-medium bg-cyan-600 hover:bg-cyan-500 transition-colors"
              type="button"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </SlideCard>
  );
};

export default ManageProfile;
