import {
  StandingEntry,
  Team,
  PossibleRivals,
  KnockoutPath,
  KnockoutRound,
  Match,
} from "../types";

const KNOCKOUT_STAGES = [
  { key: "ROUND_OF_32", label: "Round of 32" },
  { key: "ROUND_OF_16", label: "Round of 16" },
  { key: "QUARTER_FINALS", label: "Quarter-final" },
  { key: "SEMI_FINALS", label: "Semi-final" },
  { key: "FINAL", label: "Final" },
];

const GROUP_PAIRS_1ST: Record<string, string[]> = {
  A: ["B", "C", "D", "E", "F", "G", "H"],
  B: ["A", "C", "D", "E", "F", "G", "H"],
  C: ["A", "B", "D", "E", "F", "G", "H"],
  D: ["A", "B", "C", "E", "F", "G", "H"],
  E: ["A", "B", "C", "D", "F", "G", "H"],
  F: ["A", "B", "C", "D", "E", "G", "H"],
  G: ["A", "B", "C", "D", "E", "F", "H"],
  H: ["A", "B", "C", "D", "E", "F", "G"],
};

const GROUP_PAIRS_2ND: Record<string, string[]> = {
  A: ["C", "D", "E", "F"],
  B: ["A", "D", "E", "F"],
  C: ["A", "B", "E", "F"],
  D: ["A", "B", "C", "G"],
  E: ["A", "B", "C", "D"],
  F: ["A", "B", "C", "D"],
  G: ["D", "E", "H"],
  H: ["A", "B", "C"],
};

const GROUP_1ST_VS_2ND: Record<string, string[]> = {
  A: ["B", "C", "D", "E", "F"],
  B: ["A", "C", "D", "E", "F"],
  C: ["A", "B", "E", "F"],
  D: ["A", "B", "C", "G"],
  E: ["A", "B", "C", "D"],
  F: ["A", "B", "C", "D"],
  G: ["A", "B", "D", "E", "H"],
  H: ["A", "B", "C", "G"],
};

interface GroupInfo {
  group: string;
  teams: StandingEntry[];
}

function getGroupsInfo(standings: StandingEntry[]): GroupInfo[] {
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

function findTeamInGroup(
  teamId: number,
  groupInfo: GroupInfo
): StandingEntry | null {
  return groupInfo.teams.find((t) => t.team.id === teamId) || null;
}

function findStandingEntry(
  teamId: number,
  standings: StandingEntry[]
): StandingEntry | null {
  return standings.find((s) => s.team.id === teamId) || null;
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

  const mostLikelyFirst: Team[] = firstPlaceOpponents.slice(0, 2);
  const mostLikelySecond: Team[] = secondPlaceOpponents.slice(0, 2);

  return {
    firstPlace: {
      possible: firstPlaceOpponents,
      mostLikely: mostLikelyFirst,
    },
    secondPlace: {
      possible: secondPlaceOpponents,
      mostLikely: mostLikelySecond,
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

  for (let i = 0; i < KNOCKOUT_STAGES.length - 1; i++) {
    const stage = KNOCKOUT_STAGES[i];
    const opponents: Team[] = [];
    let mostLikelyOpponent: Team | null = null;
    let probability = isFirstPlace ? 80 - i * 15 : 60 - i * 12;

    const otherGroups = groupsInfo.filter((g) => g.group !== teamGroup);

    if (i === 0) {
      if (isFirstPlace) {
        const targetGroups = GROUP_PAIRS_1ST[teamGroup] || [];
        for (const g of targetGroups) {
          const group = groupsInfo.find(
            (gi) => gi.group === g
          );
          if (group && group.teams[1]) {
            const t = getTeamFromEntry(group.teams[1], allTeams);
            if (t) opponents.push(t);
          }
        }
        mostLikelyOpponent =
          opponents.length > 0 ? opponents[0] : null;
      } else {
        const targetGroups = GROUP_PAIRS_2ND[teamGroup] || [];
        for (const g of targetGroups) {
          const group = groupsInfo.find(
            (gi) => gi.group === g
          );
          if (group && group.teams[0]) {
            const t = getTeamFromEntry(group.teams[0], allTeams);
            if (t) opponents.push(t);
          }
        }
        mostLikelyOpponent =
          opponents.length > 0 ? opponents[0] : null;
      }
    } else {
      const allOtherTeams = standings
        .filter((s) => s.team.id !== teamId)
        .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);

      for (const entry of allOtherTeams.slice(0, 4)) {
        const t = getTeamFromEntry(entry, allTeams);
        if (t) opponents.push(t);
      }

      mostLikelyOpponent =
        opponents.length > 0 ? opponents[0] : null;
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

  const finalStage = KNOCKOUT_STAGES[KNOCKOUT_STAGES.length - 1];

  const finalOpponents: Team[] = [];
  const topTeams = standings
    .filter((s) => s.team.id !== teamId)
    .sort(
      (a, b) => b.points - a.points || b.goalDifference - a.goalDifference
    );

  for (const entry of topTeams.slice(0, 3)) {
    const t = getTeamFromEntry(entry, allTeams);
    if (t) finalOpponents.push(t);
  }

  path.push({
    round: finalStage.key,
    roundLabel: finalStage.label,
    opponents: finalOpponents,
    mostLikelyOpponent: finalOpponents[0] || null,
    probability: isFirstPlace ? 10 : 5,
  });

  return {
    path,
    final: {
      opponent: finalOpponents[0] || null,
      probability: isFirstPlace ? 8 : 3,
    },
  };
}
