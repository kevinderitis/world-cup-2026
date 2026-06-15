import { StandingEntry } from "../types";
import { useNavigate } from "react-router-dom";

interface StandingTableProps {
  entries: StandingEntry[];
  selectedTeamId?: number;
  group: string;
}

export function StandingTable({
  entries,
  selectedTeamId,
  group,
}: StandingTableProps) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-white/40 uppercase tracking-wider border-b border-white/5">
            <th className="text-left py-2 pr-2 w-8">#</th>
            <th className="text-left py-2 pr-2">Team</th>
            <th className="text-center py-2 px-1.5">P</th>
            <th className="text-center py-2 px-1.5 hidden sm:table-cell">W</th>
            <th className="text-center py-2 px-1.5 hidden sm:table-cell">D</th>
            <th className="text-center py-2 px-1.5 hidden sm:table-cell">L</th>
            <th className="text-center py-2 px-1.5 hidden md:table-cell">GF</th>
            <th className="text-center py-2 px-1.5 hidden md:table-cell">GA</th>
            <th className="text-center py-2 px-1.5 hidden md:table-cell">GD</th>
            <th className="text-center py-2 pl-1.5 font-bold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const isSelected = entry.team.id === selectedTeamId;
            return (
              <tr
                key={entry.team.id}
                onClick={() => {
                  if (entry.team.id !== selectedTeamId) {
                    navigate(`/dashboard?team=${entry.team.id}`);
                  }
                }}
                className={`border-b border-white/5 transition-colors ${
                  isSelected
                    ? "bg-primary-500/10 border-primary-500/30"
                    : "hover:bg-white/[0.02] cursor-pointer"
                }`}
              >
                <td className="py-3 pr-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      entry.position === 1
                        ? "badge-position-1"
                        : entry.position === 2
                        ? "badge-position-2"
                        : entry.position === 3
                        ? "badge-position-3"
                        : "badge-position-4"
                    }`}
                  >
                    {entry.position}
                  </span>
                </td>
                <td className="py-3 pr-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={entry.team.crest}
                      alt={entry.team.name}
                      className="w-5 h-5 object-contain"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${entry.team.tla}&background=random&color=fff&size=20`;
                      }}
                    />
                    <span
                      className={`font-medium truncate max-w-[120px] sm:max-w-none ${
                        isSelected ? "text-primary-400" : "text-white"
                      }`}
                    >
                      {entry.team.shortName || entry.team.name}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    )}
                  </div>
                </td>
                <td className="text-center py-3 px-1.5 text-white/80">
                  {entry.playedGames}
                </td>
                <td className="text-center py-3 px-1.5 text-white/60 hidden sm:table-cell">
                  {entry.won}
                </td>
                <td className="text-center py-3 px-1.5 text-white/60 hidden sm:table-cell">
                  {entry.draw}
                </td>
                <td className="text-center py-3 px-1.5 text-white/60 hidden sm:table-cell">
                  {entry.lost}
                </td>
                <td className="text-center py-3 px-1.5 text-white/60 hidden md:table-cell">
                  {entry.goalsFor}
                </td>
                <td className="text-center py-3 px-1.5 text-white/60 hidden md:table-cell">
                  {entry.goalsAgainst}
                </td>
                <td className="text-center py-3 px-1.5 hidden md:table-cell">
                  <span
                    className={
                      entry.goalDifference > 0
                        ? "text-green-400"
                        : entry.goalDifference < 0
                        ? "text-red-400"
                        : "text-white/60"
                    }
                  >
                    {entry.goalDifference > 0 ? "+" : ""}
                    {entry.goalDifference}
                  </span>
                </td>
                <td className="text-center py-3 pl-1.5 font-bold text-white">
                  {entry.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
