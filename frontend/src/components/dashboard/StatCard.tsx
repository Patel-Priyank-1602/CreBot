import { memo } from 'react';
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
      <p className="text-2xl font-bold text-[var(--text-primary)] mb-0.5">{value}</p>
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
    </motion.div>
  );
}

export default memo(StatCard);
