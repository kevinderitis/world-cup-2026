import { StandingEntry, Prediction, Team } from "../types";

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

function calculateRating(input: RatingInput): number {
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

function calculateStageProbability(
  rating: number,
  totalRating: number,
  stageFactor: number
): number {
  if (totalRating === 0) return 0;
  const baseProb = (rating / totalRating) * 100;
  return Math.round(baseProb * stageFactor * 100) / 100;
}

export function generatePredictions(
  standings: StandingEntry[],
  teams: Team[]
): Prediction[] {
  const standingsMap = new Map<number, StandingEntry>();
  for (const s of standings) {
    standingsMap.set(s.team.id, s);
  }

  const ratings: { teamId: number; rating: number }[] = [];

  for (const team of teams) {
    const standing = standingsMap.get(team.id);
    if (standing) {
      const rating = calculateRating({
        points: standing.points,
        goalDifference: standing.goalDifference,
        goalsFor: standing.goalsFor,
        goalsAgainst: standing.goalsAgainst,
        won: standing.won,
        draw: standing.draw,
        lost: standing.lost,
        playedGames: standing.playedGames,
        form: standing.form,
      });
      ratings.push({ teamId: team.id, rating });
    } else {
      ratings.push({ teamId: team.id, rating: 30 });
    }
  }

  const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);

  return teams.map((team) => {
    const teamRating = ratings.find((r) => r.teamId === team.id)?.rating || 30;

    const eliminationGroups = 8;
    const teamsPerGroup = 4;
    const totalTeams = 32;
    const qualifyForKO = 16;

    const standingsSize = standings.length;
    let qualificationChance = 50;

    const standing = standingsMap.get(team.id);
    if (standing) {
      const teamsInGroup = Math.floor(standingsSize / eliminationGroups);
      if (teamsInGroup > 0) {
        const positionFactor = teamsInGroup + 1 - standing.position;
        const maxPositionFactor = teamsInGroup;
        qualificationChance = (positionFactor / maxPositionFactor) * 100;
      }
    } else {
      qualificationChance = 25;
    }

    qualificationChance = Math.round(qualificationChance * 10) / 10;

    const winnerRating = calculateStageProbability(
      teamRating,
      totalRating,
      1
    );

    const baseProb = (teamRating / totalRating) * 100;

    const stageFactors = {
      roundOf32: 0.95,
      roundOf16: 0.65,
      quarterFinal: 0.40,
      semiFinal: 0.22,
      final: 0.12,
      winner: 0.06,
    };

    const roundOf32 = Math.round(Math.min(baseProb * stageFactors.roundOf32, 99.9) * 10) / 10;
    const roundOf16 = Math.round(Math.min(roundOf32 * (qualificationChance / 100) * stageFactors.roundOf16, 99.9) * 10) / 10;
    const quarterFinal = Math.round(Math.min(roundOf16 * stageFactors.quarterFinal, 99.9) * 10) / 10;
    const semiFinal = Math.round(Math.min(quarterFinal * stageFactors.semiFinal, 99.9) * 10) / 10;
    const final = Math.round(Math.min(semiFinal * stageFactors.final, 99.9) * 10) / 10;
    const winner = Math.round(Math.min(final * stageFactors.winner, 99.9) * 10) / 10;

    return {
      teamId: team.id,
      teamName: team.name,
      teamCrest: team.crest,
      group: team.group,
      rating: Math.round(teamRating * 10) / 10,
      qualificationChance,
      roundOf32Chance: roundOf32,
      roundOf16Chance: roundOf16,
      quarterFinalChance: quarterFinal,
      semiFinalChance: semiFinal,
      finalChance: final,
      winnerChance: winner,
    };
  });
}

export function normalizeWinnerProbabilities(
  predictions: Prediction[]
): Prediction[] {
  const totalWinnerChance = predictions.reduce(
    (sum, p) => sum + p.winnerChance,
    0
  );

  if (totalWinnerChance === 0 || totalWinnerChance >= 99.9) {
    return predictions;
  }

  const adjustmentFactor = 100 / totalWinnerChance;

  return predictions.map((p) => ({
    ...p,
    winnerChance: Math.round(p.winnerChance * adjustmentFactor * 10) / 10,
  }));
}
