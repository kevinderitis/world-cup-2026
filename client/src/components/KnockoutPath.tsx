import { KnockoutRound } from "../types";
import { ArrowDown, Trophy } from "lucide-react";

interface KnockoutPathProps {
  path: KnockoutRound[];
  teamName: string;
}

export function KnockoutPath({ path, teamName }: KnockoutPathProps) {
  return (
    <div className="space-y-0">
      {path.map((round, index) => (
        <div key={round.round} className="relative">
          <div className="card-premium relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {round.round === "FINAL" && (
                  <Trophy className="w-4 h-4 text-gold-400" />
                )}
                <span
                  className={`text-sm font-semibold ${
                    round.round === "FINAL"
                      ? "text-gradient-gold"
                      : "text-white/80"
                  }`}
                >
                  {round.roundLabel}
                </span>
              </div>
              <span className="text-xs font-medium text-primary-400">
                {round.probability}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">Most likely:</span>
              {(() => {
              const opponent = round.mostLikelyOpponent;
              return opponent ? (
                <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-2 py-0.5">
                  <img
                    src={opponent.crest}
                    alt={opponent.name}
                    className="w-4 h-4 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${opponent.tla}&background=random&color=fff&size=16`;
                    }}
                  />
                  <span className="text-xs text-white/80">
                    {opponent.shortName}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-white/30">To be determined</span>
              );
            })()}
            </div>
          </div>
          {index < path.length - 1 && (
            <div className="flex justify-center py-1">
              <ArrowDown className="w-4 h-4 text-white/20" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
