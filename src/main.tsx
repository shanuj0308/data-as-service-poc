import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { useAuthProvider } from '@/context/auth-provider';

import '@/index.css';

import Router from '@/routes.tsx';

// eslint-disable-next-line react-hooks/rules-of-hooks
const { AuthProvider } = useAuthProvider();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </StrictMode>,
);
