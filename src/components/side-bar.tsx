import React from 'react';
import Link from "next/link";
import HouseboatIcon from '@mui/icons-material/Houseboat';
import ThemeSwitch from './theme-switch';

function SideBar() {
  return (
    <aside className="fixed left-0 top-0 w-16 h-screen bg-black flex flex-col items-center justify-start p-4 transition-all duration-300 hover:w-20 md:w-20 md:hover:w-24">
      <div>
        <Link href="/" className='flex'>
          <HouseboatIcon className="text-white text-3xl" />
          <span className="text-white">home</span>
        </Link>
      </div>
    </aside>
  );
}

export default SideBar;
