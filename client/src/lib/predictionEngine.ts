import { StandingEntry, Prediction } from "../types";

interface RatingInput {
  points: number;
  goalDifference: number;
  goalsFor: number;
  goalsAgainst: number;
  won: number;
  draw: number;
  lost: number;
  playedGames: number;
  form: string;
}

export function calculateRating(input: RatingInput): number {
  let rating = 50;
  rating += input.points * 3;
  rating += input.goalDifference * 1.5;
  rating += input.goalsFor * 0.8;
  rating += input.won * 5;
  rating += input.draw * 1;
  rating -= input.lost * 4;
  rating -= input.goalsAgainst * 0.5;

  const formPoints = input.form
    .split(",")
    .slice(0, 5)
    .reduce((acc, result) => {
      const r = result.trim();
      if (r === "W") return acc + 3;
      if (r === "D") return acc + 1;
      return acc;
    }, 0);

  rating += formPoints * 2;
  rating = Math.max(rating, 0);
  return rating;
}

export function estimateQualificationChance(
  standing: StandingEntry | null,
  teamsInGroup: number = 4
): number {
  if (!standing) return 25;
  const positionFactor = teamsInGroup + 1 - standing.position;
  const maxPositionFactor = teamsInGroup;
  return Math.round((positionFactor / maxPositionFactor) * 100);
}
