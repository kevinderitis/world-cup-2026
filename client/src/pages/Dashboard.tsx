import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Trophy,
  Swords,
  BarChart3,
  ClipboardList,
  ArrowLeftRight,
  TrendingUp,
  Target,
  LogOut,
} from "lucide-react";
import { useAppStore } from "../store";
import { useTeamDetail } from "../hooks/useWorldCup";
import { MatchCard } from "../components/MatchCard";
import { ProbabilityBar } from "../components/ProbabilityBar";
import { PageSkeleton } from "../components/LoadingSkeleton";
import { ErrorPage } from "../components/ErrorPage";
import { EmptyState } from "../components/EmptyState";
import { WC_LOGO_URL } from "../config/worldCupBracket";

const quickLinks = [
  { to: "/matches", icon: Calendar, label: "Matches", color: "from-blue-500 to-blue-600" },
  { to: "/standings", icon: Trophy, label: "Standings", color: "from-amber-500 to-amber-600" },
  { to: "/rivals", icon: Swords, label: "Rivals", color: "from-red-500 to-red-600" },
  { to: "/predictions", icon: BarChart3, label: "Predictions", color: "from-purple-500 to-purple-600" },
  { to: "/fixture", icon: ClipboardList, label: "Fixture", color: "from-green-500 to-green-600" },
  { to: "/compare", icon: ArrowLeftRight, label: "Compare", color: "from-teal-500 to-teal-600" },
];

export function Dashboard() {
  const { selectedTeam, clearSelectedTeam } = useAppStore();
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
        message="Could not load team data. The API may be rate limited."
        onRetry={() => refetch()}
      />
    );

  if (!teamDetail) return <EmptyState title="No data available" />;

  const { team, standing, playedMatches, upcomingMatches, prediction } =
    teamDetail;
  const lastMatch =
    playedMatches.length > 0 ? playedMatches[playedMatches.length - 1] : null;
  const nextMatch = upcomingMatches.length > 0 ? upcomingMatches[0] : null;

  return (
    <div className="page-container animate-fade-in">
        <div className="card-premium relative overflow-hidden mb-6 bg-gradient-to-br from-surface-light to-surface">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <img
            src={WC_LOGO_URL}
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex items-center gap-4 sm:gap-6 relative z-10">
          <img
            src={team.crest}
            alt={team.name}
            className="flag-large"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${team.tla}&background=random&color=fff&size=80`;
            }}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white truncate">
              {team.name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              {team.group && (
                <span className="badge-group bg-white/10 text-white/60">
                  Group {team.group}
                </span>
              )}
              {standing && (
                <span
                  className={`badge-group ${
                    standing.position === 1
                      ? "badge-position-1"
                      : standing.position === 2
                      ? "badge-position-2"
                      : standing.position === 3
                      ? "badge-position-3"
                      : "badge-position-4"
                  }`}
                >
                  #{standing.position}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              clearSelectedTeam();
              navigate("/");
            }}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors self-start"
            title="Change team"
          >
            <LogOut className="w-4 h-4 text-white/40 hover:text-white/70" />
          </button>
        </div>
      </div>

      {standing && (
        <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6">
          {[
            { label: "Pts", value: standing.points, color: "text-white" },
            { label: "P", value: standing.playedGames, color: "text-white/60" },
            { label: "GD", value: standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference, color: standing.goalDifference >= 0 ? "text-green-400" : "text-red-400" },
            { label: "Form", value: standing.form?.replace(/,/g, "").slice(0, 5) || "-", color: "text-primary-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="card-premium text-center py-3"
            >
              <p className={`text-lg font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-6">
        {quickLinks.map((link) => (
          <button
            key={link.to}
            onClick={() => navigate(link.to)}
            className="card-premium flex flex-col items-center gap-2 py-4 hover:bg-white/[0.04] active:scale-[0.97] transition-all"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center`}
            >
              <link.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-white/70">
              {link.label}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="card-premium">
          <h3 className="section-title flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-400" />
            Qualification
          </h3>
          <ProbabilityBar
            value={prediction.qualificationChance}
            label="Advance to knockout"
            color="green"
          />
        </div>
        <div className="card-premium">
          <h3 className="section-title flex items-center gap-2">
            <Target className="w-4 h-4 text-gold-400" />
            Win World Cup
          </h3>
          <ProbabilityBar
            value={prediction.winnerChance}
            label="Champion probability"
            color="gold"
          />
        </div>
      </div>

      {lastMatch && (
        <div className="mb-6">
          <h3 className="section-title">Last Result</h3>
          <MatchCard match={lastMatch} selectedTeamId={team.id} />
        </div>
      )}

      {nextMatch && (
        <div>
          <h3 className="section-title">Next Match</h3>
          <MatchCard match={nextMatch} selectedTeamId={team.id} />
        </div>
      )}
    </div>
  );
}
