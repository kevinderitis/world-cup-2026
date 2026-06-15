import { Router, Request, Response } from "express";
import axios from "axios";
import { cacheService } from "../services/cache.service";
import {
  generatePredictions,
  normalizeWinnerProbabilities,
} from "../services/prediction.service";
import {
  determinePossibleRivals,
  determineKnockoutPath,
} from "../services/bracket.service";
import {
  ApiMatch,
  ApiStandingsResponse,
  Match,
  StandingEntry,
  GroupStanding,
  Team,
  Competition,
  WorldCupSummary,
  Prediction,
} from "../types";

const router = Router();
const API_BASE = "https://api.football-data.org/v4";
const COMPETITION_CODE = "WC";

function getApiKey(): string {
  const key = process.env.FOOTBALL_DATA_API_KEY;
  if (!key) {
    throw new Error("FOOTBALL_DATA_API_KEY environment variable is not set");
  }
  return key;
}

function normalizeGroup(group: string): string {
  if (!group) return "";
  return group.replace(/^GROUP_/i, "").replace(/^Group\s+/i, "").trim();
}

function normalizeTeam(apiTeam: any, group: string = ""): Team {
  const teamName = apiTeam.name || apiTeam.shortName || `Team ${apiTeam.id}`;
  return {
    id: apiTeam.id,
    name: teamName,
    shortName: apiTeam.shortName || teamName,
    tla: apiTeam.tla || teamName.substring(0, 3).toUpperCase(),
    crest: apiTeam.crest || "",
    group: normalizeGroup(group || apiTeam.group || ""),
  };
}

function normalizeMatch(apiMatch: ApiMatch): Match {
  return {
    id: apiMatch.id,
    utcDate: apiMatch.utcDate,
    status: apiMatch.status,
    stage: apiMatch.stage,
    group: normalizeGroup(apiMatch.group || ""),
    matchday: apiMatch.matchday,
    homeTeam: normalizeTeam(apiMatch.homeTeam),
    awayTeam: normalizeTeam(apiMatch.awayTeam),
    score: {
      home: apiMatch.score?.fullTime?.home ?? null,
      away: apiMatch.score?.fullTime?.away ?? null,
    },
    winner: apiMatch.score?.fullTime?.home !== null && apiMatch.score?.fullTime?.away !== null
      ? apiMatch.score.fullTime.home > apiMatch.score.fullTime.away
        ? "HOME_TEAM"
        : apiMatch.score.fullTime.home < apiMatch.score.fullTime.away
          ? "AWAY_TEAM"
          : "DRAW"
      : null,
  };
}

function normalizeStanding(
  apiStanding: ApiStandingsResponse["standings"][0]
): GroupStanding {
  return {
      group: normalizeGroup(apiStanding.group),
      table: apiStanding.table.map((entry) => ({
        group: normalizeGroup(apiStanding.group),
      position: entry.position,
      team: {
        id: entry.team.id,
        name: entry.team.name,
        shortName: entry.team.shortName,
        tla: entry.team.tla,
        crest: entry.team.crest,
      },
      playedGames: entry.playedGames,
      won: entry.won,
      draw: entry.draw,
      lost: entry.lost,
      goalsFor: entry.goalsFor,
      goalsAgainst: entry.goalsAgainst,
      goalDifference: entry.goalDifference,
      points: entry.points,
      form: entry.form || "",
    })),
  };
}

async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const apiKey = getApiKey();
  const url = `${API_BASE}${endpoint}`;
  const response = await axios.get<T>(url, {
    headers: {
      "X-Auth-Token": apiKey,
    },
  });
  return response.data;
}

async function getCompetition(): Promise<Competition | null> {
  const cacheKey = "competition";
  const cached = cacheService.getCompetition<Competition>(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchFromApi<any>(`/competitions/${COMPETITION_CODE}`);
    const competition: Competition = {
      id: data.id,
      name: data.name,
      code: data.code,
      emblem: data.emblem || "",
      currentSeason: data.currentSeason
        ? {
            startDate: data.currentSeason.startDate,
            endDate: data.currentSeason.endDate,
          }
        : { startDate: "", endDate: "" },
    };
    cacheService.setCompetition(cacheKey, competition);
    return competition;
  } catch (error) {
    console.error("Failed to fetch competition:", error);
    return null;
  }
}

async function getTeams(): Promise<Team[]> {
  const cacheKey = "teams";
  const cached = cacheService.getTeams<Team[]>(cacheKey);
  if (cached && cached.length > 0) return cached;

  try {
    const data = await fetchFromApi<any>(
      `/competitions/${COMPETITION_CODE}/teams`
    );
    const teams: Team[] = (data.teams || []).map((t: any) =>
      normalizeTeam(t, t.currentSeason?.group || "")
    );
    if (teams.length > 0) {
      cacheService.setTeams(cacheKey, teams);
    }
    return teams;
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return cached || [];
  }
}

async function getMatches(): Promise<Match[]> {
  const cacheKey = "matches";
  const cached = cacheService.getMatches<Match[]>(cacheKey);
  if (cached && cached.length > 0) return cached;

  try {
    const data = await fetchFromApi<any>(
      `/competitions/${COMPETITION_CODE}/matches`
    );
    const matches: Match[] = (data.matches || []).map(normalizeMatch);
    if (matches.length > 0) {
      cacheService.setMatches(cacheKey, matches);
    }
    return matches;
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    return cached || [];
  }
}

