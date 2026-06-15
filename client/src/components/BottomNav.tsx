import { NavLink } from "react-router-dom";
import {
  Home,
  Calendar,
  Trophy,
  Swords,
  BarChart3,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/matches", icon: Calendar, label: "Matches" },
  { to: "/standings", icon: Trophy, label: "Standings" },
  { to: "/rivals", icon: Swords, label: "Rivals" },
  { to: "/predictions", icon: BarChart3, label: "Predictions" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-lighter/90 backdrop-blur-xl border-t border-white/5 safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
