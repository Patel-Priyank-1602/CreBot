import { UserProfile } from '@clerk/clerk-react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-[var(--body-bg)] flex flex-col items-center py-12 px-4 sm:px-6">

      {/* Top Navigation */}
      <div className="w-full max-w-[900px] mb-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
      </div>

      {/* Header Section (Logo & Description) */}
      <div className="w-full max-w-[900px] mb-10 flex flex-col items-center text-center">
        <img
          src="/favtag.png"
          alt="CreBot Logo"
          className="h-10 sm:h-14 w-auto object-contain mb-8 drop-shadow-lg"
        />
        
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] tracking-tight mb-3">
          Manage your profile & preferences
        </h1>
        
        <p className="text-[var(--text-muted)] max-w-lg leading-relaxed text-[15px] sm:text-base">
          Update your personal information, manage security settings, and control your account preferences all in one place.
        </p>
      </div>

      {/* Profile Section */}
      <div className="w-full max-w-[900px] flex justify-center">
        {/* We let index.css handle the styling of the UserProfile card to ensure pixel-perfect typography. */}
        <UserProfile />
      </div>

    </div>
  );
}
