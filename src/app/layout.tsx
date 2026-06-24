import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { LangProvider } from '@/contexts/LangContext';
import { Toaster } from '@/components/ui/sonner';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'Moi Note – Manage Your Moi Collections',
  description: 'Track and manage traditional Moi collections for weddings, birthdays, and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50 text-gray-900">
        <SessionProvider>
          <LangProvider>
            {children}
            <Toaster richColors position="top-right" />
          </LangProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
