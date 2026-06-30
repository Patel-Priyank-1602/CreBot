import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'ghost';
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className,
  disabled = false,
  variant = 'default',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={selectRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors focus:outline-none",
          variant === 'default' && "border bg-[var(--bg-input)] border-[var(--border-default)] text-[var(--text-primary)] hover:border-[var(--text-muted)] focus:border-[var(--text-primary)]",
          variant === 'ghost' && "bg-transparent text-[var(--text-primary)] hover:bg-[var(--hover-bg)] border border-transparent",
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && variant === 'default' && "border-[var(--text-primary)]",
          isOpen && variant === 'ghost' && "bg-[var(--hover-bg)]"
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-[var(--text-muted)]")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={16} 
          className={cn("text-[var(--text-muted)] transition-transform duration-200", isOpen && "transform rotate-180")} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 w-full mt-1 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-lg shadow-xl overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
              {options.length === 0 ? (
                <div className="px-3 py-2 text-sm text-[var(--text-muted)] text-center">
                  No options
                </div>
              ) : (
                options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm transition-colors",
                      value === option.value
                        ? "bg-[var(--hover-bg)] text-[var(--text-primary)] font-medium"
                        : "text-[var(--text-secondary)] hover:bg-[var(--hover-soft)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {option.label}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
