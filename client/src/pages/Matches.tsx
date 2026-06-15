import { useState, useMemo } from "react";
import { useMatches } from "../hooks/useWorldCup";
import { useAppStore } from "../store";
import { MatchCard } from "../components/MatchCard";
import { PageSkeleton } from "../components/LoadingSkeleton";
import { ErrorPage } from "../components/ErrorPage";
import { EmptyState } from "../components/EmptyState";
import { Calendar, Filter } from "lucide-react";

type MatchFilter = "ALL" | "PLAYED" | "UPCOMING";

export function Matches() {
  const { selectedTeam } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<MatchFilter>("ALL");
  const { data: matches, isLoading, error, refetch } = useMatches({
    team: selectedTeam?.id,
  });

  const filteredMatches = useMemo(() => {
    if (!matches) return [];
    let result = matches;

    if (activeFilter === "PLAYED") {
      result = result.filter((m) => m.status === "FINISHED");
    } else if (activeFilter === "UPCOMING") {
      result = result.filter((m) => m.status !== "FINISHED");
    }

    return result.sort(
      (a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
    );
  }, [matches, activeFilter]);

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
        message="Could not load matches."
        onRetry={() => refetch()}
      />
    );

  const filterTabs: { key: MatchFilter; label: string }[] = [
    { key: "ALL", label: "All" },
    { key: "PLAYED", label: "Played" },
    { key: "UPCOMING", label: "Upcoming" },
  ];

  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0">Matches</h1>
        <Calendar className="w-5 h-5 text-white/30" />
      </div>

      <div className="flex gap-2 mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeFilter === tab.key
                ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                : "bg-white/5 text-white/50 hover:text-white/70 border border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredMatches.length === 0 ? (
        <EmptyState
          title="No matches found"
          message={
            activeFilter === "PLAYED"
              ? "No played matches yet."
              : activeFilter === "UPCOMING"
              ? "No upcoming matches scheduled."
              : "No matches available."
          }
          icon={<Calendar className="w-8 h-8 text-white/30" />}
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
          ))}
        </div>
      )}
    </div>
  );
}
