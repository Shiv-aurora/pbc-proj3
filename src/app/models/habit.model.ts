export interface CheckIn {
  date: string; // ISO date string (YYYY-MM-DD)
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  checkIns: CheckIn[];
}

export interface HabitStats {
  habitId: string;
  last7Days: boolean[]; // Array of 7 booleans for the last 7 days
  completionRate: number; // Percentage 0-100
}

