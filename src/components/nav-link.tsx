// self-care-app\src\components\nav-link.tsx

import Link from "next/link";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
}

function NavLink({ href, icon, label, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`group flex flex-col items-center transition-colors ${
        isActive ? "text-primary" : "text-gray-400 hover:text-primary"
      }`}
    >
      <div className="text-3xl mb-1">{icon}</div>
      <span className="text-xs hidden md:block transition-opacity duration-200 opacity-0 group-hover:opacity-100 h-6">
        {label}
      </span>
    </Link>
  );
}

export default NavLink;