async function getStandings(): Promise<GroupStanding[]> {
  const cacheKey = "standings";
  const cached = cacheService.getStandings<GroupStanding[]>(cacheKey);
  if (cached && cached.length > 0) return cached;

  try {
    const data = await fetchFromApi<ApiStandingsResponse>(
      `/competitions/${COMPETITION_CODE}/standings`
    );
    const standings: GroupStanding[] = (data.standings || []).map(
      normalizeStanding
    );
    if (standings.length > 0) {
      cacheService.setStandings(cacheKey, standings);
    }
    return standings;
  } catch (error) {
    console.error("Failed to fetch standings:", error);
    return cached || [];
  }
}

router.get("/summary", async (_req: Request, res: Response) => {
  try {
    const [competition, teams, standings, matches] = await Promise.all([
      getCompetition(),
      getTeams(),
      getStandings(),
      getMatches(),
    ]);

    const summary: WorldCupSummary = {
      competition,
      standings,
      teams,
      matches,
    };

    res.json(summary);
  } catch (error: any) {
    console.error("Summary error:", error.message);
    res.status(500).json({
      error: "Failed to fetch World Cup data",
      message: error.message,
    });
  }
});

router.get("/teams", async (_req: Request, res: Response) => {
  try {
    const teams = await getTeams();
    res.json({ teams });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch teams", message: error.message });
  }
});

router.get("/team/:teamId", async (req: Request, res: Response) => {
  try {
    const teamId = parseInt(req.params.teamId, 10);
    const [teams, standings, matches] = await Promise.all([
      getTeams(),
      getStandings(),
      getMatches(),
    ]);

    const team = teams.find((t) => t.id === teamId);
    if (!team) {
      res.status(404).json({ error: "Team not found" });
      return;
    }

    const allStandings = standings.flatMap((s) => s.table);
    const groupStanding = allStandings.find(
      (s) => s.team.id === teamId
    ) || null;

    const teamGroup = team.group || groupStanding?.group || "";

    const teamMatches = matches.filter(
      (m) =>
        (m.homeTeam.id === teamId || m.awayTeam.id === teamId) && m.stage === "GROUP_STAGE"
    );

    const playedMatches = teamMatches.filter(
      (m) => m.status === "FINISHED"
    );
    const upcomingMatches = teamMatches.filter(
      (m) => m.status === "SCHEDULED" || m.status === "TIMED"
    );

    const allStandingsForPredictions = allStandings;
    const predictions = generatePredictions(allStandingsForPredictions, teams);
    const normalizedPredictions = normalizeWinnerProbabilities(predictions);
    const teamPrediction =
      normalizedPredictions.find((p) => p.teamId === teamId) ||
      ({
        teamId,
        teamName: team.name,
        teamCrest: team.crest,
        group: teamGroup,
        rating: 30,
        qualificationChance: 25,
        roundOf32Chance: 20,
        roundOf16Chance: 10,
        quarterFinalChance: 5,
        semiFinalChance: 2,
        finalChance: 1,
        winnerChance: 0.5,
      } as Prediction);

    const possibleRivals = determinePossibleRivals(
      teamId,
      allStandings,
      teams
    );

    const knockoutPath = determineKnockoutPath(
      teamId,
      allStandings,
      teams
    );

    res.json({
      team,
      group: teamGroup,
      standing: groupStanding,
      playedMatches,
      upcomingMatches,
      prediction: teamPrediction,
      possibleRivals,
      knockoutPath,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to fetch team details",
      message: error.message,
    });
  }
});

router.get("/matches", async (req: Request, res: Response) => {
  try {
    const { group, stage, team, status } = req.query;
    let matches = await getMatches();

    if (group) {
      matches = matches.filter((m) => m.group === group);
    }
    if (stage) {
      matches = matches.filter((m) => m.stage === stage);
    }
    if (team) {
      const teamId = parseInt(team as string, 10);
      matches = matches.filter(
        (m) => m.homeTeam.id === teamId || m.awayTeam.id === teamId
      );
    }
    if (status) {
      if (status === "PLAYED") {
        matches = matches.filter((m) => m.status === "FINISHED");
      } else if (status === "UPCOMING") {
        matches = matches.filter(
          (m) => m.status !== "FINISHED"
        );
      } else {
        matches = matches.filter((m) => m.status === status);
      }
    }

    res.json({ matches });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch matches", message: error.message });
  }
});

router.get("/standings", async (_req: Request, res: Response) => {
  try {
    const standings = await getStandings();
    res.json({ standings });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch standings", message: error.message });
  }
});

router.get("/predictions", async (_req: Request, res: Response) => {
  try {
    const [teams, standings] = await Promise.all([
      getTeams(),
      getStandings(),
    ]);

    const allStandings = standings.flatMap((s) => s.table);
    const predictions = generatePredictions(allStandings, teams);
    const normalized = normalizeWinnerProbabilities(predictions);

    res.json({ predictions: normalized });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to generate predictions",
      message: error.message,
    });
  }
});

export default router;
