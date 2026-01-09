'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth';
import Footer from '@/components/Footer';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Don't auto-redirect, show landing page
    const checkAuth = async () => {
      if (isAuthenticated()) {
        // User is logged in, they can navigate manually
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Hero Section */}
      <header className="glass-effect border-b-2 border-[var(--jungle-light)] animate-slideIn sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-5xl animate-float">🌳</span>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--jungle-dark)] to-[var(--jungle-secondary)] bg-clip-text text-transparent">
                  Jungle Tasks
                </h1>
                <p className="text-sm text-[var(--jungle-secondary)]">Grow Your Productivity</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/about" className="px-5 py-3 text-sm font-semibold text-[var(--jungle-secondary)] hover:bg-white rounded-xl transition-all">
                <span>ℹ️</span> About
              </Link>
              <Link href="/signin" className="px-5 py-3 text-sm font-semibold text-[var(--jungle-secondary)] hover:bg-white rounded-xl transition-all">
                <span>🔑</span> Sign In
              </Link>
              <Link href="/signup" className="jungle-button">
                <span>🌱</span> Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero Banner */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block animate-float mb-8">
              <span className="text-9xl">🌴</span>
            </div>
            <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-[var(--jungle-dark)] via-[var(--jungle-secondary)] to-[var(--jungle-accent)] bg-clip-text text-transparent animate-fadeIn">
              Your Productivity Jungle Awaits
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto mb-12 animate-slideIn">
              Manage tasks beautifully with recurring reminders, smooth animations, and a calming jungle theme 🌿
            </p>
            <div className="flex gap-4 justify-center flex-wrap animate-scaleIn">
              <Link href="/signup" className="px-10 py-5 jungle-button text-lg font-bold flex items-center gap-3">
                <span className="text-2xl">🚀</span>
                Start Growing Free
              </Link>
              <Link href="/about" className="px-10 py-5 bg-white rounded-xl font-bold text-lg text-[var(--jungle-dark)] hover:shadow-lg transition-all flex items-center gap-3 border-2 border-[var(--jungle-light)]">
                <span className="text-2xl">📖</span>
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 bg-gradient-to-b from-transparent to-[var(--jungle-mist)]">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-5xl font-bold text-center mb-16 text-[var(--jungle-dark)]">
              Why Jungle Tasks? 🌟
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="jungle-card p-8 text-center animate-slideIn">
                <div className="text-7xl mb-6">🔄</div>
                <h4 className="text-2xl font-bold mb-4 text-[var(--jungle-dark)]">Recurring Tasks</h4>
                <p className="text-gray-600">
                  Set daily, weekly, or monthly tasks. Perfect for meetings, habits, and routines.
                </p>
              </div>
              <div className="jungle-card p-8 text-center animate-slideIn" style={{ animationDelay: '0.1s' }}>
                <div className="text-7xl mb-6">🌳</div>
                <h4 className="text-2xl font-bold mb-4 text-[var(--jungle-dark)]">Jungle Theme</h4>
                <p className="text-gray-600">
                  Calm, nature-inspired design that reduces stress and increases focus.
                </p>
              </div>
              <div className="jungle-card p-8 text-center animate-slideIn" style={{ animationDelay: '0.2s' }}>
                <div className="text-7xl mb-6">⚡</div>
                <h4 className="text-2xl font-bold mb-4 text-[var(--jungle-dark)]">Smooth Animations</h4>
                <p className="text-gray-600">
                  Every interaction feels delightful with beautiful animations throughout.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center jungle-card p-12 bg-gradient-to-r from-[var(--jungle-secondary)] to-[var(--jungle-accent)] text-white">
            <h3 className="text-5xl font-bold mb-6">Ready to Transform Your Productivity?</h3>
            <p className="text-xl mb-8 opacity-90">
              Join productive souls growing their task jungle today 🌱
            </p>
            <Link href="/signup" className="inline-block px-12 py-5 bg-white text-[var(--jungle-dark)] rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105">
              Plant Your First Task Seed 🌱
            </Link>
          </div>
        </section>
      </main>

      {/* Floating Decorations */}
      <div className="fixed bottom-10 right-10 text-6xl animate-float pointer-events-none opacity-20">
        🍃
      </div>
      <div className="fixed top-1/3 left-10 text-4xl animate-float pointer-events-none opacity-20" style={{ animationDelay: '1s' }}>
        🌿
      </div>

      <Footer />
    </div>
  );
}
