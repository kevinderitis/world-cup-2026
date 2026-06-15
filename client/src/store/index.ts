import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Team } from "../types";
import { STORAGE_KEYS } from "../config/worldCupBracket";

interface AppState {
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team | null) => void;
  clearSelectedTeam: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedTeam: null,
      setSelectedTeam: (team) => set({ selectedTeam: team }),
      clearSelectedTeam: () => set({ selectedTeam: null }),
    }),
    {
      name: STORAGE_KEYS.SELECTED_TEAM,
      partialize: (state) => ({ selectedTeam: state.selectedTeam }),
    }
  )
);
