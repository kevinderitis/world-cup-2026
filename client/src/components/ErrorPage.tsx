import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorPageProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorPage({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-red-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
      <p className="text-white/50 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </div>
  );
}
