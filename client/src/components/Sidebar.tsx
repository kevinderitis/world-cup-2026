import { NavLink } from "react-router-dom";
import { useAppStore } from "../store";
import {
  Home,
  Calendar,
  Trophy,
  Swords,
  BarChart3,
  ClipboardList,
  ArrowLeftRight,
  LogOut,
} from "lucide-react";
import { WC_LOGO_URL } from "../config/worldCupBracket";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Dashboard" },
  { to: "/matches", icon: Calendar, label: "Matches" },
  { to: "/standings", icon: Trophy, label: "Standings" },
  { to: "/rivals", icon: Swords, label: "Possible Rivals" },
  { to: "/predictions", icon: BarChart3, label: "Predictions" },
  { to: "/fixture", icon: ClipboardList, label: "Tournament Fixture" },
  { to: "/compare", icon: ArrowLeftRight, label: "Compare Teams" },
];

export function Sidebar() {
  const { selectedTeam, clearSelectedTeam } = useAppStore();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-surface-lighter/90 backdrop-blur-xl border-r border-white/5 z-40">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={WC_LOGO_URL}
            alt="World Cup 2026"
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="text-lg font-bold text-white">World Cup</h1>
            <p className="text-xs text-white/40">Path</p>
          </div>
        </div>
        {selectedTeam && (
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2.5">
            <img
              src={selectedTeam.crest}
              alt={selectedTeam.name}
              className="w-6 h-6 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${selectedTeam.tla}&background=random&color=fff&size=24`;
              }}
            />
            <span className="text-sm font-medium truncate text-white/80">
              {selectedTeam.name}
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive
                  ? "bg-primary-500/10 text-primary-400"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={clearSelectedTeam}
          className="flex items-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Change team
        </button>
      </div>
    </aside>
  );
}
