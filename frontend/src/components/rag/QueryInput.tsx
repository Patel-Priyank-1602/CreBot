import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface QueryInputProps {
  onSend: (message: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

export default function QueryInput({ onSend, disabled, onClear }: QueryInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-[var(--border-soft)] bg-[var(--bg-main)] px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-2 bg-[var(--bg-input)] border border-[var(--border-default)] rounded-2xl px-4 py-2 focus-within:border-[var(--text-primary)] transition-colors">
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors shrink-0">
            <Paperclip size={16} />
          </button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything from your knowledge base..."
            rows={1}
            disabled={disabled}
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] border-none outline-none resize-none py-2 max-h-[120px]"
          />
          <div className="flex items-center gap-1 shrink-0">
            {input && (
              <button
                onClick={() => setInput('')}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || disabled}
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                input.trim()
                  ? 'bg-[var(--btn-bg)] text-[var(--btn-text)] hover:bg-[var(--btn-hover)]'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)]'
              )}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
