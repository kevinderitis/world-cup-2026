import { useStandings } from "../hooks/useWorldCup";
import { useAppStore } from "../store";
import { GroupStandings } from "../components/GroupStandings";
import { PageSkeleton } from "../components/LoadingSkeleton";
import { ErrorPage } from "../components/ErrorPage";
import { EmptyState } from "../components/EmptyState";
import { Trophy } from "lucide-react";

export function Standings() {
  const { selectedTeam } = useAppStore();
  const { data: standings, isLoading, error, refetch } = useStandings();

  if (isLoading) return <PageSkeleton />;

  if (error)
    return (
      <ErrorPage
        message="Could not load standings."
        onRetry={() => refetch()}
      />
    );

  if (!standings || standings.length === 0)
    return (
      <EmptyState
        title="No standings available"
        message="Standings will appear once the tournament starts."
        icon={<Trophy className="w-8 h-8 text-white/30" />}
      />
    );

  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0">Standings</h1>
        <Trophy className="w-5 h-5 text-amber-400" />
      </div>

      <GroupStandings
        standings={standings}
        selectedTeamId={selectedTeam?.id}
      />
    </div>
  );
}
