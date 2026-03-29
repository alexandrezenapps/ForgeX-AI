export type Goal = 'Strength' | 'Hypertrophy' | 'Endurance' | 'Fat Loss';

export type Language = 'en' | 'fr' | 'zh';

export interface UserProfile {
  id?: string;
  email?: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: Goal;
  level: number;
  xp: number;
  energy: number;
  streak: number;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Elite';
  primaryColor?: string;
  secondaryColor?: string;
  language?: Language;
  exerciseVideoOverrides?: Record<string, string>;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  tier: string;
  isCurrentUser?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  equipment: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  cues: string[];
  videoUrl?: string;
  defaultRestTime?: number; // in seconds
}

export interface WorkoutSession {
  id: string;
  name: string;
  date: string;
  duration: number; // in minutes
  calories: number;
  exercises: {
    exerciseId: string;
    restTime?: number; // in seconds
    sets: {
      reps: number;
      weight: number;
      completed: boolean;
      notes?: string;
    }[];
  }[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: {
    exerciseId: string;
    restTime?: number; // in seconds
    sets: {
      reps: number;
      weight: number;
    }[];
  }[];
}
