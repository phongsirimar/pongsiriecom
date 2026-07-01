'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { useEffect, useRef } from 'react';
import { useThemeStore } from '@/store/themeStore';

function ThemeInit() {
  const { isDark } = useThemeStore();
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      document.documentElement.classList.toggle('dark', isDark);
      mounted.current = true;
    }
  }, [isDark]);
  return null;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeInit />
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            borderRadius: '10px',
            background: '#1e293b',
            color: '#f1f5f9',
            fontSize: '14px',
          },
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
