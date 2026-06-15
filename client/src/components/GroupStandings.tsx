import { GroupStanding as GroupStandingType } from "../types";
import { StandingTable } from "./StandingTable";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface GroupStandingsProps {
  standings: GroupStandingType[];
  selectedTeamId?: number;
}

export function GroupStandings({
  standings,
  selectedTeamId,
}: GroupStandingsProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    if (selectedTeamId) {
      const teamGroup = standings.find((g) =>
        g.table.some((t) => t.team.id === selectedTeamId)
      );
      return new Set(teamGroup ? [teamGroup.group] : [standings[0]?.group]);
    }
    return new Set([standings[0]?.group]);
  });

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {standings.map((groupStanding) => {
        const isExpanded = expandedGroups.has(groupStanding.group);
        return (
          <div key={groupStanding.group} className="card-premium p-0 overflow-hidden">
            <button
              onClick={() => toggleGroup(groupStanding.group)}
              className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white/80">
                  Group {groupStanding.group}
                </span>
                <span className="text-xs text-white/30">
                  {groupStanding.table.length} teams
                </span>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-white/40" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/40" />
              )}
            </button>
            {isExpanded && (
              <div className="px-4 pb-4">
                <StandingTable
                  entries={groupStanding.table}
                  selectedTeamId={selectedTeamId}
                  group={groupStanding.group}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
