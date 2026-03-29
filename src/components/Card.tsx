import * as React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../lib/utils';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'glass' | 'outline' | 'neon';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass', ...props }, ref) => {
    const variants = {
      glass: 'glass',
      outline: 'border border-card-border bg-white/5',
      neon: 'glass border-accent/30 neon-glow',
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('rounded-2xl p-4', variants[variant], className)}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
