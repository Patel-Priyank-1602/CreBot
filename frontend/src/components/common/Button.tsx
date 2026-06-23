import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 border',
          'hover:-translate-y-0.5 active:translate-y-0',
          {
            'bg-[var(--btn-bg)] text-[var(--btn-text)] border-[var(--btn-bg)] hover:bg-[var(--btn-hover)]': variant === 'primary',
            'bg-transparent text-[var(--text-primary)] border-[var(--border-default)] hover:bg-[var(--btn-dark-hover)] hover:border-[var(--border-default)]': variant === 'secondary',
            'bg-transparent text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]': variant === 'ghost',
            'bg-transparent text-[var(--text-primary)] border-[var(--border-default)] hover:border-red-500/50 hover:text-red-400': variant === 'danger',
            'px-3 py-1.5 text-xs rounded-lg': size === 'sm',
            'px-4 py-2 text-sm rounded-xl': size === 'md',
            'px-6 py-3 text-base rounded-xl': size === 'lg',
          },
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:-translate-y-0',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
