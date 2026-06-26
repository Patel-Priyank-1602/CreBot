import { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  className?: string;
}

function StatCard({ icon, label, value, trend, className }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState<string | number>('0');

  useEffect(() => {
    let startTimestamp: number;
    const duration = 1200; // 1.2 seconds
    
    // Parse numeric part and suffix if string
    let targetNum: number;
    let prefix = '';
    let suffix = '';
    
    if (typeof value === 'number') {
      targetNum = value;
    } else {
      // Try to extract number and suffix (e.g. "36.1 KB" -> 36.1, " KB")
      const match = String(value).match(/^([\d.,]+)(.*)$/);
      if (match) {
        targetNum = parseFloat(match[1].replace(/,/g, ''));
        suffix = match[2];
      } else {
        setDisplayValue(value);
        return;
      }
    }

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentNum = targetNum * ease;
      
      // format to match precision
      const isInteger = Number.isInteger(targetNum);
      const formattedNum = isInteger 
        ? Math.floor(currentNum).toLocaleString() 
        : currentNum.toFixed(1);
        
      setDisplayValue(`${prefix}${formattedNum}${suffix}`);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value]);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        'bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 hover:border-[var(--border-default)] transition-colors',
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--bg-input)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)]">
          {icon}
        </div>
        {trend && (
          <span className="text-xs text-[var(--text-muted)] font-mono">{trend}</span>
        )}
      </div>
      <p className="text-2xl font-bold text-[var(--text-primary)] mb-0.5">{displayValue}</p>
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
    </motion.div>
  );
}

export default memo(StatCard);
