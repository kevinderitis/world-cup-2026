import { Team } from "../types";
import { ChevronRight } from "lucide-react";

interface TeamCardProps {
  team: Team;
  onClick?: () => void;
  selected?: boolean;
  compact?: boolean;
}

export function TeamCard({ team, onClick, selected, compact }: TeamCardProps) {
  return (
    <button
      onClick={onClick}
      className={`card-premium w-full text-left flex items-center gap-4 ${
        selected ? "ring-2 ring-primary-500 border-primary-500/50" : ""
      } ${compact ? "p-3" : "p-4"}`}
    >
      <img
        src={team.crest}
        alt={team.name}
        className={compact ? "flag-small" : "flag-medium"}
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${team.tla}&background=random&color=fff&size=48`;
        }}
      />
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-white truncate ${compact ? "text-sm" : ""}`}>
          {team.name}
        </p>
        {team.group && (
          <p className="text-xs text-white/40">
            Group {team.group}
          </p>
        )}
      </div>
      {selected && (
        <div className="w-2 h-2 rounded-full bg-primary-500" />
      )}
      {onClick && !selected && (
        <ChevronRight className="w-4 h-4 text-white/30" />
      )}
    </button>
  );
}
