'use client';

import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Hero Section */}
      <header className="glass-effect border-b-2 border-[var(--jungle-light)] animate-slideIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="text-5xl group-hover:scale-110 transition-transform">🌳</span>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--jungle-dark)] to-[var(--jungle-secondary)] bg-clip-text text-transparent">
                  Jungle Tasks
                </h1>
                <p className="text-sm text-[var(--jungle-secondary)]">About Us</p>
              </div>
            </Link>
            <div className="flex gap-3">
              <Link href="/" className="jungle-button">
                <span>🏠</span> Home
              </Link>
              <Link href="/signin" className="px-5 py-3 bg-white rounded-xl font-semibold text-[var(--jungle-secondary)] hover:shadow-md transition-all">
                <span>🔑</span> Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Content */}
          <div className="text-center mb-16 animate-fadeIn">
            <div className="inline-block animate-float mb-6">
              <span className="text-9xl">🌴</span>
            </div>
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[var(--jungle-dark)] via-[var(--jungle-secondary)] to-[var(--jungle-accent)] bg-clip-text text-transparent">
              Welcome to Your Productivity Jungle
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Where tasks grow naturally and productivity blooms beautifully 🌱
            </p>
          </div>

          {/* Mission */}
          <div className="jungle-card p-8 mb-12 animate-slideIn">
            <div className="flex items-start gap-6">
              <div className="text-6xl animate-float">🎯</div>
              <div>
                <h3 className="text-3xl font-bold text-[var(--jungle-dark)] mb-4">Our Mission</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  At Jungle Tasks we believe productivity shouldn't feel like a chore. Our mission is to create 
                  a task management experience that's both powerful and peaceful 🌿
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center jungle-card p-12 bg-gradient-to-r from-[var(--jungle-secondary)] to-[var(--jungle-accent)] text-white animate-scaleIn">
            <h3 className="text-4xl font-bold mb-4">Ready to Grow?</h3>
            <p className="text-xl mb-8">Plant your first task seed today 🌱</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/signup" className="px-8 py-4 bg-white text-[var(--jungle-dark)] rounded-xl font-bold hover:shadow-2xl transition-all hover:scale-105">
                Start Free
              </Link>
              <Link href="/signin" className="px-8 py-4 bg-transparent border-2 border-white rounded-xl font-bold hover:bg-white hover:text-[var(--jungle-dark)] transition-all">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
