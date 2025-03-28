import React, { useState, useRef, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import SlideCard from "../SlideCard";
import { useAuth } from "../../../contexts/AuthContext";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../../../services/profileService";
import { useToast } from "../../../components/ui/use-toast";

interface UserData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar_url?: string;
}

interface MoodOption {
  name: string;
  color: string;
  textClass?: string;
  description?: string;
}

interface ManageProfileProps {
  currentMood?: number;
  setCurrentMood?: (index: number) => void;
  moodOptions?: MoodOption[];
  onContextSubmit?: (context: string) => void;
}

const ManageProfile: React.FC<ManageProfileProps> = ({
  currentMood: externalCurrentMood,
  setCurrentMood: externalSetCurrentMood,
  moodOptions: externalMoodOptions,
  onContextSubmit,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();