'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Footer from '@/components/Footer';

export default function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signin, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/tasks');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    setIsLoading(true);
    try {
      await signin({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signin failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <header className="glass-effect border-b-2 border-[var(--jungle-light)] animate-slideIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="text-5xl group-hover:scale-110 transition-transform">🌳</span>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--jungle-dark)] to-[var(--jungle-secondary)] bg-clip-text text-transparent">
                Jungle Tasks
              </h1>
            </Link>
            <Link href="/" className="px-5 py-3 text-sm font-semibold text-[var(--jungle-secondary)] hover:bg-white rounded-xl transition-all">
              <span>🏠</span> Home
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8 animate-fadeIn">
            <div className="inline-block animate-float mb-4">
              <span className="text-8xl">🔑</span>
            </div>
            <h2 className="text-4xl font-bold mb-2 text-[var(--jungle-dark)]">Welcome Back!</h2>
            <p className="text-gray-600">Enter your jungle to continue growing 🌱</p>
          </div>

          <div className="jungle-card p-8 animate-scaleIn">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl animate-slideIn">
                <span className="font-semibold">⚠️ {error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-[var(--jungle-dark)] mb-2">
                  📧 Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="jungle-input w-full"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-[var(--jungle-dark)] mb-2">
                  🔒 Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="jungle-input w-full"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full jungle-button py-4 text-lg font-bold"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Entering...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>🚪</span> Sign In
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/signup" className="font-bold text-[var(--jungle-accent)] hover:text-[var(--jungle-secondary)] transition-colors">
                  Create one now 🌱
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-10 right-10 text-6xl animate-float pointer-events-none opacity-20">
        🍃
      </div>

      <Footer />
    </div>
  );
}
