interface ProbabilityBarProps {
  value: number;
  label: string;
  color?: "blue" | "green" | "gold" | "purple" | "orange" | "red";
  showLabel?: boolean;
}

const colorMap = {
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-emerald-600",
  gold: "from-amber-400 to-amber-500",
  purple: "from-purple-500 to-purple-600",
  orange: "from-orange-500 to-orange-600",
  red: "from-red-500 to-red-600",
};

export function ProbabilityBar({
  value,
  label,
  color = "blue",
  showLabel = true,
}: ProbabilityBarProps) {
  const displayValue = Math.min(value, 100);

  return (
    <div className="space-y-1.5">
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-white/70">{label}</span>
          <span className="text-sm font-semibold text-white">
            {value.toFixed(1)}%
          </span>
        </div>
      )}
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorMap[color]} transition-all duration-1000 ease-out`}
          style={{ width: `${displayValue}%` }}
        />
      </div>
    </div>
  );
}
