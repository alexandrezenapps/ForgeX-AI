import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface GaugeProps {
  value: number;
  max: number;
  label?: string;
  color?: string;
  className?: string;
  showValue?: boolean;
}

export const Gauge: React.FC<GaugeProps> = ({
  value,
  max,
  label,
  color = 'var(--color-accent)',
  className,
  showValue = true,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex justify-between items-end">
        {label && <span className="text-xs font-mono uppercase tracking-wider text-white/50">{label}</span>}
        {showValue && (
          <span className="text-xs font-mono font-medium">
            {value}/{max}
          </span>
        )}
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ 
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}44`
          }}
        />
      </div>
    </div>
  );
};
