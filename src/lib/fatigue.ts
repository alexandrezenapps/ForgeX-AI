import { MuscleGroup, UserProfile } from '../types';

const RECOVERY_RATE_PER_HOUR = 2; // 2% recovery per hour
const FATIGUE_PER_SET = 5; // 5% fatigue per set

export function calculateCurrentFatigue(user: UserProfile): Record<MuscleGroup, number> {
  const now = new Date();
  const lastUpdate = user.lastFatigueUpdate ? new Date(user.lastFatigueUpdate) : now;
  const hoursPassed = Math.max(0, (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60));
  
  const currentFatigue = { ...(user.muscleFatigue || {
    Chest: 0,
    Back: 0,
    Legs: 0,
    Shoulders: 0,
    Arms: 0,
    Core: 0
  }) } as Record<MuscleGroup, number>;

  // Apply recovery
  const recoveryAmount = hoursPassed * RECOVERY_RATE_PER_HOUR;
  (Object.keys(currentFatigue) as MuscleGroup[]).forEach(muscle => {
    currentFatigue[muscle] = Math.max(0, currentFatigue[muscle] - recoveryAmount);
  });

  return currentFatigue;
}

export function updateFatigueAfterWorkout(
  user: UserProfile, 
  musclesWorked: Record<string, number> // muscle group -> number of sets
): UserProfile {
  const currentFatigue = calculateCurrentFatigue(user);
  
  (Object.entries(musclesWorked) as [MuscleGroup, number][]).forEach(([muscle, sets]) => {
    if (currentFatigue[muscle] !== undefined) {
      currentFatigue[muscle] = Math.min(100, currentFatigue[muscle] + (sets * FATIGUE_PER_SET));
    }
  });

  return {
    ...user,
    muscleFatigue: currentFatigue,
    lastFatigueUpdate: new Date().toISOString()
  };
}
