import { Exercise } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const defaultExercises: Exercise[] = [
  // Upper Body - Chest
  { id: 'chest-1', name: 'Bench Press (Barbell)', category: 'upper_body', muscleGroups: ['chest', 'triceps', 'shoulders'], type: 'strength' },
  { id: 'chest-2', name: 'Bench Press (Dumbbell)', category: 'upper_body', muscleGroups: ['chest', 'triceps', 'shoulders'], type: 'strength' },
  { id: 'chest-3', name: 'Incline Bench Press', category: 'upper_body', muscleGroups: ['chest', 'shoulders'], type: 'strength' },
  { id: 'chest-4', name: 'Decline Bench Press', category: 'upper_body', muscleGroups: ['chest', 'triceps'], type: 'strength' },
  { id: 'chest-5', name: 'Push-Ups', category: 'upper_body', muscleGroups: ['chest', 'triceps', 'core'], type: 'bodyweight' },
  { id: 'chest-6', name: 'Chest Fly (Machine)', category: 'upper_body', muscleGroups: ['chest'], type: 'strength' },
  { id: 'chest-7', name: 'Dumbbell Fly', category: 'upper_body', muscleGroups: ['chest'], type: 'strength' },
  { id: 'chest-8', name: 'Cable Fly', category: 'upper_body', muscleGroups: ['chest'], type: 'strength' },
  { id: 'chest-9', name: 'Pec Deck', category: 'upper_body', muscleGroups: ['chest'], type: 'strength' },
  { id: 'chest-10', name: 'Chest Dips', category: 'upper_body', muscleGroups: ['chest', 'triceps'], type: 'bodyweight' },

  // Upper Body - Back
  { id: 'back-1', name: 'Pull-Ups', category: 'upper_body', muscleGroups: ['back', 'biceps'], type: 'bodyweight' },
  { id: 'back-2', name: 'Chin-Ups', category: 'upper_body', muscleGroups: ['back', 'biceps'], type: 'bodyweight' },
  { id: 'back-3', name: 'Lat Pulldown', category: 'upper_body', muscleGroups: ['back', 'biceps'], type: 'strength' },
  { id: 'back-4', name: 'Seated Cable Row', category: 'upper_body', muscleGroups: ['back', 'biceps'], type: 'strength' },
  { id: 'back-5', name: 'Barbell Row', category: 'upper_body', muscleGroups: ['back', 'biceps'], type: 'strength' },
  { id: 'back-6', name: 'Dumbbell Row', category: 'upper_body', muscleGroups: ['back', 'biceps'], type: 'strength' },
  { id: 'back-7', name: 'T-Bar Row', category: 'upper_body', muscleGroups: ['back', 'biceps'], type: 'strength' },
  { id: 'back-8', name: 'Deadlift', category: 'lower_body', muscleGroups: ['back', 'hamstrings', 'glutes', 'legs'], type: 'strength' },
  { id: 'back-9', name: 'Romanian Deadlift', category: 'lower_body', muscleGroups: ['hamstrings', 'glutes', 'back'], type: 'strength' },
  { id: 'back-10', name: 'Face Pulls', category: 'upper_body', muscleGroups: ['shoulders', 'back'], type: 'strength' },
  { id: 'back-11', name: 'Straight Arm Pulldown', category: 'upper_body', muscleGroups: ['back'], type: 'strength' },
  { id: 'back-12', name: 'Inverted Rows', category: 'upper_body', muscleGroups: ['back', 'biceps'], type: 'bodyweight' },

  // Upper Body - Shoulders
  { id: 'sh-1', name: 'Overhead Press (Barbell)', category: 'upper_body', muscleGroups: ['shoulders', 'triceps'], type: 'strength' },
  { id: 'sh-2', name: 'Overhead Press (Dumbbell)', category: 'upper_body', muscleGroups: ['shoulders', 'triceps'], type: 'strength' },
  { id: 'sh-3', name: 'Arnold Press', category: 'upper_body', muscleGroups: ['shoulders', 'triceps'], type: 'strength' },
  { id: 'sh-4', name: 'Lateral Raises', category: 'upper_body', muscleGroups: ['shoulders'], type: 'strength' },
  { id: 'sh-5', name: 'Front Raises', category: 'upper_body', muscleGroups: ['shoulders'], type: 'strength' },
  { id: 'sh-6', name: 'Rear Delt Fly', category: 'upper_body', muscleGroups: ['shoulders', 'back'], type: 'strength' },
  { id: 'sh-7', name: 'Upright Row', category: 'upper_body', muscleGroups: ['shoulders', 'traps'], type: 'strength' },
  { id: 'sh-8', name: 'Shrugs', category: 'upper_body', muscleGroups: ['traps'], type: 'strength' },
  { id: 'sh-9', name: 'Cable Lateral Raise', category: 'upper_body', muscleGroups: ['shoulders'], type: 'strength' },
  { id: 'sh-10', name: 'Machine Shoulder Press', category: 'upper_body', muscleGroups: ['shoulders', 'triceps'], type: 'strength' },

  // Arms - Biceps
  { id: 'bi-1', name: 'Barbell Curl', category: 'upper_body', muscleGroups: ['biceps'], type: 'strength' },
  { id: 'bi-2', name: 'Dumbbell Curl', category: 'upper_body', muscleGroups: ['biceps'], type: 'strength' },
  { id: 'bi-3', name: 'Hammer Curl', category: 'upper_body', muscleGroups: ['biceps', 'forearms'], type: 'strength' },
  { id: 'bi-4', name: 'Preacher Curl', category: 'upper_body', muscleGroups: ['biceps'], type: 'strength' },
  { id: 'bi-5', name: 'Concentration Curl', category: 'upper_body', muscleGroups: ['biceps'], type: 'strength' },
  { id: 'bi-6', name: 'Cable Curl', category: 'upper_body', muscleGroups: ['biceps'], type: 'strength' },
  { id: 'bi-7', name: 'EZ-Bar Curl', category: 'upper_body', muscleGroups: ['biceps'], type: 'strength' },
  { id: 'bi-8', name: 'Resistance Band Curl', category: 'upper_body', muscleGroups: ['biceps'], type: 'strength' },

  // Arms - Triceps
  { id: 'tri-1', name: 'Tricep Pushdown', category: 'upper_body', muscleGroups: ['triceps'], type: 'strength' },
  { id: 'tri-2', name: 'Skull Crushers', category: 'upper_body', muscleGroups: ['triceps'], type: 'strength' },
  { id: 'tri-3', name: 'Close-Grip Bench Press', category: 'upper_body', muscleGroups: ['triceps', 'chest'], type: 'strength' },
  { id: 'tri-4', name: 'Overhead Tricep Extension', category: 'upper_body', muscleGroups: ['triceps'], type: 'strength' },
  { id: 'tri-5', name: 'Dips (Triceps)', category: 'upper_body', muscleGroups: ['triceps'], type: 'bodyweight' },
  { id: 'tri-6', name: 'Kickbacks', category: 'upper_body', muscleGroups: ['triceps'], type: 'strength' },
  { id: 'tri-7', name: 'Cable Overhead Extension', category: 'upper_body', muscleGroups: ['triceps'], type: 'strength' },
  { id: 'tri-8', name: 'Bench Dips', category: 'upper_body', muscleGroups: ['triceps'], type: 'bodyweight' },

  // Lower Body - Quads
  { id: 'quad-1', name: 'Squat (Barbell)', category: 'lower_body', muscleGroups: ['quads', 'glutes', 'core'], type: 'strength' },
  { id: 'quad-2', name: 'Front Squat', category: 'lower_body', muscleGroups: ['quads', 'core'], type: 'strength' },
  { id: 'quad-3', name: 'Goblet Squat', category: 'lower_body', muscleGroups: ['quads', 'glutes'], type: 'strength' },
  { id: 'quad-4', name: 'Leg Press', category: 'lower_body', muscleGroups: ['quads', 'glutes'], type: 'strength' },
  { id: 'quad-5', name: 'Lunges', category: 'lower_body', muscleGroups: ['quads', 'glutes', 'hamstrings'], type: 'bodyweight' },
  { id: 'quad-6', name: 'Walking Lunges', category: 'lower_body', muscleGroups: ['quads', 'glutes'], type: 'bodyweight' },
  { id: 'quad-7', name: 'Step-Ups', category: 'lower_body', muscleGroups: ['quads', 'glutes'], type: 'bodyweight' },
  { id: 'quad-8', name: 'Hack Squat', category: 'lower_body', muscleGroups: ['quads'], type: 'strength' },
  { id: 'quad-9', name: 'Bulgarian Split Squat', category: 'lower_body', muscleGroups: ['quads', 'glutes'], type: 'strength' },
  { id: 'quad-10', name: 'Wall Sit', category: 'lower_body', muscleGroups: ['quads'], type: 'bodyweight' },

  // Lower Body - Hamstrings
  { id: 'ham-1', name: 'Lying Leg Curl', category: 'lower_body', muscleGroups: ['hamstrings'], type: 'strength' },
  { id: 'ham-2', name: 'Seated Leg Curl', category: 'lower_body', muscleGroups: ['hamstrings'], type: 'strength' },
  { id: 'ham-3', name: 'Good Mornings', category: 'lower_body', muscleGroups: ['hamstrings', 'lower_back'], type: 'strength' },
  { id: 'ham-4', name: 'Glute-Ham Raise', category: 'lower_body', muscleGroups: ['hamstrings', 'glutes'], type: 'bodyweight' },
  { id: 'ham-5', name: 'Kettlebell Swing', category: 'lower_body', muscleGroups: ['hamstrings', 'glutes', 'back'], type: 'strength' },
  { id: 'ham-6', name: 'Single-Leg Deadlift', category: 'lower_body', muscleGroups: ['hamstrings', 'glutes'], type: 'strength' },

  // Lower Body - Glutes
  { id: 'glute-1', name: 'Hip Thrust', category: 'lower_body', muscleGroups: ['glutes'], type: 'strength' },
  { id: 'glute-2', name: 'Glute Bridge', category: 'lower_body', muscleGroups: ['glutes'], type: 'bodyweight' },
  { id: 'glute-3', name: 'Cable Kickback', category: 'lower_body', muscleGroups: ['glutes'], type: 'strength' },
  { id: 'glute-4', name: 'Sumo Squat', category: 'lower_body', muscleGroups: ['glutes', 'quads', 'adductors'], type: 'strength' },
  { id: 'glute-5', name: 'Curtsy Lunge', category: 'lower_body', muscleGroups: ['glutes', 'quads'], type: 'bodyweight' },
  { id: 'glute-6', name: 'Frog Pumps', category: 'lower_body', muscleGroups: ['glutes'], type: 'bodyweight' },

  // Lower Body - Calves
  { id: 'calf-1', name: 'Standing Calf Raise', category: 'lower_body', muscleGroups: ['calves'], type: 'strength' },
  { id: 'calf-2', name: 'Seated Calf Raise', category: 'lower_body', muscleGroups: ['calves'], type: 'strength' },
  { id: 'calf-3', name: 'Donkey Calf Raise', category: 'lower_body', muscleGroups: ['calves'], type: 'strength' },
  { id: 'calf-4', name: 'Calf Press (Leg Press)', category: 'lower_body', muscleGroups: ['calves'], type: 'strength' },
  { id: 'calf-5', name: 'Jump Rope', category: 'cardio', muscleGroups: ['calves', 'cardio'], type: 'cardio' },

  // Core - Abs
  { id: 'abs-1', name: 'Plank', category: 'core', muscleGroups: ['abs', 'core'], type: 'bodyweight' },
  { id: 'abs-2', name: 'Side Plank', category: 'core', muscleGroups: ['obliques', 'core'], type: 'bodyweight' },
  { id: 'abs-3', name: 'Crunches', category: 'core', muscleGroups: ['abs'], type: 'bodyweight' },
  { id: 'abs-4', name: 'Sit-Ups', category: 'core', muscleGroups: ['abs'], type: 'bodyweight' },
  { id: 'abs-5', name: 'Leg Raises', category: 'core', muscleGroups: ['abs'], type: 'bodyweight' },
  { id: 'abs-6', name: 'Hanging Leg Raises', category: 'core', muscleGroups: ['abs'], type: 'bodyweight' },
  { id: 'abs-7', name: 'Russian Twists', category: 'core', muscleGroups: ['obliques', 'abs'], type: 'bodyweight' },
  { id: 'abs-8', name: 'Bicycle Crunches', category: 'core', muscleGroups: ['abs', 'obliques'], type: 'bodyweight' },
  { id: 'abs-9', name: 'Mountain Climbers', category: 'core', muscleGroups: ['abs', 'cardio'], type: 'cardio' },
  { id: 'abs-10', name: 'Flutter Kicks', category: 'core', muscleGroups: ['abs'], type: 'bodyweight' },
  { id: 'abs-11', name: 'Toe Touches', category: 'core', muscleGroups: ['abs'], type: 'bodyweight' },
  { id: 'abs-12', name: 'V-Ups', category: 'core', muscleGroups: ['abs'], type: 'bodyweight' },
  { id: 'abs-13', name: 'Dead Bug', category: 'core', muscleGroups: ['abs', 'core'], type: 'bodyweight' },
  { id: 'abs-14', name: 'Hollow Hold', category: 'core', muscleGroups: ['abs', 'core'], type: 'bodyweight' },

  // Core - Obliques
  { id: 'obl-1', name: 'Woodchoppers', category: 'core', muscleGroups: ['obliques'], type: 'strength' },
  { id: 'obl-2', name: 'Side Crunches', category: 'core', muscleGroups: ['obliques'], type: 'bodyweight' },
  { id: 'obl-3', name: 'Windshield Wipers', category: 'core', muscleGroups: ['obliques', 'core'], type: 'bodyweight' },
  { id: 'obl-4', name: 'Standing Oblique Crunch', category: 'core', muscleGroups: ['obliques'], type: 'bodyweight' },
  { id: 'obl-5', name: 'Suitcase Carry', category: 'core', muscleGroups: ['obliques', 'core'], type: 'strength' },

  // Core - Lower Back
  { id: 'lb-1', name: 'Back Extension', category: 'core', muscleGroups: ['lower_back'], type: 'bodyweight' },
  { id: 'lb-2', name: 'Superman Hold', category: 'core', muscleGroups: ['lower_back'], type: 'bodyweight' },
  { id: 'lb-3', name: 'Bird Dog', category: 'core', muscleGroups: ['core', 'lower_back'], type: 'bodyweight' },
  { id: 'lb-4', name: 'Reverse Hyperextension', category: 'core', muscleGroups: ['lower_back', 'glutes'], type: 'strength' },
  { id: 'lb-5', name: 'Stability Ball Rollout', category: 'core', muscleGroups: ['core'], type: 'bodyweight' },
  { id: 'lb-6', name: 'Pallof Press', category: 'core', muscleGroups: ['core', 'obliques'], type: 'strength' },
  { id: 'lb-7', name: 'Farmer’s Carry', category: 'core', muscleGroups: ['core', 'grip', 'traps'], type: 'strength' },

  // Cardio
  { id: 'cardio-1', name: 'Running', category: 'cardio', muscleGroups: ['legs', 'cardio'], type: 'cardio' },
  { id: 'cardio-2', name: 'Treadmill Walk', category: 'cardio', muscleGroups: ['legs', 'cardio'], type: 'cardio' },
  { id: 'cardio-3', name: 'Cycling', category: 'cardio', muscleGroups: ['legs', 'cardio'], type: 'cardio' },
  { id: 'cardio-4', name: 'Stationary Bike', category: 'cardio', muscleGroups: ['legs', 'cardio'], type: 'cardio' },
  { id: 'cardio-5', name: 'Rowing Machine', category: 'cardio', muscleGroups: ['back', 'legs', 'cardio'], type: 'cardio' },
  { id: 'cardio-6', name: 'Elliptical', category: 'cardio', muscleGroups: ['legs', 'cardio'], type: 'cardio' },
  { id: 'cardio-7', name: 'Stair Climber', category: 'cardio', muscleGroups: ['legs', 'cardio'], type: 'cardio' },
  { id: 'cardio-8', name: 'Swimming', category: 'cardio', muscleGroups: ['full_body', 'cardio'], type: 'cardio' },
  { id: 'cardio-9', name: 'HIIT Circuit', category: 'cardio', muscleGroups: ['full_body', 'cardio'], type: 'cardio' },
  { id: 'cardio-10', name: 'Sled Push', category: 'cardio', muscleGroups: ['legs', 'cardio'], type: 'strength' },
  { id: 'cardio-11', name: 'Battle Ropes', category: 'cardio', muscleGroups: ['arms', 'shoulders', 'cardio'], type: 'cardio' },
  { id: 'cardio-12', name: 'Shadow Boxing', category: 'cardio', muscleGroups: ['arms', 'cardio'], type: 'cardio' },
];
