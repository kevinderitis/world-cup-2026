import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { usePredictions } from "../hooks/useWorldCup";
import { useAppStore } from "../store";
import { ProbabilityBar } from "../components/ProbabilityBar";
import { PageSkeleton } from "../components/LoadingSkeleton";
import { ErrorPage } from "../components/ErrorPage";
import { EmptyState } from "../components/EmptyState";
import { BarChart3, Info } from "lucide-react";

const COLORS = [
  "#3b82f6", "#22c55e", "#facc15", "#ef4444",
  "#a855f7", "#ec4899", "#14b8a6", "#f97316",
];

export function Predictions() {
  const { selectedTeam } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedTeam) {
      navigate("/", { replace: true });
    }
  }, [selectedTeam, navigate]);

  const { data: predictions, isLoading, error, refetch } = usePredictions();

  if (!selectedTeam) return null;

  if (isLoading) return <PageSkeleton />;

  if (error)
    return (
      <ErrorPage
        message="Could not load predictions."
        onRetry={() => refetch()}
      />
    );

  if (!predictions)
    return <EmptyState title="No predictions available" />;

  const teamPrediction = predictions.find(
    (p) => p.teamId === selectedTeam.id
  );

  const top10 = [...predictions]
    .sort((a, b) => b.winnerChance - a.winnerChance)
    .slice(0, 10);

  const chartData = top10.map((p) => ({
    name: p.teamName.length > 15 ? p.teamName.substring(0, 12) + "..." : p.teamName,
    probability: p.winnerChance,
    crest: p.teamCrest,
  }));

  const stageData = teamPrediction
    ? [
        { name: "Qualify", value: teamPrediction.qualificationChance, color: "green" as const },
        { name: "R32", value: teamPrediction.roundOf32Chance, color: "blue" as const },
        { name: "R16", value: teamPrediction.roundOf16Chance, color: "blue" as const },
        { name: "QF", value: teamPrediction.quarterFinalChance, color: "purple" as const },
        { name: "SF", value: teamPrediction.semiFinalChance, color: "orange" as const },
        { name: "Final", value: teamPrediction.finalChance, color: "gold" as const },
        { name: "Win", value: teamPrediction.winnerChance, color: "red" as const },
      ]
    : [];

  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0">Predictions</h1>
        <BarChart3 className="w-5 h-5 text-purple-400" />
      </div>

      {teamPrediction && (
        <div className="card-premium mb-6">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={selectedTeam.crest}
              alt={selectedTeam.name}
              className="flag-medium"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${selectedTeam.tla}&background=random&color=fff&size=48`;
              }}
            />
            <div>
              <h2 className="text-lg font-bold text-white">{selectedTeam.name}</h2>
              <p className="text-xs text-white/40">
                Rating: {teamPrediction.rating.toFixed(1)} / 100
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {stageData.map((stage) => (
              <ProbabilityBar
                key={stage.name}
                label={stage.name}
                value={stage.value}
                color={stage.color}
              />
            ))}
          </div>
        </div>
      )}

      <div className="card-premium mb-6">
        <h3 className="font-semibold text-white mb-4">
          Top 10 - World Cup Winner Probability
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 5, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="name"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                angle={-35}
                textAnchor="end"
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, "Probability"]}
              />
              <Bar dataKey="probability" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
        <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-300/70 leading-relaxed">
          Probabilities are estimates based on current results, standings and a custom rating model. They are not official odds.
        </p>
      </div>
    </div>
  );
}
