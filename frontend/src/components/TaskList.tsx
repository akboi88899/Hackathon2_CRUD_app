'use client';

import React from 'react';
import { Task } from '@/types/task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  isLoading: boolean;
}

export default function TaskList({ tasks, onToggle, onDelete, onEdit, isLoading }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="jungle-card p-5 animate-pulse">
            <div className="flex gap-4">
              <div className="w-6 h-6 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4 loading-skeleton" />
                <div className="h-4 bg-gray-100 rounded w-full loading-skeleton" />
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-100 rounded-full w-32 loading-skeleton" />
                  <div className="h-6 bg-gray-100 rounded-full w-24 loading-skeleton" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 animate-fadeIn">
        <div className="inline-block animate-float mb-6">
          <span className="text-9xl block">🌱</span>
        </div>
        <h3 className="text-3xl font-bold text-[var(--jungle-dark)] mb-3">
          Your productivity jungle is empty!
        </h3>
        <p className="text-lg text-gray-600 mb-2">
          Plant your first task seed and watch it grow 🌿
        </p>
        <p className="text-sm text-gray-500">
          Click the "➕ New Task" button to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="animate-slideIn"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <TaskItem
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      ))}
    </div>
  );
}
