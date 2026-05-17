import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';

import App from './App';

import '@mantine/core/styles.css';
import './globals.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <MantineProvider defaultColorScheme={'auto'}>
      <App />
    </MantineProvider>
  </StrictMode>
);
