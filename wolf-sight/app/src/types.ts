export interface RawEntry {
  timestamp: string;
  category: string;
  score: number;
}

export interface RawLeaderboard {
  LocalLeaderboard: {
    Entries: RawEntry[];
  };
}

export interface ProcessedEntry extends RawEntry {
  id: string;
  date: string; // YYYY-MM-DD
  hour: number; // 0-23
  dayOfWeek: string; // Monday, Tuesday, etc.
  timestampMs: number;
}

export interface FilterState {
  dates: string[];
  categories: string[];
  scoreRange: [number, number];
  timeRange: [number, number];
}

export interface AggregatedData {
  totalPlays: number;
  busiestHour: number;
  slowestHour: number;
  highestScoreOverall: number;
  highestScorePerCategory: Record<string, number>;
  averageScore: number;
  playsPerCategory: Record<string, number>;
  playsPerHour: Record<number, number>;
  playsPerDay: Record<string, number>;
}
