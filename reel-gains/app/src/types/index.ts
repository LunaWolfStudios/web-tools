export type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Cardio' | 'Other' | 'Glutes' | 'Quads' | 'Hamstrings' | 'Calves' | 'Abs' | 'Obliques' | 'Lower Back';

export interface Exercise {
  id: string;
  name: string;
  category: string; // e.g., 'upper_body', 'lower_body', 'cardio', 'core'
  muscleGroups: string[]; // e.g., ['chest', 'triceps']
  type?: 'strength' | 'cardio' | 'assisted' | 'bodyweight';
  history?: { date: string; oneRepMax: number }[];
}

export interface Set {
  id: string;
  reps?: number;
  weight?: number;
  time?: number; // in seconds
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  sets: Set[];
  notes?: string;
}

export interface Workout {
  id: string;
  name: string; // e.g., "Leg Day" or "Morning Run"
  startTime: number; // timestamp
  endTime?: number; // timestamp
  exercises: WorkoutExercise[];
  notes?: string;
}

export interface Plan {
  id: string;
  name: string;
  exercises: {
    exerciseId: string;
    defaultSets: number;
    defaultReps?: number;
  }[];
}

export interface UserSettings {
  theme: 'dark' | 'light';
  animations: boolean;
  unit: 'kg' | 'lbs';
}
