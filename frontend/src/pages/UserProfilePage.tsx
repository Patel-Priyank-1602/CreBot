import { UserProfile } from '@clerk/clerk-react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CreBotLogo from '../components/common/CreBotLogo';

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-[var(--body-bg)] flex">
      {/* Left panel - brand */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16">
        <div className="max-w-lg">
          <Link to="/dashboard" className="flex items-center gap-2.5 mb-12">
            <div className="w-9 h-9 rounded-xl bg-[var(--btn-bg)] flex items-center justify-center">
              <CreBotLogo size={22} className="text-[var(--btn-text)]" />
            </div>
            <span className="font-display font-bold text-xl text-[var(--text-primary)] tracking-tight">CreBot</span>
          </Link>

          <h1 className="text-4xl font-display font-bold text-[var(--text-primary)] leading-[1.1] tracking-tight mb-5">
            Manage your profile & preferences.
          </h1>
          <p className="text-lg text-[var(--text-muted)] leading-relaxed">
            Update your personal information, manage security settings, and control your account preferences all in one place.
          </p>
        </div>
      </div>

      {/* Right panel - profile form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[520px]">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden">
            <UserProfile />
          </div>
        </div>
      </div>
    </div>
  );
}
