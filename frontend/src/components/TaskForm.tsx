'use client';

import React, { useState, useEffect } from 'react';
import { Task, TaskCreate, TaskUpdate } from '@/types/task';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: TaskCreate | TaskUpdate) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function TaskForm({ task, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [recurrenceDays, setRecurrenceDays] = useState<string[]>([]);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');
  const [error, setError] = useState('');

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setIsRecurring(task.is_recurring || false);
      setRecurrenceType(task.recurrence_type || 'weekly');
      setRecurrenceInterval(task.recurrence_interval || 1);
      setRecurrenceDays(task.recurrence_days ? task.recurrence_days.split(',') : []);
      
      if (task.deadline) {
        const date = new Date(task.deadline);
        const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        setDeadline(localDateTime);
      }
      
      if (task.recurrence_end_date) {
        const endDate = new Date(task.recurrence_end_date);
        const localEndDate = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        setRecurrenceEndDate(localEndDate);
      }
    }
  }, [task]);

  const toggleWeekDay = (day: string) => {
    setRecurrenceDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (isRecurring && recurrenceType === 'weekly' && recurrenceDays.length === 0) {
      setError('Please select at least one day for weekly recurrence');
      return;
    }

    const formData: TaskCreate | TaskUpdate = {
      title: title.trim(),
      description: description.trim(),
      deadline: deadline ? new Date(deadline).toISOString() : null,
      is_recurring: isRecurring,
      recurrence_type: isRecurring ? recurrenceType : null,
      recurrence_interval: isRecurring ? recurrenceInterval : null,
      recurrence_days: isRecurring && recurrenceType === 'weekly' ? recurrenceDays.join(',') : null,
      recurrence_end_date: isRecurring && recurrenceEndDate ? new Date(recurrenceEndDate).toISOString() : null,
    };

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="jungle-card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scaleIn">
        <div className="sticky top-0 bg-gradient-to-r from-[var(--jungle-secondary)] to-[var(--jungle-accent)] text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">🌿</span>
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl animate-slideIn">
              <span className="font-semibold">⚠️ {error}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2 animate-slideIn" style={{ animationDelay: '0.1s' }}>
            <label htmlFor="title" className="block text-sm font-semibold text-[var(--jungle-dark)]">
              📝 Task Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="jungle-input w-full"
              placeholder="e.g., Weekly team meeting"
              maxLength={200}
              disabled={isLoading}
              required
            />
            <p className="text-xs text-gray-500">{title.length}/200 characters</p>
          </div>

          {/* Description */}
          <div className="space-y-2 animate-slideIn" style={{ animationDelay: '0.2s' }}>
            <label htmlFor="description" className="block text-sm font-semibold text-[var(--jungle-dark)]">
              📄 Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="jungle-input w-full min-h-[100px] resize-y"
              placeholder="Add more details about this task..."
              maxLength={1000}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">{description.length}/1000 characters</p>
          </div>

          {/* Deadline */}
          <div className="space-y-2 animate-slideIn" style={{ animationDelay: '0.3s' }}>
            <label htmlFor="deadline" className="block text-sm font-semibold text-[var(--jungle-dark)]">
              ⏰ Deadline
            </label>
            <input
              id="deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="jungle-input w-full"
              disabled={isLoading}
            />
          </div>

          {/* Recurring Task Toggle */}
          <div className="jungle-card p-4 bg-gradient-to-br from-[var(--jungle-mist)] to-transparent animate-slideIn" style={{ animationDelay: '0.4s' }}>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-[var(--jungle-accent)] text-[var(--jungle-accent)] focus:ring-2 focus:ring-[var(--jungle-accent)] focus:ring-offset-2"
                disabled={isLoading}
              />
              <span className="font-semibold text-[var(--jungle-dark)] flex items-center gap-2">
                🔄 Make this a recurring task
              </span>
            </label>
          </div>

          {/* Recurrence Options */}
          {isRecurring && (
            <div className="space-y-4 jungle-card p-6 bg-gradient-to-br from-[var(--jungle-bg)] to-white animate-scaleIn">
              <h3 className="font-bold text-[var(--jungle-dark)] flex items-center gap-2">
                <span>⚙️</span> Recurrence Settings
              </h3>

              {/* Recurrence Type */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--jungle-dark)]">
                  Repeat Pattern
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['daily', 'weekly', 'monthly'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setRecurrenceType(type)}
                      className={`p-3 rounded-xl font-semibold transition-all ${
                        recurrenceType === type
                          ? 'bg-gradient-to-br from-[var(--jungle-secondary)] to-[var(--jungle-accent)] text-white shadow-lg scale-105'
                          : 'bg-white border-2 border-[var(--jungle-light)] hover:border-[var(--jungle-accent)]'
                      }`}
                      disabled={isLoading}
                    >
                      {type === 'daily' && '📅'}
                      {type === 'weekly' && '📆'}
                      {type === 'monthly' && '🗓️'}
                      <br />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interval */}
              <div className="space-y-2">
                <label htmlFor="interval" className="block text-sm font-semibold text-[var(--jungle-dark)]">
                  Repeat Every
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="interval"
                    type="number"
                    min="1"
                    max="30"
                    value={recurrenceInterval}
                    onChange={(e) => setRecurrenceInterval(parseInt(e.target.value) || 1)}
                    className="jungle-input w-24 text-center font-bold text-lg"
                    disabled={isLoading}
                  />
                  <span className="text-[var(--jungle-dark)] font-medium">
                    {recurrenceType === 'daily' && 'day(s)'}
                    {recurrenceType === 'weekly' && 'week(s)'}
                    {recurrenceType === 'monthly' && 'month(s)'}
                  </span>
                </div>
              </div>

              {/* Weekly Days Selection */}
              {recurrenceType === 'weekly' && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[var(--jungle-dark)]">
                    Repeat On
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleWeekDay(day)}
                        className={`p-3 rounded-xl font-bold transition-all ${
                          recurrenceDays.includes(day)
                            ? 'bg-gradient-to-br from-[var(--jungle-secondary)] to-[var(--jungle-accent)] text-white shadow-md scale-105'
                            : 'bg-white border-2 border-[var(--jungle-light)] hover:border-[var(--jungle-accent)]'
                        }`}
                        disabled={isLoading}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* End Date */}
              <div className="space-y-2">
                <label htmlFor="recurrence-end" className="block text-sm font-semibold text-[var(--jungle-dark)]">
                  End Recurrence (Optional)
                </label>
                <input
                  id="recurrence-end"
                  type="datetime-local"
                  value={recurrenceEndDate}
                  onChange={(e) => setRecurrenceEndDate(e.target.value)}
                  className="jungle-input w-full"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 jungle-button relative overflow-hidden"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>💾</span>
                  {task ? 'Update Task' : 'Create Task'}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
