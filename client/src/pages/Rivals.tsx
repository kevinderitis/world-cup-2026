import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTeamDetail } from "../hooks/useWorldCup";
import { useAppStore } from "../store";
import { KnockoutPath } from "../components/KnockoutPath";
import { PageSkeleton } from "../components/LoadingSkeleton";
import { ErrorPage } from "../components/ErrorPage";
import { EmptyState } from "../components/EmptyState";
import { Swords, Crown, Medal, Shield } from "lucide-react";

export function Rivals() {
  const { selectedTeam } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedTeam) {
      navigate("/", { replace: true });
    }
  }, [selectedTeam, navigate]);

  const { data: teamDetail, isLoading, error, refetch } = useTeamDetail(
    selectedTeam?.id ?? null
  );

  if (!selectedTeam) return null;

  if (isLoading) return <PageSkeleton />;

  if (error)
    return (
      <ErrorPage
        message="Could not load rival data."
        onRetry={() => refetch()}
      />
    );

  if (!teamDetail) return <EmptyState title="No rival data available" />;

  const { possibleRivals, knockoutPath, team } = teamDetail;

  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0">Possible Rivals</h1>
        <Swords className="w-5 h-5 text-red-400" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="card-premium">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-4 h-4 text-gold-400" />
            <h3 className="font-semibold text-white">If we finish 1st</h3>
          </div>
          <div className="space-y-2">
            {possibleRivals.firstPlace.possible.length > 0 ? (
              possibleRivals.firstPlace.possible.map((rival) => (
                <div
                  key={rival.id}
                  className="flex items-center gap-3 bg-white/5 rounded-xl p-2.5"
                >
                  <img
                    src={rival.crest}
                    alt={rival.name}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${rival.tla}&background=random&color=fff&size=24`;
                    }}
                  />
                  <span className="text-sm text-white/80">{rival.name}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/30">To be determined</p>
            )}
          </div>
        </div>

        <div className="card-premium">
          <div className="flex items-center gap-2 mb-4">
            <Medal className="w-4 h-4 text-primary-400" />
            <h3 className="font-semibold text-white">If we finish 2nd</h3>
          </div>
          <div className="space-y-2">
            {possibleRivals.secondPlace.possible.length > 0 ? (
              possibleRivals.secondPlace.possible.map((rival) => (
                <div
                  key={rival.id}
                  className="flex items-center gap-3 bg-white/5 rounded-xl p-2.5"
                >
                  <img
                    src={rival.crest}
                    alt={rival.name}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${rival.tla}&background=random&color=fff&size=24`;
                    }}
                  />
                  <span className="text-sm text-white/80">{rival.name}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/30">To be determined</p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-bold text-white">Most Likely Tournament Path</h2>
        </div>
        <KnockoutPath path={knockoutPath.path} teamName={team.name} />
      </div>

      <p className="text-xs text-white/20 italic mt-6 text-center">
        Predictions are estimates based on current standings and results. They are not official odds.
      </p>
    </div>
  );
}
