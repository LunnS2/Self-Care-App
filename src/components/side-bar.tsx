// self-care-app\src\components\side-bar.tsx

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import NavLink from "./nav-link";
import HouseboatIcon from "@mui/icons-material/Houseboat";
import TaskIcon from "@mui/icons-material/Task";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChallengeIcon from "@mui/icons-material/EmojiEvents";
import GratitudeIcon from "@mui/icons-material/Favorite";
import MeditationIcon from "@mui/icons-material/SelfImprovement";
import JournalIcon from "@mui/icons-material/Book";
import StorefrontIcon from '@mui/icons-material/Storefront';

function SideBar() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <aside className="fixed left-0 top-0 w-16 h-screen bg-gray-800 flex flex-col items-center py-6 transition-all duration-300 hover:w-24 md:w-20 md:hover:w-24 shadow-xl">
      <nav className="flex flex-col space-y-6 text-white">
        <NavLink href="/" icon={<HouseboatIcon  />} label="Home" />
        <NavLink href="/create-task" icon={<TaskIcon />} label="Add Tasks" />
        <NavLink href="/user-tasks" icon={<AssignmentIcon />} label="Your Tasks" />
        <NavLink href="/daily-challenge" icon={<ChallengeIcon />} label="Daily Challenge" />
        <NavLink href="/gratitude-log" icon={<GratitudeIcon />} label="Gratitude" />
        <NavLink href="/meditation" icon={<MeditationIcon />} label="Meditation" />
        <NavLink href="/journal" icon={<JournalIcon />} label="Journal" />
        <NavLink href="/shop" icon={<StorefrontIcon />} label="Shop" />
      </nav>
    </aside>
  );
}

export default SideBar;
