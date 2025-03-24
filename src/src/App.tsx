import { Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ThemeProvider } from '@/context/theme-provider';

import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <>
      <div className='bg-gradient-to-br from-background to-muted'>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <Header />
            <main className='container mx-auto min-h-screen px-4 py-7'>
              <Outlet />
            </main>
            <Toaster />
            <Footer />
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </div>
    </>
  );
}

export default App;
