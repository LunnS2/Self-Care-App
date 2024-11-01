//self-care-app\src\components\side-bar.tsx

"use client"

import React from "react";
import Link from "next/link";
import NavLink from "./nav-link";
import HouseboatIcon from "@mui/icons-material/Houseboat";
import TaskIcon from "@mui/icons-material/Task";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChallengeIcon from "@mui/icons-material/EmojiEvents";
import GratitudeIcon from "@mui/icons-material/Favorite";
import MeditationIcon from "@mui/icons-material/SelfImprovement";
import JournalIcon from "@mui/icons-material/Book";
import { useEffect, useState } from "react";

function SideBar() {
  //Practice to prevent hydratation issues
  const [isMounted, setIsMounted] = useState(false);

  // This effect will run only on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Avoid rendering during SSR
  if (!isMounted) {
    return null; // null, or a loading indicator
  }

  return (
    <aside className="fixed left-0 top-0 w-16 h-screen bg-gray-900 flex flex-col items-center py-6 transition-all duration-300 hover:w-24 md:w-20 md:hover:w-24 shadow-lg">
      {/* Logo or Home Link */}
      <Link href="/" className="mb-8 flex flex-col items-center text-white">
        <HouseboatIcon className="text-4xl mb-1" />
        <span className="text-xs hidden md:block">Home</span>
      </Link>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-6 text-white">
        <NavLink href="/create-task" icon={<TaskIcon />} label="Add Tasks" />
        <NavLink
          href="/user-tasks"
          icon={<AssignmentIcon />}
          label="Your Tasks"
        />
        <NavLink
          href="/daily-challenge"
          icon={<ChallengeIcon />}
          label="Daily Challenge"
        />
        <NavLink
          href="/gratitude-log"
          icon={<GratitudeIcon />}
          label="Gratitude"
        />
        <NavLink
          href="/meditation"
          icon={<MeditationIcon />}
          label="Meditation"
        />
        <NavLink href="/journal" icon={<JournalIcon />} label="Journal" />
      </nav>
    </aside>
  );
}

export default SideBar;
