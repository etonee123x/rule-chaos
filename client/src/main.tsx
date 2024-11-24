import { createRoot } from 'react-dom/client';

import '@/assets/index.css';
import 'modern-normalize/modern-normalize.css';
import { WebSocketProvider } from '@/contexts/webSocket';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';

const maybeRoot = document.getElementById('root');

if (!maybeRoot) {
  throw new Error('???');
}

createRoot(maybeRoot).render(
  <WebSocketProvider>
    <RouterProvider router={router} />
  </WebSocketProvider>,
);
