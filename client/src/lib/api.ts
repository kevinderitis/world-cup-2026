import axios from "axios";
import {
  WorldCupSummary,
  TeamDetail,
  Match,
  GroupStanding,
  Prediction,
  Team,
} from "../types";

const api = axios.create({
  baseURL: "/api",
});

export async function fetchSummary(): Promise<WorldCupSummary> {
  const { data } = await api.get<WorldCupSummary>("/worldcup/summary");
  return data;
}

export async function fetchTeams(): Promise<Team[]> {
  const { data } = await api.get<{ teams: Team[] }>("/worldcup/teams");
  return data.teams;
}

export async function fetchTeamDetail(teamId: number): Promise<TeamDetail> {
  const { data } = await api.get<TeamDetail>(`/worldcup/team/${teamId}`);
  return data;
}

export async function fetchMatches(params?: {
  group?: string;
  stage?: string;
  team?: number;
  status?: string;
}): Promise<Match[]> {
  const { data } = await api.get<{ matches: Match[] }>("/worldcup/matches", {
    params,
  });
  return data.matches;
}

export async function fetchStandings(): Promise<GroupStanding[]> {
  const { data } = await api.get<{ standings: GroupStanding[] }>(
    "/worldcup/standings"
  );
  return data.standings;
}

export async function fetchPredictions(): Promise<Prediction[]> {
  const { data } = await api.get<{ predictions: Prediction[] }>(
    "/worldcup/predictions"
  );
  return data.predictions;
}
