import { ReactNode } from 'react';

import './globals.css';

export const metadata = {
  title: 'OpenSpace Converter',
  description: 'A set of conversion tools for OpenSpace files'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={'en'}>
      <body>{children}</body>
    </html>
  );
}
