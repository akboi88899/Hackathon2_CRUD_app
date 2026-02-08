'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useChatPreference } from '@/context/ChatPreferenceContext';
import { api, getErrorMessage } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { chatType, setChatType } = useChatPreference();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setIsLoadingProfile(true);
      const profile = await api.getProfile(user.id);
      setEmail(profile.email);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setError(null);
    setSuccessMessage(null);
    
    if (!email.trim() || !currentPassword) {
      setError('Email and current password are required');
      return;
    }

    try {
      setIsUpdatingEmail(true);
      await api.updateProfile(user.id, { email: email.trim(), current_password: currentPassword });
      setSuccessMessage('Email updated successfully');
      setCurrentPassword('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setError(null);
    setSuccessMessage(null);
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setIsChangingPassword(true);
      await api.changePassword(user.id, { current_password: currentPassword, new_password: newPassword });
      setSuccessMessage('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setError(null);
    setSuccessMessage(null);
    
    if (!deletePassword) {
      setError('Password is required to delete account');
      return;
    }

    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeletingAccount(true);
      await api.deleteAccount(user.id, deletePassword);
      logout();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col relative">
        {/* Jungle Header */}
        <header className="glass-effect border-b-2 border-[var(--jungle-light)] animate-slideIn">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 group">
                <span className="text-5xl group-hover:scale-110 transition-transform">🌳</span>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--jungle-dark)] to-[var(--jungle-secondary)] bg-clip-text text-transparent">
                  Jungle Profile
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/tasks')}
                  className="px-5 py-3 text-sm font-semibold text-[var(--jungle-secondary)] hover:bg-white rounded-xl transition-all"
                >
                  <span>📋</span> Tasks
                </button>
                <button
                  onClick={logout}
                  className="px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <span>🚪</span> Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-12 max-w-4xl mx-auto w-full">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl animate-slideIn">
              <span className="font-semibold">⚠️ {error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 text-green-700 rounded-xl animate-slideIn">
              <span className="font-semibold">✅ {successMessage}</span>
            </div>
          )}

          {/* Chat Preference Section */}
          <div className="mb-8 jungle-card p-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-[var(--jungle-dark)] mb-2 flex items-center gap-2">
              <span>💬</span> Chat Preference
            </h2>
            <p className="text-gray-600 mb-6">Choose your preferred chat interface</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setChatType('custom')}
                className={`jungle-card p-6 text-left transition-all border-2 ${
                  chatType === 'custom'
                    ? 'border-[var(--jungle-primary)] bg-[var(--jungle-light)]/20'
                    : 'border-[var(--jungle-light)] hover:border-[var(--jungle-secondary)]'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">🎤</span>
                  <h3 className="text-lg font-bold text-[var(--jungle-dark)]">Custom Chat with Voice</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Floating chat button with voice recognition support
                </p>
                {chatType === 'custom' && (
                  <div className="mt-3 text-[var(--jungle-primary)] font-semibold text-sm">
                    ✓ Currently Active
                  </div>
                )}
              </button>

              <button
                onClick={() => setChatType('default')}
                className={`jungle-card p-6 text-left transition-all border-2 ${
                  chatType === 'default'
                    ? 'border-[var(--jungle-primary)] bg-[var(--jungle-light)]/20'
                    : 'border-[var(--jungle-light)] hover:border-[var(--jungle-secondary)]'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">💬</span>
                  <h3 className="text-lg font-bold text-[var(--jungle-dark)]">Default CopilotKit Chat</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Standard CopilotKit popup interface
                </p>
                {chatType === 'default' && (
                  <div className="mt-3 text-[var(--jungle-primary)] font-semibold text-sm">
                    ✓ Currently Active
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Update Email */}
          <div className="mb-8 jungle-card p-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-[var(--jungle-dark)] mb-2 flex items-center gap-2">
              <span>📧</span> Update Email
            </h2>
            <form onSubmit={handleUpdateEmail} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-bold text-[var(--jungle-dark)] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="jungle-input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--jungle-dark)] mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="jungle-input w-full"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isUpdatingEmail}
                className="jungle-button w-full"
              >
                {isUpdatingEmail ? '🔄 Updating...' : '💾 Update Email'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="mb-8 jungle-card p-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-[var(--jungle-dark)] mb-2 flex items-center gap-2">
              <span>🔒</span> Change Password
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-bold text-[var(--jungle-dark)] mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="jungle-input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--jungle-dark)] mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="jungle-input w-full"
                  minLength={8}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--jungle-dark)] mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="jungle-input w-full"
                  minLength={8}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isChangingPassword}
                className="jungle-button w-full"
              >
                {isChangingPassword ? '🔄 Changing...' : '🔑 Change Password'}
              </button>
            </form>
          </div>

          {/* Delete Account */}
          <div className="jungle-card p-6 border-2 border-red-200 animate-fadeIn">
            <h2 className="text-2xl font-bold text-red-600 mb-2 flex items-center gap-2">
              <span>⚠️</span> Danger Zone
            </h2>
            <p className="text-gray-600 mb-4">Once you delete your account, there is no going back.</p>
            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[var(--jungle-dark)] mb-2">
                  Confirm Password to Delete
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="jungle-input w-full"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isDeletingAccount}
                className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {isDeletingAccount ? '🔄 Deleting...' : '🗑️ Delete Account'}
              </button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
