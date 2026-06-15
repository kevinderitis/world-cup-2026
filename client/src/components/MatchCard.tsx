import { Match } from "../types";
import { Calendar, Clock } from "lucide-react";

interface MatchCardProps {
  match: Match;
  selectedTeamId?: number;
}

function formatDate(utcDate: string): string {
  const date = new Date(utcDate);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(utcDate: string): string {
  const date = new Date(utcDate);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getMatchStatus(match: Match): { label: string; color: string } {
  if (match.status === "FINISHED") {
    return { label: "FT", color: "text-green-400" };
  }
  if (match.status === "IN_PLAY") {
    return { label: "LIVE", color: "text-red-400 animate-pulse" };
  }
  if (match.status === "PAUSED") {
    return { label: "HT", color: "text-yellow-400" };
  }
  return { label: formatTime(match.utcDate), color: "text-white/50" };
}

export function MatchCard({ match, selectedTeamId }: MatchCardProps) {
  const status = getMatchStatus(match);
  const isHomeSelected = match.homeTeam.id === selectedTeamId;
  const isAwaySelected = match.awayTeam.id === selectedTeamId;
  const isFinished = match.status === "FINISHED";

  return (
    <div className="card-premium hover:bg-surface-lighter/60">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-white/40">
          {formatDate(match.utcDate)}
        </span>
        <div className="flex items-center gap-1">
          {match.stage !== "GROUP_STAGE" && (
            <span className="text-xs text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-full">
              {match.stage.replace(/_/g, " ")}
            </span>
          )}
          {match.group && match.stage === "GROUP_STAGE" && (
            <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
              Group {match.group}
            </span>
          )}
          <span className={`text-xs font-mono font-semibold ml-2 ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={match.homeTeam.crest}
            alt={match.homeTeam.name}
            className="w-8 h-8 object-contain"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${match.homeTeam.tla}&background=random&color=fff&size=32`;
            }}
          />
          <span
            className={`text-sm font-medium truncate ${
              isHomeSelected ? "text-primary-400" : "text-white"
            }`}
          >
            {match.homeTeam.shortName || match.homeTeam.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isFinished ? (
            <span className="text-lg font-bold tabular-nums text-white">
              {match.score.home} - {match.score.away}
            </span>
          ) : (
            <span className="text-sm text-white/30">vs</span>
          )}
        </div>

        <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
          <span
            className={`text-sm font-medium truncate ${
              isAwaySelected ? "text-primary-400" : "text-white"
            }`}
          >
            {match.awayTeam.shortName || match.awayTeam.name}
          </span>
          <img
            src={match.awayTeam.crest}
            alt={match.awayTeam.name}
            className="w-8 h-8 object-contain"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${match.awayTeam.tla}&background=random&color=fff&size=32`;
            }}
          />
        </div>
      </div>
    </div>
  );
}
