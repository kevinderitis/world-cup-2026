import { useQuery } from "@tanstack/react-query";
import {
  fetchSummary,
  fetchTeamDetail,
  fetchMatches,
  fetchStandings,
  fetchPredictions,
  fetchTeams,
} from "../lib/api";

export function useWorldCupSummary() {
  return useQuery({
    queryKey: ["worldcup", "summary"],
    queryFn: fetchSummary,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useTeams() {
  return useQuery({
    queryKey: ["worldcup", "teams"],
    queryFn: fetchTeams,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useTeamDetail(teamId: number | null) {
  return useQuery({
    queryKey: ["worldcup", "team", teamId],
    queryFn: () => fetchTeamDetail(teamId!),
    enabled: !!teamId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useMatches(params?: {
  group?: string;
  stage?: string;
  team?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: ["worldcup", "matches", params],
    queryFn: () => fetchMatches(params),
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });
}

export function useStandings() {
  return useQuery({
    queryKey: ["worldcup", "standings"],
    queryFn: fetchStandings,
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });
}

export function usePredictions() {
  return useQuery({
    queryKey: ["worldcup", "predictions"],
    queryFn: fetchPredictions,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}
