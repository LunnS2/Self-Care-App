"use client";

import React, { useEffect, useState } from "react";
import NavLink from "./nav-link";
import HomeIcon from "@mui/icons-material/Home";
import TaskIcon from "@mui/icons-material/Task";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChallengeIcon from "@mui/icons-material/EmojiEvents";
import GratitudeIcon from "@mui/icons-material/Favorite";
import MeditationIcon from "@mui/icons-material/SelfImprovement";
import JournalIcon from "@mui/icons-material/Book";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { usePathname } from "next/navigation";

function SideBar() {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <aside className="fixed left-0 top-0 w-16 h-screen bg-card flex flex-col items-center py-6 transition-all duration-300 hover:w-24 md:w-20 md:hover:w-24 shadow-xl">
      <nav className="flex flex-col space-y-6 text-white">
        <NavLink href="/" icon={<HomeIcon />} label="Home" isActive={pathname === "/"} />
        <NavLink 
          href="/create-task" 
          icon={<TaskIcon />} 
          label="Add Tasks" 
          isActive={pathname === "/create-task"} 
        />
        <NavLink
          href="/user-tasks"
          icon={<AssignmentIcon />}
          label="Your Tasks"
          isActive={pathname === "/user-tasks"}
        />
        <NavLink
          href="/daily-challenge"
          icon={<ChallengeIcon />}
          label="Daily Challenge"
          isActive={pathname === "/daily-challenge"}
        />
        <NavLink
          href="/gratitude-log"
          icon={<GratitudeIcon />}
          label="Gratitude"
          isActive={pathname === "/gratitude-log"}
        />
        <NavLink
          href="/meditation"
          icon={<MeditationIcon />}
          label="Meditation"
          isActive={pathname === "/meditation"}
        />
        <NavLink 
          href="/journal" 
          icon={<JournalIcon />} 
          label="Journal" 
          isActive={pathname === "/journal"} 
        />
        <NavLink 
          href="/shop" 
          icon={<StorefrontIcon />} 
          label="Shop" 
          isActive={pathname === "/shop"} 
        />
      </nav>
    </aside>
  );
}

export default SideBar;