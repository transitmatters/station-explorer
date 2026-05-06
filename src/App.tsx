import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import React from 'react';
import { ONE_DAY } from './constants/time';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      staleTime: 10000, // 10 seconds
      // Required for queries to be picked up by the persister.
      gcTime: ONE_DAY,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  key: 'station-explorer-rq-cache',
  // Older cached entries get dropped automatically once they exceed maxAge.
  throttleTime: 1000,
});

const router = createRouter({ routeTree });

const App: React.FunctionComponent = () => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: ONE_DAY,
        // Bump this string to invalidate the persisted cache when shipping a
        // new build that changes data shapes.
        buster: 'v1',
      }}
    >
      <RouterProvider router={router} />
    </PersistQueryClientProvider>
  );
};

export default App;
