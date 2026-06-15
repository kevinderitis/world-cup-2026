export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  group: string;
}

export interface MatchScore {
  home: number | null;
  away: number | null;
}

export interface Match {
  id: number;
  utcDate: string;
  status: string;
  stage: string;
  group: string;
  matchday: number;
  homeTeam: Team;
  awayTeam: Team;
  score: MatchScore;
  winner: string | null;
}

export interface StandingTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface StandingEntry {
  group: string;
  position: number;
  team: StandingTeam;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string;
}

export interface GroupStanding {
  group: string;
  table: StandingEntry[];
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  emblem: string;
  currentSeason: {
    startDate: string;
    endDate: string;
  };
}

export interface Prediction {
  teamId: number;
  teamName: string;
  teamCrest: string;
  group: string;
  rating: number;
  qualificationChance: number;
  roundOf32Chance: number;
  roundOf16Chance: number;
  quarterFinalChance: number;
  semiFinalChance: number;
  finalChance: number;
  winnerChance: number;
}

export interface WorldCupSummary {
  competition: Competition | null;
  standings: GroupStanding[];
  teams: Team[];
  matches: Match[];
}

export interface TeamDetail {
  team: Team;
  group: string;
  standing: StandingEntry | null;
  playedMatches: Match[];
  upcomingMatches: Match[];
  prediction: Prediction;
  possibleRivals: PossibleRivals;
  knockoutPath: KnockoutPath;
}

export interface PossibleRivals {
  firstPlace: {
    possible: Team[];
    mostLikely: Team[];
  };
  secondPlace: {
    possible: Team[];
    mostLikely: Team[];
  };
}

export interface KnockoutRound {
  round: string;
  roundLabel: string;
  opponents: Team[];
  mostLikelyOpponent: Team | null;
  probability: number;
}

export interface KnockoutPath {
  path: KnockoutRound[];
  final: {
    opponent: Team | null;
    probability: number;
  };
}

export interface TeamComparison {
  team1: {
    team: Team;
    standing: StandingEntry | null;
    stats: TeamStats;
  };
  team2: {
    team: Team;
    standing: StandingEntry | null;
    stats: TeamStats;
  };
  headToHead: {
    team1WinProbability: number;
    team2WinProbability: number;
    drawProbability: number;
  };
}

export interface TeamStats {
  goalsScored: number;
  goalsConceded: number;
  points: number;
  goalDifference: number;
  wins: number;
  draws: number;
  losses: number;
  form: string;
  nextMatch: Match | null;
}

export interface ApiMatch {
  id: number;
  utcDate: string;
  status: string;
  stage: string;
  group: string;
  matchday: number;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
    halfTime: {
      home: number | null;
      away: number | null;
    };
  };
}

export interface ApiStandingsResponse {
  standings: Array<{
    group: string;
    stage: string;
    type: string;
    table: Array<{
      position: number;
      team: {
        id: number;
        name: string;
        shortName: string;
        tla: string;
        crest: string;
      };
      playedGames: number;
      form: string;
      won: number;
      draw: number;
      lost: number;
      points: number;
      goalsFor: number;
      goalsAgainst: number;
      goalDifference: number;
    }>;
  }>;
}
