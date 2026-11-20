export type FocusGuardCategoryId =
  | "safe_local_test"
  | "late_night_video"
  | "adult_search_terms";

export type InterventionMode = "supportive_pause" | "breathing_first";

export type FocusSchedule = {
  enabled: boolean;
  startHour: number; // 0..23
  endHour: number; // 0..23
};

export type FocusGuardStats = {
  lastDate: string; // YYYY-MM-DD local date
  interventionsToday: number;
  pausesCompleted: number;
  recoveryActionsChosen: number;
};

export type FocusGuardConfig = {
  version: 1;
  enabled: boolean;
  pauseUntil: number | null; // epoch ms or null
  blockedDomains: string[];
  blockedKeywords: string[];
  allowlistDomains: string[];
  enabledCategories: FocusGuardCategoryId[];
  schedule: FocusSchedule;
  personalGoal: string;
  interventionMode: InterventionMode;
  updatedAt: string;
};

export type FocusGuardStateSnapshot = {
  config: FocusGuardConfig;
  stats: FocusGuardStats;
  activeRuleCount: number;
  isEffectivelyActive: boolean;
  inactiveReason:
    | "none"
    | "disabled"
    | "paused"
    | "outside_schedule"
    | "no_rules"
    | "missing_host_permission";
  hasHostPermission: boolean;
  extensionVersion: string;
  browserTarget: "chromium" | "firefox" | "unknown";
};
