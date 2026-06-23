import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full px-4 py-2.5 bg-[var(--bg-input)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)]',
            'placeholder:text-[var(--text-muted)] transition-colors duration-200',
            'focus:outline-none focus:border-[var(--text-primary)]',
            error && 'border-white/50',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-[var(--white-alpha-20)]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
