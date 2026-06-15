import { useState, useMemo } from "react";
import { useStandings, useMatches } from "../hooks/useWorldCup";
import { useAppStore } from "../store";
import { PageSkeleton } from "../components/LoadingSkeleton";
import { ErrorPage } from "../components/ErrorPage";
import { ArrowLeftRight, Search } from "lucide-react";
import { Team } from "../types";
import { useTeams } from "../hooks/useWorldCup";

function StatRow({
  label,
  team1Value,
  team2Value,
  format = "number",
  higherIsBetter = true,
}: {
  label: string;
  team1Value: number | string;
  team2Value: number | string;
  format?: "number" | "string";
  higherIsBetter?: boolean;
}) {
  const val1 = typeof team1Value === "number" ? team1Value : 0;
  const val2 = typeof team2Value === "number" ? team2Value : 0;
  const better1 = higherIsBetter ? val1 >= val2 : val1 <= val2;
  const better2 = higherIsBetter ? val2 >= val1 : val2 <= val1;

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <span
        className={`text-sm font-medium ${
          better1 ? "text-white" : "text-white/40"
        }`}
      >
        {team1Value}
      </span>
      <span className="text-xs text-white/30 uppercase tracking-wider">
        {label}
      </span>
      <span
        className={`text-sm font-medium ${
          better2 ? "text-white" : "text-white/40"
        }`}
      >
        {team2Value}
      </span>
    </div>
  );
}

export function TeamComparison() {
  const { selectedTeam } = useAppStore();
  const { data: standings, isLoading: standingsLoading, error: standingsError, refetch } = useStandings();
  const { data: allTeams, isLoading: teamsLoading } = useTeams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam2, setSelectedTeam2] = useState<Team | null>(null);

  const allStandings = useMemo(
    () => (standings ? standings.flatMap((s) => s.table) : []),
    [standings]
  );

  const team1Standing = useMemo(
    () => allStandings.find((s) => s.team.id === selectedTeam?.id),
    [allStandings, selectedTeam]
  );

  const team2Standing = useMemo(
    () => allStandings.find((s) => s.team.id === selectedTeam2?.id),
    [allStandings, selectedTeam2]
  );

  const otherTeams = useMemo(() => {
    if (!allTeams) return [];
    return allTeams.filter((t) => t.id !== selectedTeam?.id);
  }, [allTeams, selectedTeam]);

  const filteredOtherTeams = useMemo(() => {
    if (!searchQuery.trim()) return otherTeams.slice(0, 5);
    const q = searchQuery.toLowerCase();
    return otherTeams.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.shortName.toLowerCase().includes(q) ||
        t.tla.toLowerCase().includes(q)
    );
  }, [otherTeams, searchQuery]);

  if (standingsLoading || teamsLoading) return <PageSkeleton />;

  if (standingsError)
    return (
      <ErrorPage
        message="Could not load comparison data."
        onRetry={() => refetch()}
      />
    );

  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0">Compare Teams</h1>
        <ArrowLeftRight className="w-5 h-5 text-teal-400" />
      </div>

      {!selectedTeam2 ? (
        <div>
          <p className="text-sm text-white/40 mb-4">
            Select a team to compare with {selectedTeam?.name}
          </p>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search for a team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 
                       text-white placeholder-white/30 outline-none focus:border-primary-500/50 
                       focus:bg-white/10 transition-all duration-200 text-sm"
            />
          </div>
          <div className="space-y-2">
            {filteredOtherTeams.map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedTeam2(team)}
                className="card-premium w-full text-left flex items-center gap-3 p-3 hover:bg-white/[0.04]"
              >
                <img
                  src={team.crest}
                  alt={team.name}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${team.tla}&background=random&color=fff&size=32`;
                  }}
                />
                <div>
                  <p className="text-sm font-medium text-white">{team.name}</p>
                  {team.group && (
                    <p className="text-xs text-white/40">Group {team.group}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              setSelectedTeam2(null);
              setSearchQuery("");
            }}
            className="text-sm text-primary-400 hover:text-primary-300 mb-4 inline-block"
          >
            &larr; Change team
          </button>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <img
                src={selectedTeam?.crest}
                alt={selectedTeam?.name}
                className="w-14 h-14 object-contain mx-auto mb-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${selectedTeam?.tla}&background=random&color=fff&size=56`;
                }}
              />
              <p className="text-sm font-semibold text-white truncate">
                {selectedTeam?.shortName}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-xs text-white/30 uppercase font-bold">vs</span>
            </div>
            <div className="text-center">
              <img
                src={selectedTeam2.crest}
                alt={selectedTeam2.name}
                className="w-14 h-14 object-contain mx-auto mb-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${selectedTeam2.tla}&background=random&color=fff&size=56`;
                }}
              />
              <p className="text-sm font-semibold text-white truncate">
                {selectedTeam2.shortName}
              </p>
            </div>
          </div>

          <div className="card-premium">
            <h3 className="font-semibold text-white mb-2 text-sm">Stats Comparison</h3>
            <StatRow
              label="Points"
              team1Value={team1Standing?.points ?? 0}
              team2Value={team2Standing?.points ?? 0}
            />
            <StatRow
              label="Played"
              team1Value={team1Standing?.playedGames ?? 0}
              team2Value={team2Standing?.playedGames ?? 0}
              higherIsBetter={false}
            />
            <StatRow
              label="Wins"
              team1Value={team1Standing?.won ?? 0}
              team2Value={team2Standing?.won ?? 0}
            />
            <StatRow
              label="Draws"
              team1Value={team1Standing?.draw ?? 0}
              team2Value={team2Standing?.draw ?? 0}
            />
            <StatRow
              label="Losses"
              team1Value={team1Standing?.lost ?? 0}
              team2Value={team2Standing?.lost ?? 0}
              higherIsBetter={false}
            />
            <StatRow
              label="Goals For"
              team1Value={team1Standing?.goalsFor ?? 0}
              team2Value={team2Standing?.goalsFor ?? 0}
            />
            <StatRow
              label="Goals Against"
              team1Value={team1Standing?.goalsAgainst ?? 0}
              team2Value={team2Standing?.goalsAgainst ?? 0}
              higherIsBetter={false}
            />
            <StatRow
              label="Goal Difference"
              team1Value={team1Standing?.goalDifference ?? 0}
              team2Value={team2Standing?.goalDifference ?? 0}
            />
            <StatRow
              label="Form"
              team1Value={team1Standing?.form?.replace(/,/g, "") || "-"}
              team2Value={team2Standing?.form?.replace(/,/g, "") || "-"}
              format="string"
            />
          </div>
        </div>
      )}
    </div>
  );
}
