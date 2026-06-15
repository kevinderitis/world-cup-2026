import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";
import { useAppStore } from "../store";
import { LogOut } from "lucide-react";

export function Layout() {
  const { selectedTeam, clearSelectedTeam } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const showTopBar = selectedTeam && location.pathname !== "/";

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <main className="lg:ml-64 min-h-screen pb-16 lg:pb-0">
        {showTopBar && (
          <div className="sticky top-0 z-30 lg:hidden bg-surface-lighter/90 backdrop-blur-xl border-b border-white/5 px-4 py-2.5 flex items-center justify-between">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2"
            >
              <img
                src={selectedTeam.crest}
                alt={selectedTeam.name}
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${selectedTeam.tla}&background=random&color=fff&size=24`;
                }}
              />
              <span className="text-sm font-semibold text-white truncate max-w-[140px]">
                {selectedTeam.name}
              </span>
            </button>
            <button
              onClick={() => {
                clearSelectedTeam();
                navigate("/");
              }}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Change
            </button>
          </div>
        )}
        <Outlet />
      </main>
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
