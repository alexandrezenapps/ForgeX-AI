import * as React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { DEFAULT_TEMPLATES, EXERCISES } from '../constants';
import { Check, X, Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Info, HelpCircle, Filter, Plus, Trophy, Flame, MessageSquare, Dumbbell, Hash, Save, FolderOpen, Trash2, Video, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Exercise, WorkoutTemplate, MuscleGroup } from '../types';
import { updateFatigueAfterWorkout } from '../lib/fatigue';
import { useI18n } from '../i18n';

interface WorkoutScreenProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

export const WorkoutScreen: React.FC<WorkoutScreenProps> = ({ user, onUpdateUser }) => {
  const t = useI18n(user.language || 'en');
  const [difficultyFilter, setDifficultyFilter] = React.useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [activeExerciseIndex, setActiveExerciseIndex] = React.useState(0);
  const [timer, setTimer] = React.useState(0);
  const [isActive, setIsActive] = React.useState(false);
  const [currentSet, setCurrentSet] = React.useState(1);
  const [completedSets, setCompletedSets] = React.useState<number[]>([]);
  const [customExercises, setCustomExercises] = React.useState<Exercise[]>(() => {
    const saved = localStorage.getItem('custom_exercises');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newExercise, setNewExercise] = React.useState<Partial<Exercise>>({
    name: '',
    category: 'Custom',
    difficulty: 'Beginner',
    description: '',
    cues: [],
    videoUrl: '',
  });
  const [isFinished, setIsFinished] = React.useState(false);
  const [earnedPoints, setEarnedPoints] = React.useState(0);
  const [earnedXP, setEarnedXP] = React.useState(0);
  const [currentReps, setCurrentReps] = React.useState('10');
  const [currentWeight, setCurrentWeight] = React.useState('60');
  const [currentNotes, setCurrentNotes] = React.useState('');
  const [workoutData, setWorkoutData] = React.useState<Record<string, Record<number, { reps: number, weight: number, notes: string }>>>({});
  const [templates, setTemplates] = React.useState<WorkoutTemplate[]>(() => {
    const saved = localStorage.getItem('workout_templates');
    const custom = saved ? JSON.parse(saved) : [];
    return [...DEFAULT_TEMPLATES, ...custom];
  });
  const [isTemplateModalOpen, setIsTemplateModalOpen] = React.useState(false);
  const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = React.useState(false);
  const [templateName, setTemplateName] = React.useState('');
  const [restTimer, setRestTimer] = React.useState(0);
  const [isResting, setIsResting] = React.useState(false);
  const [customRestTime, setCustomRestTime] = React.useState<Record<string, number>>({});
  const [currentSessionTemplate, setCurrentSessionTemplate] = React.useState<WorkoutTemplate | null>(null);

  const allExercises = React.useMemo(() => [...EXERCISES, ...customExercises], [customExercises]);
  
  const currentProfile = React.useMemo(() => {
    return user.equipmentProfiles?.find(p => p.id === user.currentProfileId);
  }, [user.equipmentProfiles, user.currentProfileId]);

  const filteredExercises = React.useMemo(() => {
    let list = allExercises;
    
    // Filter by difficulty
    if (difficultyFilter !== 'All') {
      list = list.filter(ex => ex.difficulty === difficultyFilter);
    }

    // Filter by equipment profile
    if (currentProfile) {
      list = list.filter(ex => {
        // If exercise has no equipment requirements or is bodyweight, it's always available
        if (!ex.equipment || ex.equipment.length === 0 || ex.equipment.includes('Bodyweight')) return true;
        // Check if all required equipment for the exercise is in the profile
        return ex.equipment.every(eq => currentProfile.equipment.includes(eq));
      });
    }

    return list;
  }, [difficultyFilter, allExercises, currentProfile]);

  const activeExercise = React.useMemo(() => {
    const base = filteredExercises[activeExerciseIndex];
    if (!base) return null;
    const override = user.exerciseVideoOverrides?.[base.id];
    if (override) {
      return { ...base, videoUrl: override };
    }
    return base;
  }, [filteredExercises, activeExerciseIndex, user.exerciseVideoOverrides]);

  const handleUpdateVideoUrl = (url: string) => {
    if (!activeExercise) return;
    const embedUrl = getYouTubeEmbedUrl(url);
    const updatedOverrides = {
      ...(user.exerciseVideoOverrides || {}),
      [activeExercise.id]: embedUrl
    };
    onUpdateUser({
      ...user,
      exerciseVideoOverrides: updatedOverrides
    });
  };

  const handleAddExercise = () => {
    if (!newExercise.name) return;
    const exercise: Exercise = {
      ...newExercise as Exercise,
      id: `custom_${Date.now()}`,
      cues: newExercise.cues?.length ? newExercise.cues : ['Perform the exercise with proper form.'],
      videoUrl: newExercise.videoUrl ? getYouTubeEmbedUrl(newExercise.videoUrl) : undefined,
    };
    const updated = [...customExercises, exercise];
    setCustomExercises(updated);
    localStorage.setItem('custom_exercises', JSON.stringify(updated));
    setIsModalOpen(false);
    setNewExercise({
      name: '',
      category: 'Custom',
      difficulty: 'Beginner',
      description: '',
      cues: [],
      videoUrl: '',
    });
  };

  // Reset index when filter changes
  React.useEffect(() => {
    setActiveExerciseIndex(0);
    setCurrentSet(1);
    setCompletedSets([]);
    setWorkoutData({});
  }, [difficultyFilter]);

  // Sync inputs with current set data
  React.useEffect(() => {
    if (activeExercise) {
      const data = workoutData[activeExercise.id]?.[currentSet];
      if (data) {
        setCurrentReps(data.reps.toString());
        setCurrentWeight(data.weight.toString());
        setCurrentNotes(data.notes);
      } else {
        setCurrentNotes('');
      }
    }
  }, [currentSet, activeExercise?.id]);

  React.useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  // Rest Timer Effect
  React.useEffect(() => {
    let interval: any = null;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => prev - 1);
      }, 1000);
    } else if (restTimer === 0 && isResting) {
      setIsResting(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const handleCompleteSet = () => {
    if (activeExercise) {
      const setData = {
        reps: parseInt(currentReps) || 0,
        weight: parseFloat(currentWeight) || 0,
        notes: currentNotes
      };

      setWorkoutData(prev => ({
        ...prev,
        [activeExercise.id]: {
          ...(prev[activeExercise.id] || {}),
          [currentSet]: setData
        }
      }));

      if (!completedSets.includes(currentSet)) {
        setCompletedSets([...completedSets, currentSet]);
        
        // Check for superset
        const templateExercise = currentSessionTemplate?.exercises.find(ex => ex.exerciseId === activeExercise.id);
        const supersetWithId = templateExercise?.supersetWith;

        if (supersetWithId) {
          // Move to next exercise in superset immediately
          const nextIdx = filteredExercises.findIndex(ex => ex.id === supersetWithId);
          if (nextIdx !== -1) {
            setActiveExerciseIndex(nextIdx);
            // We stay on the same set number for the superset partner
            return;
          }
        }

        // If we just finished the second part of a superset, or it's a normal exercise
        const isPartOfSuperset = currentSessionTemplate?.exercises.some(ex => ex.supersetWith === activeExercise.id);
        
        // Start rest timer
        const restTime = customRestTime[activeExercise.id] ?? activeExercise.defaultRestTime ?? 60;
        if (restTime > 0) {
          setRestTimer(restTime);
          setIsResting(true);
        }

        if (isPartOfSuperset) {
          // Move back to the first exercise of the superset for the next set
          const firstEx = currentSessionTemplate?.exercises.find(ex => ex.supersetWith === activeExercise.id);
          if (firstEx) {
            const firstIdx = filteredExercises.findIndex(ex => ex.id === firstEx.exerciseId);
            if (firstIdx !== -1) {
              setActiveExerciseIndex(firstIdx);
            }
          }
        }

        if (currentSet < 4) {
          setCurrentSet(currentSet + 1);
        }
      }
    }
  };

  const handleFinishWorkout = () => {
    const points = 500 + (completedSets.length * 50);
    const xp = 100 + (completedSets.length * 10);
    setEarnedPoints(points);
    setEarnedXP(xp);
    setIsFinished(true);
    setIsActive(false);

    // Calculate muscles worked
    const musclesWorked: Record<string, number> = {};
    Object.keys(workoutData).forEach(exerciseId => {
      const exercise = EXERCISES.find(ex => ex.id === exerciseId);
      if (exercise) {
        const setsCount = Object.keys(workoutData[exerciseId]).length;
        const muscle = exercise.category as MuscleGroup;
        musclesWorked[muscle] = (musclesWorked[muscle] || 0) + setsCount;
      }
    });

    // Update challenges
    const updatedChallenges = user.challenges?.map(challenge => {
      if (challenge.type === 'workouts' && !challenge.completed) {
        const newCurrent = challenge.current + 1;
        return {
          ...challenge,
          current: newCurrent,
          completed: newCurrent >= challenge.target
        };
      }
      return challenge;
    });

    const updatedUser: UserProfile = {
      ...user,
      points: user.points + points,
      xp: user.xp + xp,
      streak: user.streak + 1, // Simple streak increment for demo
      challenges: updatedChallenges
    };

    // Check for level up
    if (updatedUser.xp >= 1000) {
      updatedUser.level += 1;
      updatedUser.xp -= 1000;
    }

    // Check for tier up
    const tiers: UserProfile['tier'][] = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Elite'];
    const currentTierIndex = tiers.indexOf(user.tier);
    if (updatedUser.points >= (currentTierIndex + 1) * 5000 && currentTierIndex < tiers.length - 1) {
      updatedUser.tier = tiers[currentTierIndex + 1];
    }

    const finalUser = updateFatigueAfterWorkout(updatedUser, musclesWorked);

    onUpdateUser(finalUser);
  };

  const nextExercise = () => {
    if (activeExerciseIndex < filteredExercises.length - 1) {
      setActiveExerciseIndex(activeExerciseIndex + 1);
      setCurrentSet(1);
      setCompletedSets([]);
    }
  };

  const prevExercise = () => {
    if (activeExerciseIndex > 0) {
      setActiveExerciseIndex(activeExerciseIndex - 1);
      setCurrentSet(1);
      setCompletedSets([]);
    }
  };

  const handleSaveTemplate = () => {
    if (!templateName) return;
    const newTemplate: WorkoutTemplate = {
      id: `template_${Date.now()}`,
      name: templateName,
      exercises: Object.entries(workoutData).map(([exerciseId, setsData]) => ({
        exerciseId,
        sets: Object.values(setsData).map(s => ({ reps: s.reps, weight: s.weight }))
      }))
    };
    const updated = [...templates, newTemplate];
    setTemplates(updated);
    localStorage.setItem('workout_templates', JSON.stringify(updated));
    setIsSaveTemplateModalOpen(false);
    setTemplateName('');
  };

  const handleLoadTemplate = (template: WorkoutTemplate) => {
    const newWorkoutData: Record<string, Record<number, { reps: number, weight: number, notes: string }>> = {};
    template.exercises.forEach(ex => {
      newWorkoutData[ex.exerciseId] = {};
      ex.sets.forEach((s, idx) => {
        newWorkoutData[ex.exerciseId][idx + 1] = { ...s, notes: '' };
      });
    });
    setWorkoutData(newWorkoutData);
    setCurrentSessionTemplate(template);
    
    // Find index of first exercise in filtered list
    const firstExId = template.exercises[0].exerciseId;
    const firstIdx = filteredExercises.findIndex(ex => ex.id === firstExId);
    if (firstIdx !== -1) {
      setActiveExerciseIndex(firstIdx);
    }
    
    setCurrentSet(1);
    setCompletedSets([]);
    setIsTemplateModalOpen(false);
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    localStorage.setItem('workout_templates', JSON.stringify(updated));
  };

  return (
    <div className="p-6 space-y-6 pb-32">
      {/* Timer Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex items-center justify-between p-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">{t.sessionTimer}</span>
            <h2 className="text-4xl font-black font-mono tracking-tighter">{formatTime(timer)}</h2>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 px-3 text-[10px] font-bold uppercase tracking-widest"
                onClick={() => setIsSaveTemplateModalOpen(true)}
                disabled={Object.keys(workoutData).length === 0}
              >
                <Save className="w-3 h-3 mr-1" />
                {t.save}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 px-3 text-[10px] font-bold uppercase tracking-widest"
                onClick={() => setIsTemplateModalOpen(true)}
              >
                <FolderOpen className="w-3 h-3 mr-1" />
                {t.load}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-12 px-4 text-[10px] font-bold uppercase tracking-widest"
                onClick={handleFinishWorkout}
              >
                {t.finish}
              </Button>
              <Button 
                variant="neon" 
                size="icon" 
                className="w-12 h-12 rounded-full"
                onClick={() => setIsActive(!isActive)}
              >
                {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
              </Button>
            </div>
          </div>
        </Card>

        <AnimatePresence>
          {isResting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative overflow-hidden"
            >
              <Card className="flex items-center justify-between p-6 border-accent neon-glow relative z-10">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-accent">{t.restTimer}</span>
                  <h2 className="text-4xl font-black font-mono tracking-tighter text-accent">{formatTime(restTimer)}</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-12 px-4 text-[10px] font-bold uppercase tracking-widest text-accent hover:bg-accent/10"
                  onClick={() => setIsResting(false)}
                >
                  {t.skipRest}
                </Button>
              </Card>
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-accent/30 z-20"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: restTimer, ease: 'linear' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Difficulty Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-3 h-3 text-white/40" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">{t.difficulty}</span>
            </div>
            {currentProfile && (
              <div className="flex items-center gap-2 px-2 py-0.5 bg-accent/10 rounded-full border border-accent/20">
                <Dumbbell className="w-3 h-3 text-accent" />
                <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-accent">{currentProfile.name}</span>
              </div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-3 text-[10px] font-bold uppercase tracking-widest"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-3 h-3 mr-1" />
            {t.addExercise}
          </Button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={cn(
                'px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border shrink-0',
                difficultyFilter === diff 
                  ? 'bg-accent text-bg border-accent neon-glow' 
                  : 'bg-white/5 border-white/5 text-white/40 hover:text-white/60'
              )}
            >
              {diff === 'All' ? t.all : diff === 'Beginner' ? t.beginner : diff === 'Intermediate' ? t.intermediate : t.advanced}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Display */}
      <AnimatePresence mode="wait">
        {activeExercise ? (
          <motion.div
            key={activeExercise.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card className="p-0 overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-accent/20 to-accent-secondary/20 relative flex items-center justify-center">
                {activeExercise.videoUrl ? (
                  <iframe
                    src={activeExercise.videoUrl}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-2 py-1 rounded bg-accent text-bg text-[10px] font-bold uppercase tracking-widest">
                        {activeExercise.category}
                      </span>
                      <span className="px-2 py-1 rounded bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest">
                        {activeExercise.difficulty}
                      </span>
                    </div>
                    <DumbbellLarge className="w-24 h-24 text-accent/40" />
                  </>
                )}
              </div>
              <div className="p-6 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black uppercase tracking-tight">{activeExercise.name}</h3>
                    {currentSessionTemplate?.exercises.find(ex => ex.exerciseId === activeExercise.id)?.supersetWith && (
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-accent-secondary text-white text-[8px] font-bold uppercase tracking-widest border border-accent-secondary/20 flex items-center gap-1">
                          <Zap className="w-2 h-2" />
                          {t.superset}
                        </span>
                        <span className="text-[8px] font-mono uppercase tracking-widest text-white/40">
                          {t.nextExerciseInSuperset}: {EXERCISES.find(ex => ex.id === currentSessionTemplate?.exercises.find(e => e.exerciseId === activeExercise.id)?.supersetWith)?.name}
                        </span>
                      </div>
                    )}
                    {currentSessionTemplate?.exercises.some(ex => ex.supersetWith === activeExercise.id) && (
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-accent-secondary text-white text-[8px] font-bold uppercase tracking-widest border border-accent-secondary/20 flex items-center gap-1">
                          <Zap className="w-2 h-2" />
                          {t.superset} (Part 2)
                        </span>
                      </div>
                    )}
                  </div>
                  {activeExercise.videoUrl && (
                    <span className="px-2 py-1 rounded bg-accent/10 text-accent text-[8px] font-bold uppercase tracking-widest border border-accent/20">
                      {t.videoDemo}
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/60">{activeExercise.description}</p>
                
                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2">
                      <Video className="w-3 h-3" />
                      {t.videoUrl}
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        value={activeExercise.videoUrl || ''}
                        onChange={(e) => handleUpdateVideoUrl(e.target.value)}
                        placeholder="Paste YouTube URL..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] focus:outline-none focus:border-accent transition-colors font-mono"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                        <Sparkles className="w-3 h-3 text-accent animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2">
                      <RotateCcw className="w-3 h-3" />
                      {t.restTime} ({t.seconds})
                    </label>
                    <input
                      type="number"
                      value={customRestTime[activeExercise.id] ?? activeExercise.defaultRestTime ?? 60}
                      onChange={(e) => setCustomRestTime(prev => ({ ...prev, [activeExercise.id]: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] focus:outline-none focus:border-accent transition-colors font-mono"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Sets Tracking */}
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((set) => (
                <button
                  key={set}
                  onClick={() => setCurrentSet(set)}
                  className={cn(
                    'h-16 rounded-xl flex flex-col items-center justify-center transition-all border relative',
                    currentSet === set ? 'border-accent bg-accent/10' : 'border-white/5 bg-white/5',
                    completedSets.includes(set) && 'bg-accent text-bg border-accent'
                  )}
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">{t.set}</span>
                  <span className="text-lg font-bold">{set}</span>
                  {completedSets.includes(set) && <Check className="w-3 h-3 absolute top-1 right-1" />}
                </button>
              ))}
            </div>

            {/* Technique Guide */}
            <Card className="p-4 bg-accent/5 border-accent/10">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-accent" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent">{t.techniqueGuide}</h4>
              </div>
              <ul className="space-y-2">
                {activeExercise.cues.map((cue, i) => (
                  <li key={i} className="flex gap-3 text-xs text-white/70">
                    <span className="text-accent font-mono">{i + 1}.</span>
                    {cue}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Set Details Input */}
            <Card className="p-4 space-y-4 bg-white/5 border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <RotateCcw className="w-4 h-4 text-accent" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent">{t.set} {currentSet} Details</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40">
                    <Dumbbell className="w-3 h-3" /> {t.exerciseWeight} (kg)
                  </label>
                  <input
                    type="number"
                    value={currentWeight}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCurrentWeight(val);
                      if (activeExercise) {
                        setWorkoutData(prev => ({
                          ...prev,
                          [activeExercise.id]: {
                            ...(prev[activeExercise.id] || {}),
                            [currentSet]: {
                              reps: parseInt(currentReps) || 0,
                              weight: parseFloat(val) || 0,
                              notes: currentNotes
                            }
                          }
                        }));
                      }
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40">
                    <Hash className="w-3 h-3" /> {t.reps}
                  </label>
                  <input
                    type="number"
                    value={currentReps}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCurrentReps(val);
                      if (activeExercise) {
                        setWorkoutData(prev => ({
                          ...prev,
                          [activeExercise.id]: {
                            ...(prev[activeExercise.id] || {}),
                            [currentSet]: {
                              reps: parseInt(val) || 0,
                              weight: parseFloat(currentWeight) || 0,
                              notes: currentNotes
                            }
                          }
                        }));
                      }
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40">
                  <MessageSquare className="w-3 h-3" /> {t.notes}
                </label>
                <textarea
                  value={currentNotes}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCurrentNotes(val);
                    if (activeExercise) {
                      setWorkoutData(prev => ({
                        ...prev,
                        [activeExercise.id]: {
                          ...(prev[activeExercise.id] || {}),
                          [currentSet]: {
                            reps: parseInt(currentReps) || 0,
                            weight: parseFloat(currentWeight) || 0,
                            notes: val
                          }
                        }
                      }));
                    }
                  }}
                  placeholder={t.notesPlaceholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors h-20 resize-none"
                />
              </div>
            </Card>

            {/* Controls */}
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1 h-14 rounded-2xl"
                onClick={nextExercise}
              >
                <X className="w-5 h-5 mr-2" />
                {t.skip}
              </Button>
              <Button 
                variant="neon" 
                className="flex-[2] h-14 rounded-2xl font-bold uppercase tracking-widest"
                onClick={handleCompleteSet}
              >
                <Check className="w-6 h-6 mr-2" />
                {t.completeSet}
              </Button>
            </div>
          </motion.div>
        ) : (
          <Card className="p-12 text-center space-y-4">
            <HelpCircle className="w-12 h-12 text-white/20 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold uppercase tracking-tight">{t.noExercisesFound}</h3>
            </div>
            <Button variant="outline" onClick={() => setDifficultyFilter('All')}>
              {t.all}
            </Button>
          </Card>
        )}
      </AnimatePresence>

      {/* Exercise Navigation */}
      {activeExercise && (
        <div className="flex items-center justify-between px-2">
          <Button variant="ghost" size="sm" onClick={prevExercise} disabled={activeExerciseIndex === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            {t.previous}
          </Button>
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            {t.exerciseOf.replace('{n}', (activeExerciseIndex + 1).toString()).replace('{m}', filteredExercises.length.toString())}
          </span>
          <Button variant="ghost" size="sm" onClick={nextExercise} disabled={activeExerciseIndex === filteredExercises.length - 1}>
            {t.next}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      <AddExerciseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddExercise}
        exercise={newExercise}
        setExercise={setNewExercise}
        t={t}
      />

      {/* Save Template Modal */}
      <AnimatePresence>
        {isSaveTemplateModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-bg/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md bg-card border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-black uppercase tracking-tight italic">{t.saveTemplate}</h2>
                <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest">{t.storeConfig}</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">{t.templateName}</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                  placeholder={t.templatePlaceholder}
                />
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => setIsSaveTemplateModalOpen(false)}>
                  {t.cancel}
                </Button>
                <Button variant="neon" className="flex-1" onClick={handleSaveTemplate} disabled={!templateName}>
                  {t.saveTemplate}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Load Template Modal */}
      <AnimatePresence>
        {isTemplateModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-bg/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md bg-card border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black uppercase tracking-tight italic">{t.yourTemplates}</h2>
                  <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest">{t.selectRoutine}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsTemplateModalOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-3">
                {templates.length === 0 ? (
                  <div className="text-center py-8 opacity-40">
                    <FolderOpen className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">{t.noTemplates}</p>
                  </div>
                ) : (
                  templates.map(template => (
                    <div key={template.id} className="flex items-center gap-2">
                      <button
                        onClick={() => handleLoadTemplate(template)}
                        className="flex-1 text-left p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-accent transition-all group"
                      >
                        <h4 className="font-bold uppercase tracking-tight group-hover:text-accent">{template.name}</h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">
                          {template.exercises.length} {t.exercises} • {template.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)} {t.totalSets}
                        </p>
                      </button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Workout Finished Modal */}
      <AnimatePresence>
        {isFinished && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-bg/90 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-sm space-y-8 text-center"
            >
              <div className="space-y-4">
                <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mx-auto neon-glow">
                  <Trophy className="w-12 h-12 text-accent" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter">{t.workoutForged}</h2>
                  <p className="text-white/60">{t.pushedLimits}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">{t.points}</span>
                  <p className="text-2xl font-black text-accent">+{earnedPoints}</p>
                </Card>
                <Card className="p-6 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">{t.xp}</span>
                  <p className="text-2xl font-black text-accent-secondary">+{earnedXP}</p>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="p-4 flex items-center justify-between bg-white/5 border-white/10">
                  <div className="flex items-center gap-3">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="text-xs font-bold uppercase tracking-widest">{t.streakMaintained}</span>
                  </div>
                  <span className="text-xl font-black">{user.streak + 1}</span>
                </Card>
              </div>

              <Button variant="neon" size="lg" className="w-full font-black uppercase tracking-widest" onClick={() => window.location.reload()}>
                {t.claimRewards}
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AddExerciseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  exercise: Partial<Exercise>;
  setExercise: (ex: Partial<Exercise>) => void;
  t: any;
}> = ({ isOpen, onClose, onSave, exercise, setExercise, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6"
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase tracking-tight italic">{t.addExercise}</h2>
          <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest">{t.customExercise}</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">{t.exerciseName}</label>
            <input
              type="text"
              value={exercise.name}
              onChange={(e) => setExercise({ ...exercise, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors"
              placeholder="e.g. Pushups"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">{t.category}</label>
              <input
                type="text"
                value={exercise.category}
                onChange={(e) => setExercise({ ...exercise, category: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                placeholder="e.g. Chest"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">{t.difficulty}</label>
              <select
                value={exercise.difficulty}
                onChange={(e) => setExercise({ ...exercise, difficulty: e.target.value as any })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors appearance-none"
              >
                <option value="Beginner">{t.beginner}</option>
                <option value="Intermediate">{t.intermediate}</option>
                <option value="Advanced">{t.advanced}</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">{t.description}</label>
            <textarea
              value={exercise.description}
              onChange={(e) => setExercise({ ...exercise, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors h-24 resize-none"
              placeholder="Describe the exercise..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">{t.videoUrl}</label>
            <input
              type="text"
              value={exercise.videoUrl || ''}
              onChange={(e) => setExercise({ ...exercise, videoUrl: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">{t.restTime} ({t.seconds})</label>
            <input
              type="number"
              value={exercise.defaultRestTime || ''}
              onChange={(e) => setExercise({ ...exercise, defaultRestTime: parseInt(e.target.value) || 0 })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors"
              placeholder="60"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button variant="neon" className="flex-1" onClick={onSave} disabled={!exercise.name}>
            {t.save}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

const DumbbellLarge = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m6.5 6.5 11 11"/><path d="m10 10 5.5 5.5"/><path d="m3 7 4 4"/><path d="m11 3 4 4"/><path d="m15 13 4 4"/><path d="m7 15 4 4"/><path d="M18 3 3 18"/><path d="m2 2 2 2"/><path d="m20 20 2 2"/>
  </svg>
);
