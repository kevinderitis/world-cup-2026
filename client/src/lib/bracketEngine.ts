import {
  StandingEntry,
  Team,
  PossibleRivals,
  KnockoutPath,
  KnockoutRound,
} from "../types";

const KNOCKOUT_STAGES = [
  { key: "ROUND_OF_32", label: "Round of 32" },
  { key: "ROUND_OF_16", label: "Round of 16" },
  { key: "QUARTER_FINALS", label: "Quarter-final" },
  { key: "SEMI_FINALS", label: "Semi-final" },
  { key: "FINAL", label: "Final" },
];

function getGroupsInfo(standings: StandingEntry[]): {
  group: string;
  teams: StandingEntry[];
}[] {
  const groups = new Map<string, StandingEntry[]>();
  for (const entry of standings) {
    if (!groups.has(entry.group)) {
      groups.set(entry.group, []);
    }
    groups.get(entry.group)!.push(entry);
  }
  return Array.from(groups.entries())
    .map(([group, teams]) => ({
      group,
      teams: teams.sort((a, b) => a.position - b.position),
    }))
    .sort((a, b) => a.group.localeCompare(b.group));
}

function getTeamFromEntry(
  entry: StandingEntry | undefined,
  allTeams: Team[]
): Team | null {
  if (!entry) return null;
  return allTeams.find((t) => t.id === entry.team.id) || null;
}

export function determinePossibleRivals(
  teamId: number,
  standings: StandingEntry[],
  allTeams: Team[]
): PossibleRivals {
  const groupsInfo = getGroupsInfo(standings);
  const teamStanding = standings.find((s) => s.team.id === teamId);
  const teamGroup = teamStanding?.group || "";

  const firstPlaceOpponents: Team[] = [];
  const secondPlaceOpponents: Team[] = [];
  const otherGroups = groupsInfo.filter((g) => g.group !== teamGroup);

  for (const group of otherGroups) {
    const firstPlace = group.teams[0];
    const secondPlace = group.teams[1];
    const firstTeam = getTeamFromEntry(firstPlace, allTeams);
    const secondTeam = getTeamFromEntry(secondPlace, allTeams);
    if (firstTeam) firstPlaceOpponents.push(firstTeam);
    if (secondTeam) secondPlaceOpponents.push(secondTeam);
  }

  return {
    firstPlace: {
      possible: firstPlaceOpponents,
      mostLikely: firstPlaceOpponents.slice(0, 2),
    },
    secondPlace: {
      possible: secondPlaceOpponents,
      mostLikely: secondPlaceOpponents.slice(0, 2),
    },
  };
}

export function determineKnockoutPath(
  teamId: number,
  standings: StandingEntry[],
  allTeams: Team[]
): KnockoutPath {
  const groupsInfo = getGroupsInfo(standings);
  const teamStanding = standings.find((s) => s.team.id === teamId);
  const teamGroup = teamStanding?.group || "";
  const teamPosition = teamStanding?.position || 3;
  const isFirstPlace = teamPosition === 1;

  const path: KnockoutRound[] = [];

  for (let i = 0; i < KNOCKOUT_STAGES.length; i++) {
    const stage = KNOCKOUT_STAGES[i];
    const opponents: Team[] = [];
    let mostLikelyOpponent: Team | null = null;
    let probability = isFirstPlace ? 80 - i * 15 : 60 - i * 12;

    const otherGroups = groupsInfo.filter((g) => g.group !== teamGroup);

    if (i === 0) {
      if (isFirstPlace) {
        for (const g of otherGroups.slice(0, 4)) {
          if (g.teams[1]) {
            const t = getTeamFromEntry(g.teams[1], allTeams);
            if (t) opponents.push(t);
          }
        }
      } else {
        for (const g of otherGroups.slice(0, 4)) {
          if (g.teams[0]) {
            const t = getTeamFromEntry(g.teams[0], allTeams);
            if (t) opponents.push(t);
          }
        }
      }
      mostLikelyOpponent = opponents.length > 0 ? opponents[0] : null;
    } else {
      const allOtherTeams = standings
        .filter((s) => s.team.id !== teamId)
        .sort(
          (a, b) => b.points - a.points || b.goalDifference - a.goalDifference
        );
      for (const entry of allOtherTeams.slice(0, 4)) {
        const t = getTeamFromEntry(entry, allTeams);
        if (t) opponents.push(t);
      }
      mostLikelyOpponent = opponents.length > 0 ? opponents[0] : null;
    }

    probability = Math.max(Math.min(probability, 99), 1);
    path.push({
      round: stage.key,
      roundLabel: stage.label,
      opponents,
      mostLikelyOpponent,
      probability,
    });
  }

  return {
    path,
    final: {
      opponent:
        path[path.length - 1]?.mostLikelyOpponent || null,
      probability: isFirstPlace ? 8 : 3,
    },
  };
}
