import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { getClerkAppearance } from './lib/clerkTheme';
import App from './App.tsx';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key. Set VITE_CLERK_PUBLISHABLE_KEY in your .env file.');
}

function ClerkThemedProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={getClerkAppearance(theme)}>
      {children}
    </ClerkProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ClerkThemedProvider>
        <App />
      </ClerkThemedProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
