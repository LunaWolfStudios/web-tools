import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Exercise, Plan, Workout, UserSettings, WorkoutExercise, Set } from '../types';
import { defaultExercises } from '../data/exercises';

interface AppState {
  workouts: Workout[];
  plans: Plan[];
  exercises: Exercise[];
  settings: UserSettings;
  activeWorkout: Workout | null;

  // Actions
  toggleUnit: () => void;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (id: string, workout: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  
  startWorkout: (planId?: string) => void;
  finishWorkout: () => void;
  cancelWorkout: () => void;
  updateActiveWorkout: (workout: Partial<Workout>) => void;
  addExerciseToActiveWorkout: (exerciseId: string) => void;
  removeExerciseFromActiveWorkout: (workoutExerciseId: string) => void;
  addSetToActiveExercise: (workoutExerciseId: string) => void;
  updateSetInActiveExercise: (workoutExerciseId: string, setId: string, updates: Partial<Set>) => void;
  removeSetFromActiveExercise: (workoutExerciseId: string, setId: string) => void;

  addPlan: (plan: Plan) => void;
  updatePlan: (id: string, plan: Partial<Plan>) => void;
  deletePlan: (id: string) => void;
  
  addExercise: (exercise: Exercise) => void;
  updateExercise: (id: string, exercise: Partial<Exercise>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      workouts: [],
      plans: [],
      exercises: defaultExercises,
      settings: { theme: 'dark', animations: true, unit: 'kg' },
      activeWorkout: null,

      toggleUnit: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            unit: state.settings.unit === 'kg' ? 'lbs' : 'kg',
          },
        })),

      addWorkout: (workout) => set((state) => ({ workouts: [workout, ...state.workouts] })),
      updateWorkout: (id, updates) =>
        set((state) => ({
          workouts: state.workouts.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        })),
      deleteWorkout: (id) =>
        set((state) => ({ workouts: state.workouts.filter((w) => w.id !== id) })),

      startWorkout: (planId) => {
        const state = get();
        if (state.activeWorkout) return; // Already active

        let newWorkout: Workout = {
          id: uuidv4(),
          name: 'New Workout',
          startTime: Date.now(),
          exercises: [],
        };

        if (planId) {
          const plan = state.plans.find((p) => p.id === planId);
          if (plan) {
            newWorkout.name = plan.name;
            newWorkout.exercises = plan.exercises.map((pe) => ({
              id: uuidv4(),
              exerciseId: pe.exerciseId,
              sets: Array.from({ length: pe.defaultSets }).map(() => ({
                id: uuidv4(),
                reps: pe.defaultReps,
                completed: false,
              })),
            }));
          }
        }

        set({ activeWorkout: newWorkout });
      },

      finishWorkout: () => {
        const { activeWorkout, addWorkout } = get();
        if (activeWorkout) {
          addWorkout({ ...activeWorkout, endTime: Date.now() });
          set({ activeWorkout: null });
        }
      },

      cancelWorkout: () => set({ activeWorkout: null }),

      updateActiveWorkout: (updates) =>
        set((state) =>
          state.activeWorkout
            ? { activeWorkout: { ...state.activeWorkout, ...updates } }
            : {}
        ),

      addExerciseToActiveWorkout: (exerciseId) =>
        set((state) => {
          if (!state.activeWorkout) return {};
          const newExercise: WorkoutExercise = {
            id: uuidv4(),
            exerciseId,
            sets: [
              { id: uuidv4(), reps: 0, weight: 0, completed: false }
            ],
          };
          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises: [...state.activeWorkout.exercises, newExercise],
            },
          };
        }),

      removeExerciseFromActiveWorkout: (workoutExerciseId) =>
        set((state) => {
          if (!state.activeWorkout) return {};
          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises: state.activeWorkout.exercises.filter(
                (e) => e.id !== workoutExerciseId
              ),
            },
          };
        }),

      addSetToActiveExercise: (workoutExerciseId) =>
        set((state) => {
          if (!state.activeWorkout) return {};
          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises: state.activeWorkout.exercises.map((e) => {
                if (e.id === workoutExerciseId) {
                  const lastSet = e.sets[e.sets.length - 1];
                  return {
                    ...e,
                    sets: [
                      ...e.sets,
                      {
                        id: uuidv4(),
                        reps: lastSet?.reps || 0,
                        weight: lastSet?.weight || 0,
                        completed: false,
                      },
                    ],
                  };
                }
                return e;
              }),
            },
          };
        }),

      updateSetInActiveExercise: (workoutExerciseId, setId, updates) =>
        set((state) => {
          if (!state.activeWorkout) return {};
          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises: state.activeWorkout.exercises.map((e) => {
                if (e.id === workoutExerciseId) {
                  return {
                    ...e,
                    sets: e.sets.map((s) =>
                      s.id === setId ? { ...s, ...updates } : s
                    ),
                  };
                }
                return e;
              }),
            },
          };
        }),

      removeSetFromActiveExercise: (workoutExerciseId, setId) =>
        set((state) => {
          if (!state.activeWorkout) return {};
          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises: state.activeWorkout.exercises.map((e) => {
                if (e.id === workoutExerciseId) {
                  return {
                    ...e,
                    sets: e.sets.filter((s) => s.id !== setId),
                  };
                }
                return e;
              }),
            },
          };
        }),

      addPlan: (plan) => set((state) => ({ plans: [...state.plans, plan] })),
      updatePlan: (id, updates) =>
        set((state) => ({
          plans: state.plans.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      deletePlan: (id) =>
        set((state) => ({ plans: state.plans.filter((p) => p.id !== id) })),

      addExercise: (exercise) =>
        set((state) => ({ exercises: [...state.exercises, exercise] })),
      updateExercise: (id, updates) =>
        set((state) => ({
          exercises: state.exercises.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),
    }),
    {
      name: 'reel-gains-storage',
      storage: createJSONStorage(() => localStorage),
      // Merge initial state with persisted state to ensure new exercises are added
      merge: (persistedState: any, currentState) => {
        return {
          ...currentState,
          ...persistedState,
          exercises: currentState.exercises, // Always use the latest exercises list from code
        };
      },
    }
  )
);
