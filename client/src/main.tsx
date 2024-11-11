import { createRoot } from 'react-dom/client';
import { router } from '@/router';
import { RouterProvider } from 'react-router-dom';

import '@/assets/index.css';
import 'modern-normalize/modern-normalize.css';

const maybeRoot = document.getElementById('root');

if (!maybeRoot) {
  throw new Error('???');
}

createRoot(maybeRoot).render(<RouterProvider router={router} />);
