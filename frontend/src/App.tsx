import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
import { MessageSquare } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import BotDetail from './pages/BotDetail';

function Navbar() {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <nav className="navbar">
      <a href="/dashboard" className="navbar-brand" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
        <span className="navbar-brand-mark">
          <MessageSquare size={14} color="#fff" />
        </span>
        CreBot
      </a>
      <div className="navbar-user-area">
        {user && (
          <span className="navbar-user-name">
            {user.firstName || user.emailAddresses[0]?.emailAddress}
          </span>
        )}
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: { width: 32, height: 32 },
            },
          }}
        />
      </div>
    </nav>
  );
}

function ProtectedLayout() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content page-enter">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bot/:id" element={<BotDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public landing page */}
        <Route
          path="/"
          element={
            <>
              <SignedOut>
                <LandingPage />
              </SignedOut>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
            </>
          }
        />

        {/* Protected dashboard routes */}
        <Route
          path="/dashboard/*"
          element={
            <>
              <SignedIn>
                <ProtectedLayout />
              </SignedIn>
              <SignedOut>
                <Navigate to="/" replace />
              </SignedOut>
            </>
          }
        />

        {/* Bot detail — also protected */}
        <Route
          path="/bot/:id"
          element={
            <>
              <SignedIn>
                <div className="app-container">
                  <Navbar />
                  <main className="main-content page-enter">
                    <BotDetail />
                  </main>
                </div>
              </SignedIn>
              <SignedOut>
                <Navigate to="/" replace />
              </SignedOut>
            </>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
