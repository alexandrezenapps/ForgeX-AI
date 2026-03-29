import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Dumbbell, Sparkles, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { useI18n } from '../i18n';
import { Language } from '../types';

interface FloatingActionMenuProps {
  onAction: (action: string) => void;
  language?: Language;
}

export const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({ onAction, language = 'en' }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isMinimized, setIsMinimized] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const t = useI18n(language);

  React.useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setTimeout(() => {
      setIsMinimized(true);
      setIsExpanded(false);
    }, 5000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleToggle = () => {
    if (isMinimized) {
      setIsMinimized(false);
      setIsExpanded(true);
      startTimer();
    } else {
      setIsExpanded(!isExpanded);
      if (!isExpanded) startTimer();
      else stopTimer();
    }
  };

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] flex items-center">
      <AnimatePresence>
        {!isMinimized ? (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="flex items-center"
          >
            {isExpanded && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="bg-bg/80 backdrop-blur-xl border border-white/10 rounded-l-2xl p-2 flex flex-col gap-2 shadow-2xl mr-[-1px]"
              >
                <button
                  onClick={() => onAction('workout')}
                  className="flex items-center gap-3 p-3 hover:bg-accent/10 rounded-xl transition-colors group text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center group-hover:bg-accent group-hover:text-bg transition-colors">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">{t.quickStart}</span>
                </button>
                <button
                  onClick={() => onAction('coach')}
                  className="flex items-center gap-3 p-3 hover:bg-accent-secondary/10 rounded-xl transition-colors group text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent-secondary/20 flex items-center justify-center group-hover:bg-accent-secondary group-hover:text-white transition-colors">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">{t.askAi}</span>
                </button>
                <button
                  onClick={() => onAction('settings')}
                  className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors group text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Settings className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">{t.settings}</span>
                </button>
              </motion.div>
            )}
            
            <button
              onClick={handleToggle}
              className="w-10 h-24 bg-accent text-bg rounded-l-2xl flex flex-col items-center justify-center gap-2 shadow-neon transition-all hover:pr-2 group"
            >
              <Zap className="w-5 h-5 animate-pulse" />
              <div className="[writing-mode:vertical-lr] text-[8px] font-black uppercase tracking-[0.2em] rotate-180">
                {t.quickActions}
              </div>
              {isExpanded ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </motion.div>
        ) : (
          <motion.button
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            whileHover={{ x: -4 }}
            onClick={handleToggle}
            className="w-2 h-32 bg-accent/40 hover:bg-accent rounded-l-full transition-all shadow-neon"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
