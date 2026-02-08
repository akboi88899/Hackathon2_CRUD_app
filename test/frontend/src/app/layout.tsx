import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ChatPreferenceProvider } from '@/context/ChatPreferenceContext';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TaskMaster - Organize Your Life',
  description: 'A beautiful and professional task management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
        <AuthProvider>
          <ChatPreferenceProvider>
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            <Footer />
          </ChatPreferenceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
