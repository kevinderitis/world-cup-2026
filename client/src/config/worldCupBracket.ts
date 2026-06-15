export const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export const KNOCKOUT_STAGES = [
  { key: "ROUND_OF_32", label: "Round of 32", teams: 32 },
  { key: "ROUND_OF_16", label: "Round of 16", teams: 16 },
  { key: "QUARTER_FINALS", label: "Quarter-final", teams: 8 },
  { key: "SEMI_FINALS", label: "Semi-final", teams: 4 },
  { key: "FINAL", label: "Final", teams: 2 },
] as const;

export const MATCH_STATUS = {
  SCHEDULED: "SCHEDULED",
  TIMED: "TIMED",
  IN_PLAY: "IN_PLAY",
  PAUSED: "PAUSED",
  FINISHED: "FINISHED",
  POSTPONED: "POSTPONED",
  CANCELLED: "CANCELLED",
} as const;

export const DEFAULT_TEAM_ID = null;

export const WC_LOGO_URL =
  "https://digitalhub.fifa.com/transform/157d23bf-7e13-4d7b-949e-5d27d340987e/WC26_Logo?io=transform:fill&quality=75";

export const STORAGE_KEYS = {
  SELECTED_TEAM: "wcp-selected-team",
  PREFERENCES: "wcp-preferences",
} as const;
