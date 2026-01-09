'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api, getErrorMessage } from '@/lib/api';
import { Task, TaskCreate, TaskUpdate, FilterType, SortType } from '@/types/task';
import ProtectedRoute from '@/components/ProtectedRoute';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import Footer from '@/components/Footer';

export default function TasksPage() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('created_desc');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user, filter, sort, search]);

  const loadTasks = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getTasks(user.id, filter, sort, search || undefined);
      setTasks(response.tasks);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (data: TaskCreate) => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      await api.createTask(user.id, data);
      setShowForm(false);
      await loadTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (data: TaskUpdate) => {
    if (!user || !editingTask) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      await api.updateTask(user.id, editingTask.id, data);
      setEditingTask(null);
      await loadTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    if (!user) return;
    
    try {
      await api.toggleTaskCompletion(user.id, taskId);
      await loadTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;
    
    try {
      await api.deleteTask(user.id, taskId);
      await loadTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen relative">
        {/* Jungle Header */}
        <header className="glass-effect sticky top-0 z-40 border-b-2 border-[var(--jungle-light)] animate-slideIn">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-5xl animate-float">🌳</span>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--jungle-dark)] to-[var(--jungle-secondary)] bg-clip-text text-transparent">
                    My Jungle Tasks
                  </h1>
                  <p className="text-sm text-[var(--jungle-secondary)]">Grow your productivity 🌱</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[var(--jungle-dark)] px-4 py-2 rounded-full bg-white shadow-sm">
                  👤 {user?.email}
                </span>
                <button
                  onClick={() => window.location.href = '/profile'}
                  className="px-5 py-2 text-sm font-semibold text-[var(--jungle-secondary)] hover:bg-white rounded-xl transition-all hover:shadow-md"
                >
                  📋 Profile
                </button>
                <button
                  onClick={logout}
                  className="px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all hover:shadow-md"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {error && (
            <div className="mb-6 jungle-card p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 animate-slideIn">
              <span className="text-red-700 font-semibold flex items-center gap-2">
                <span>⚠️</span> {error}
              </span>
            </div>
          )}

          {/* Controls */}
          <div className="mb-8 jungle-card p-6 animate-fadeIn">
            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={() => setShowForm(true)}
                className="jungle-button flex items-center gap-2"
              >
                <span className="text-xl">➕</span>
                <span>New Task</span>
              </button>

              <div className="flex gap-2 items-center">
                <label htmlFor="filter" className="text-sm font-bold text-[var(--jungle-dark)] flex items-center gap-1">
                  <span>🔍</span> Filter:
                </label>
                <select
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as FilterType)}
                  className="jungle-input"
                >
                  <option value="all">🌍 All Tasks</option>
                  <option value="incomplete">⏳ Incomplete</option>
                  <option value="complete">✅ Complete</option>
                  <option value="overdue">⚠️ Overdue</option>
                  <option value="upcoming">🔔 Due Soon (24h)</option>
                  <option value="no-deadline">📌 No Deadline</option>
                </select>
              </div>

              <div className="flex gap-2 items-center">
                <label htmlFor="sort" className="text-sm font-bold text-[var(--jungle-dark)] flex items-center gap-1">
                  <span>⬇️</span> Sort:
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortType)}
                  className="jungle-input"
                >
                  <option value="created_desc">🆕 Newest First</option>
                  <option value="created_asc">📅 Oldest First</option>
                  <option value="title_asc">🔤 Title (A-Z)</option>
                  <option value="title_desc">🔤 Title (Z-A)</option>
                  <option value="status">⭐ Status (Incomplete First)</option>
                  <option value="deadline_asc">⏰ Deadline (Earliest)</option>
                  <option value="deadline_desc">⏰ Deadline (Latest)</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="🔎 Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-[200px] jungle-input"
              />
            </div>
          </div>

          {/* Task List */}
          <div className="jungle-card p-6">
            <TaskList
              tasks={tasks}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
              isLoading={isLoading}
            />
          </div>

          {(showForm || editingTask) && (
            <TaskForm
              task={editingTask}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={handleCancelForm}
              isLoading={isSubmitting}
            />
          )}
        </main>

        {/* Floating Decorative Elements */}
        <div className="fixed bottom-10 right-10 text-6xl animate-float pointer-events-none opacity-20">
          🍃
        </div>
        <div className="fixed top-1/3 left-10 text-4xl animate-float pointer-events-none opacity-20" style={{ animationDelay: '1s' }}>
          🌿
        </div>
      </div>

      <Footer />
    </ProtectedRoute>
  );
}
