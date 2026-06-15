import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/Layout";
import { TeamSelection } from "./pages/TeamSelection";
import { Dashboard } from "./pages/Dashboard";
import { Matches } from "./pages/Matches";
import { Standings } from "./pages/Standings";
import { Rivals } from "./pages/Rivals";
import { Predictions } from "./pages/Predictions";
import { TournamentFixture } from "./pages/TournamentFixture";
import { TeamComparison } from "./pages/TeamComparison";
import { useAppStore } from "./store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 1000 * 60 * 2,
    },
  },
});

function AppRoutes() {
  const { selectedTeam } = useAppStore();

  return (
    <Routes>
      <Route
        path="/"
        element={
          selectedTeam ? <Navigate to="/dashboard" replace /> : <TeamSelection />
        }
      />
      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            selectedTeam ? <Dashboard /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/matches"
          element={
            selectedTeam ? <Matches /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/standings"
          element={
            selectedTeam ? <Standings /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/rivals"
          element={
            selectedTeam ? <Rivals /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/predictions"
          element={
            selectedTeam ? <Predictions /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/fixture"
          element={
            selectedTeam ? <TournamentFixture /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/compare"
          element={
            selectedTeam ? <TeamComparison /> : <Navigate to="/" replace />
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
