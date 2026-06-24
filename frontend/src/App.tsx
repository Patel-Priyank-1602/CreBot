import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { useTheme } from './context/ThemeContext';
import DashboardLayout from './components/layout/DashboardLayout';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const DashboardOverview = lazy(() => import('./pages/DashboardOverview'));
const ChatbotsPage = lazy(() => import('./pages/ChatbotsPage'));
const ChatbotDetail = lazy(() => import('./pages/ChatbotDetail'));
const BotDetail = lazy(() => import('./pages/BotDetail'));
const KnowledgeBasePage = lazy(() => import('./pages/KnowledgeBasePage'));
const RagChatPage = lazy(() => import('./pages/RagChatPage'));
const EmbedPage = lazy(() => import('./pages/EmbedPage'));
const ChatLogsPage = lazy(() => import('./pages/ChatLogsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const BillingPage = lazy(() => import('./pages/BillingPage'));
const JoinBotPage = lazy(() => import('./pages/JoinBotPage'));

function AppContent() {
  const { theme } = useTheme();

  return (
    <div className={theme}>
      <Router>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--body-bg)' }}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-[var(--border-default)] border-t-[var(--text-primary)] animate-spin" />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</p>
            </div>
          </div>
        }>
          <Routes>
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

            <Route path="/login" element={<SignedOut><SignInPage /></SignedOut>} />
            <Route path="/signup" element={<SignedOut><SignUpPage /></SignedOut>} />

            <Route
              path="/dashboard"
              element={
                <SignedIn>
                  <DashboardLayout />
                </SignedIn>
              }
            >
              <Route index element={<DashboardOverview />} />
              <Route path="chatbots" element={<ChatbotsPage />} />
              <Route path="chatbots/:id" element={<ChatbotDetail />} />
              <Route path="knowledge" element={<KnowledgeBasePage />} />
              <Route path="rag-chat" element={<RagChatPage />} />
              <Route path="embed" element={<EmbedPage />} />
              <Route path="logs" element={<ChatLogsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="billing" element={<BillingPage />} />
              <Route path="join" element={<JoinBotPage />} />
            </Route>

            <Route
              path="/user"
              element={
                <SignedIn>
                  <UserProfilePage />
                </SignedIn>
              }
            />

            <Route
              path="/bot/:id"
              element={
                <SignedIn>
                  <div className="min-h-screen app-bg">
                    <BotDetail />
                  </div>
                </SignedIn>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
