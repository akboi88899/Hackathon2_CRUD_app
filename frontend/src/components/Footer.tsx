'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="glass-effect border-t-2 border-[var(--jungle-light)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn">
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-4xl animate-float">🌳</span>
              <h3 className="text-xl font-bold bg-gradient-to-r from-[var(--jungle-dark)] to-[var(--jungle-secondary)] bg-clip-text text-transparent">
                Jungle Tasks
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Grow your productivity in a calm, nature-inspired environment. 
              Manage tasks that bloom like flowers in your personal jungle. 🌱
            </p>
            <div className="flex gap-3 text-2xl">
              <span className="cursor-pointer hover:scale-110 transition-transform">🌿</span>
              <span className="cursor-pointer hover:scale-110 transition-transform">🍃</span>
              <span className="cursor-pointer hover:scale-110 transition-transform">🌺</span>
              <span className="cursor-pointer hover:scale-110 transition-transform">🦜</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[var(--jungle-dark)] uppercase tracking-wide flex items-center gap-2">
              <span>🔗</span> Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-gray-600 hover:text-[var(--jungle-accent)] transition-colors flex items-center gap-2">
                  <span>🏠</span> Home
                </a>
              </li>
              <li>
                <a href="/tasks" className="text-sm text-gray-600 hover:text-[var(--jungle-accent)] transition-colors flex items-center gap-2">
                  <span>✅</span> My Tasks
                </a>
              </li>
              <li>
                <a href="/about" className="text-sm text-gray-600 hover:text-[var(--jungle-accent)] transition-colors flex items-center gap-2">
                  <span>ℹ️</span> About
                </a>
              </li>
              <li>
                <a href="/profile" className="text-sm text-gray-600 hover:text-[var(--jungle-accent)] transition-colors flex items-center gap-2">
                  <span>👤</span> Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[var(--jungle-dark)] uppercase tracking-wide flex items-center gap-2">
              <span>✨</span> Features
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Recurring Tasks (Daily/Weekly/Monthly)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Beautiful Jungle Theme
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Smooth Animations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Deadline Reminders
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Task Filtering & Sorting
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-[var(--jungle-light)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <span>🌱</span>
            Made with love for productive souls
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <span>© 2026 Jungle Tasks</span>
            <span className="animate-float">🌿</span>
            <span>All rights reserved</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
