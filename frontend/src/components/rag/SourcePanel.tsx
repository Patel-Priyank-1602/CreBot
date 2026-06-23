import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

interface Source {
  id: string;
  name: string;
  preview: string;
  score: number;
  page?: number;
}

interface SourcePanelProps {
  sources: Source[];
  open: boolean;
  onClose: () => void;
}

export default function SourcePanel({ sources, open, onClose }: SourcePanelProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="w-80 border-l border-[var(--border-soft)] bg-[var(--sidebar-bg)] h-full overflow-y-auto"
        >
          <div className="flex items-center justify-between px-4 h-12 border-b border-[var(--border-soft)]">
            <h3 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Sources ({sources.length})
            </h3>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <div className="p-3 space-y-2">
            {sources.map((source) => (
              <div
                key={source.id}
                className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(expanded === source.id ? null : source.id)}
                  className="w-full flex items-center gap-3 p-3 text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-[var(--bg-input)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] shrink-0">
                    <FileText size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[var(--text-primary)] truncate">{source.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="h-1 flex-1 rounded-full bg-[var(--skeleton-bg)] overflow-hidden max-w-[60px]">
                        <div
                          className="h-full rounded-full bg-[var(--white-alpha-20)]"
                          style={{ width: `${source.score * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        {Math.round(source.score * 100)}%
                      </span>
                    </div>
                  </div>
                  {expanded === source.id ? (
                    <ChevronUp size={12} className="text-[var(--text-muted)]" />
                  ) : (
                    <ChevronDown size={12} className="text-[var(--text-muted)]" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {expanded === source.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="border-t border-[var(--border-soft)] overflow-hidden"
                    >
                      <div className="p-3">
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{source.preview}</p>
                        {source.page && (
                          <p className="text-[10px] text-[var(--text-muted)] mt-2 font-mono">Page {source.page}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
