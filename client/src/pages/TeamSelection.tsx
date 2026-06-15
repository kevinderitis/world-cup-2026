import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Trophy } from "lucide-react";
import { useTeams } from "../hooks/useWorldCup";
import { useAppStore } from "../store";
import { Team } from "../types";
import { TeamCard } from "../components/TeamCard";
import { WC_LOGO_URL } from "../config/worldCupBracket";

export function TeamSelection() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { data: teams, isLoading, error } = useTeams();
  const { setSelectedTeam, selectedTeam } = useAppStore();

  const filteredTeams = useMemo(() => {
    if (!teams) return [];
    if (!search.trim()) return teams;
    const q = search.toLowerCase();
    return teams.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.shortName.toLowerCase().includes(q) ||
        t.tla.toLowerCase().includes(q) ||
        (t.group && t.group.toLowerCase().includes(q))
    );
  }, [teams, search]);

  const groups = useMemo(() => {
    if (!filteredTeams.length) return [];
    const map = new Map<string, Team[]>();
    for (const team of filteredTeams) {
      const g = team.group || "Ungrouped";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(team);
    }
    return Array.from(map.entries()).sort((a, b) => {
      if (a[0] === "Ungrouped") return 1;
      if (b[0] === "Ungrouped") return -1;
      return a[0].localeCompare(b[0]);
    });
  }, [filteredTeams]);

  const handleSelect = (team: Team) => {
    setSelectedTeam(team);
    navigate("/dashboard");
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <Trophy className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Unable to load teams</h2>
        <p className="text-white/50 max-w-sm mb-6">
          Could not fetch World Cup data. Make sure the server is running and FOOTBALL_DATA_API_KEY is set.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-surface flex flex-col overflow-hidden">
      {/* Fixed header */}
      <div className="flex-shrink-0 px-4 sm:px-6 pt-6 pb-3 max-w-2xl mx-auto w-full">
        <div className="text-center animate-fade-in">
          <div className="flex justify-center mb-3">
            <img
              src={WC_LOGO_URL}
              alt="World Cup 2026"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
            World Cup <span className="text-gradient-primary">Path</span>
          </h1>
          <p className="text-white/40 text-xs sm:text-sm">
            Select your team to follow their journey
          </p>
        </div>
      </div>

      {/* Fixed search bar */}
      <div className="flex-shrink-0 px-4 sm:px-6 pb-3 max-w-2xl mx-auto w-full">
        <div className="relative animate-slide-up">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search by country, group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 
                     text-white placeholder-white/30 outline-none focus:border-primary-500/50 
                     focus:bg-white/10 transition-all duration-200 text-sm"
            autoFocus
          />
        </div>
      </div>

      {/* Scrollable team list */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-28 max-w-2xl mx-auto w-full">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card-premium animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 skeleton rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 skeleton rounded" />
                    <div className="h-3 w-16 skeleton rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 animate-slide-up">
            {groups.map(([group, groupTeams]) => (
              <div key={group}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                    {group === "Ungrouped" ? "Other Teams" : `Group ${group}`}
                  </span>
                  <span className="text-xs text-white/20">({groupTeams.length})</span>
                </div>
                <div className="space-y-2">
                  {groupTeams.map((team) => (
                    <TeamCard
                      key={team.id}
                      team={team}
                      selected={selectedTeam?.id === team.id}
                      onClick={() => handleSelect(team)}
                    />
                  ))}
                </div>
              </div>
            ))}
            {filteredTeams.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/30">No teams found for "{search}"</p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
