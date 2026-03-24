import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import QueryProvider from '@/libs/queryProvider.tsx';
import { MOCK_USER } from '@/mocks/data';
import { useAuthStore } from '@/stores/authStore';

import { router } from './routes/router.tsx';

// 가상 로그인: 앱 부팅 시 mock 유저로 자동 인증
const authState = useAuthStore.getState();
if (!authState.isAuthenticated) {
  authState.setTokens('mock-access-token', 'mock-refresh-token');
  authState.setUser(MOCK_USER);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  </StrictMode>,
);
