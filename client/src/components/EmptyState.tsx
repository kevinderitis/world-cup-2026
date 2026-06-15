import { ClipboardList } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "No data available",
  message = "Information will appear here once available.",
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
        {icon || <ClipboardList className="w-8 h-8 text-white/30" />}
      </div>
      <h3 className="text-lg font-semibold text-white/60 mb-1">{title}</h3>
      <p className="text-sm text-white/40 max-w-xs">{message}</p>
    </div>
  );
}
