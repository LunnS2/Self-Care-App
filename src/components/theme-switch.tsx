"use client"; // This ensures the component is treated as a client component
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

const ThemeSwitch = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  // This effect will run only on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Avoid rendering during SSR
  if (!isMounted) {
    return null; // Or a loading indicator if preferred
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="bg-transparent relative">
        <Button variant="outline" size="icon">
          <SunIcon className={`h-[1.2rem] w-[1.2rem] transition-all ${resolvedTheme === 'dark' ? 'rotate-0 scale-0' : 'rotate-90 scale-100'}`} />
          <MoonIcon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${resolvedTheme === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-primary">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitch;
