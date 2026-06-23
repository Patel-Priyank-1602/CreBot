import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import CreBotLogo from '../common/CreBotLogo';
import ParticleBackground from '../landing/ParticleBackground';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--body-bg)] flex relative overflow-hidden">
      <ParticleBackground />

      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 relative z-10">
        <div className="max-w-lg">
          <Link to="/" className="flex items-center gap-2.5 mb-12">
            <div className="w-9 h-9 rounded-xl bg-[var(--btn-bg)] flex items-center justify-center">
              <CreBotLogo size={22} className="text-[var(--btn-text)]" />
            </div>
            <span className="font-display font-bold text-xl text-[var(--text-primary)] tracking-tight">CreBot</span>
          </Link>

          <h1 className="text-4xl font-display font-bold text-[var(--text-primary)] leading-[1.1] tracking-tight mb-5">
            {title}
          </h1>
          <p className="text-lg text-[var(--text-muted)] leading-relaxed">
            {subtitle}
          </p>

          <div className="mt-16 flex items-center gap-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-[var(--bg-card)] border-2 border-[var(--body-bg)] flex items-center justify-center text-[10px] text-[var(--text-muted)] font-medium"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              <span className="text-[var(--text-primary)] font-medium">2,400+</span> teams already onboard
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[420px]">
          <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
