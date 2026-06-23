import { motion } from 'framer-motion';
import { Bot, Copy, Check, RefreshCw } from 'lucide-react';
import { memo, useState } from 'react';
import { cn } from '../../lib/utils';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  sources?: { name: string; score: number }[];
  onRegenerate?: () => void;
}

function MessageBubble({ role, content, sources, onRegenerate }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex gap-3',
        role === 'user' ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <div className={cn(
        'w-8 h-8 rounded-xl flex items-center justify-center shrink-0',
        role === 'user' ? 'bg-[var(--btn-bg)]' : 'bg-[var(--bg-card)] border border-[var(--border-soft)]'
      )}>
        {role === 'user' ? (
          <span className="text-xs font-bold text-[var(--btn-text)]">U</span>
        ) : (
          <Bot size={16} className="text-[var(--text-primary)]" />
        )}
      </div>

      <div className={cn(
        'max-w-[75%] space-y-2',
        role === 'user' ? 'items-end' : 'items-start'
      )}>
        <div className={cn(
          'rounded-2xl px-4 py-3 text-sm leading-relaxed',
          role === 'user'
            ? 'bg-[var(--btn-bg)] text-[var(--btn-text)] rounded-tr-md'
            : 'bg-[var(--bg-card)] border border-[var(--border-soft)] text-[var(--text-secondary)] rounded-tl-md'
        )}>
          {content}
        </div>

        {sources && sources.length > 0 && role === 'assistant' && (
          <div className="flex flex-wrap gap-1.5">
            {sources.map((source, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-input)] border border-[var(--border-soft)] text-[var(--text-muted)] font-mono"
              >
                {source.name} ({Math.round(source.score * 100)}%)
              </span>
            ))}
          </div>
        )}

        {role === 'assistant' && (
          <div className="flex items-center gap-1 px-1">
            <button
              onClick={handleCopy}
              className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </button>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
              >
                <RefreshCw size={12} />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default memo(MessageBubble);
