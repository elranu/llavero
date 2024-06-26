'use client';

import { Header } from '@/shared/components/header';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/shared/components/ui/toaster';
import { ThemeProvider } from '@/shared/providers/theme-provider';
import { ReactNode } from 'react';
import { AutoLogoutProvider } from './auto-logout';

const queryClient = new QueryClient();

type Props = {
  children: ReactNode;
};

function ClientLayout({ children }: Props) {
  console.log('Rendering ClientLayout');
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
        <AutoLogoutProvider>
          <QueryClientProvider client={queryClient}>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="my-8 flex-1 flex flex-col">{children}</div>
              {/* <Footer /> */}
            </div>
            <Toaster />
          </QueryClientProvider>
        </AutoLogoutProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
export { ClientLayout };
