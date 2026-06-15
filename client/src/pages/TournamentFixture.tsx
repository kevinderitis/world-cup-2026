import { useState, useMemo } from "react";
import { useMatches } from "../hooks/useWorldCup";
import { useAppStore } from "../store";
import { MatchCard } from "../components/MatchCard";
import { PageSkeleton } from "../components/LoadingSkeleton";
import { ErrorPage } from "../components/ErrorPage";
import { EmptyState } from "../components/EmptyState";
import { ClipboardList } from "lucide-react";

const STAGES = [
  { key: "ALL", label: "All" },
  { key: "GROUP_STAGE", label: "Group" },
  { key: "ROUND_OF_32", label: "R32" },
  { key: "ROUND_OF_16", label: "R16" },
  { key: "QUARTER_FINALS", label: "QF" },
  { key: "SEMI_FINALS", label: "SF" },
  { key: "FINAL", label: "Final" },
];

const STATUS_FILTERS = [
  { key: "ALL", label: "All" },
  { key: "PLAYED", label: "Played" },
  { key: "UPCOMING", label: "Upcoming" },
];

export function TournamentFixture() {
  const { selectedTeam } = useAppStore();
  const [stageFilter, setStageFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [teamFilter, setTeamFilter] = useState<"all" | "my">("all");

  const { data: matches, isLoading, error, refetch } = useMatches(
    teamFilter === "my" ? { team: selectedTeam?.id } : {}
  );

  const filteredMatches = useMemo(() => {
    if (!matches) return [];

    let result = [...matches];

    if (stageFilter !== "ALL") {
      result = result.filter((m) => m.stage === stageFilter);
    }

    if (statusFilter === "PLAYED") {
      result = result.filter((m) => m.status === "FINISHED");
    } else if (statusFilter === "UPCOMING") {
      result = result.filter((m) => m.status !== "FINISHED");
    }

    return result.sort(
      (a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
    );
  }, [matches, stageFilter, statusFilter]);

  const groupedByDate = useMemo(() => {
    const groups = new Map<string, typeof matches>();
    if (!filteredMatches) return groups;
    for (const match of filteredMatches) {
      const dateKey = new Date(match.utcDate).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(match);
    }
    return groups;
  }, [filteredMatches]);

  if (isLoading) return <PageSkeleton />;

  if (error)
    return (
      <ErrorPage
        message="Could not load tournament fixture."
        onRetry={() => refetch()}
      />
    );

  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0">Tournament Fixture</h1>
        <ClipboardList className="w-5 h-5 text-green-400" />
      </div>

      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              statusFilter === f.key
                ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                : "bg-white/5 text-white/50 hover:text-white/70 border border-transparent"
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="w-px bg-white/10 mx-1" />
        <button
          onClick={() => setTeamFilter(teamFilter === "all" ? "my" : "all")}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
            teamFilter === "my"
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-white/5 text-white/50 hover:text-white/70 border border-transparent"
          }`}
        >
          {teamFilter === "my" ? "My Team" : "All Teams"}
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        {STAGES.map((s) => (
          <button
            key={s.key}
            onClick={() => setStageFilter(s.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
              stageFilter === s.key
                ? "bg-white/10 text-white"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {filteredMatches.length === 0 ? (
        <EmptyState
          title="No matches found"
          message="Try changing the filters."
          icon={<ClipboardList className="w-8 h-8 text-white/30" />}
        />
      ) : (
        <div className="space-y-6">
          {Array.from(groupedByDate.entries()).map(([dateLabel, dateMatches]) =>
            dateMatches && (
            <div key={dateLabel}>
              <h3 className="text-sm font-semibold text-white/40 mb-3 uppercase tracking-wider">
                {dateLabel}
              </h3>
              <div className="space-y-2">
                {dateMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    selectedTeamId={selectedTeam?.id}
                  />
                ))}
              </div>
            </div>
          )
        )}
        </div>
      )}
    </div>
  );
}
