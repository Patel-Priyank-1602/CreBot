import { Info } from 'lucide-react';

interface UsageLimitBannerProps {
  used: number;
  limit: number;
}

export default function UsageLimitBanner({ used, limit }: UsageLimitBannerProps) {
  const percent = limit > 0 ? (used / limit) * 100 : 0;
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-[var(--bg-input)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] shrink-0">
        <Info size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--text-primary)]">
          You are using {used} of {limit} available chatbots.
        </p>
        <div className="mt-2 h-1.5 rounded-full bg-[var(--skeleton-bg)] overflow-hidden max-w-xs">
          <div className="h-full rounded-full bg-[var(--white-alpha-20)]" style={{ width: `${Math.min(percent, 100)}%` }} />
        </div>
      </div>
    </div>
  );
}
