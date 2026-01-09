'use client';

import React, { useState } from 'react';
import { Task } from '@/types/task';
import { formatDateTime, isOverdue, isUpcoming } from '@/lib/datetime';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      onDelete(task.id);
    }
  };

  const getRecurrenceText = () => {
    if (!task.is_recurring) return null;
    
    let text = '🔄 Repeats ';
    if (task.recurrence_interval && task.recurrence_interval > 1) {
      text += `every ${task.recurrence_interval} `;
    }
    
    if (task.recurrence_type === 'daily') {
      text += task.recurrence_interval === 1 ? 'daily' : 'days';
    } else if (task.recurrence_type === 'weekly') {
      text += task.recurrence_interval === 1 ? 'weekly' : 'weeks';
      if (task.recurrence_days) {
        text += ` on ${task.recurrence_days}`;
      }
    } else if (task.recurrence_type === 'monthly') {
      text += task.recurrence_interval === 1 ? 'monthly' : 'months';
    }
    
    return text;
  };

  const getDeadlineStyle = () => {
    if (!task.deadline || task.completed) return '';
    if (isOverdue(task.deadline)) return 'text-red-600 font-semibold';
    if (isUpcoming(task.deadline)) return 'text-orange-500 font-semibold';
    return 'text-gray-600';
  };

  return (
    <div
      className={`jungle-card p-5 mb-4 transition-all duration-300 animate-slideIn ${
        task.completed ? 'task-complete opacity-75' : ''
      } ${isDeleting ? 'opacity-0 scale-95' : 'hover:scale-[1.01]'}`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className="flex-shrink-0 mt-1 relative group"
        >
          <div className={`w-6 h-6 rounded-lg border-2 transition-all ${
            task.completed
              ? 'bg-gradient-to-br from-[var(--jungle-secondary)] to-[var(--jungle-accent)] border-[var(--jungle-accent)]'
              : 'border-[var(--jungle-light)] hover:border-[var(--jungle-accent)] group-hover:scale-110'
          }`}>
            {task.completed && (
              <svg
                className="w-full h-full text-white animate-scaleIn"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold mb-1 transition-all ${
            task.completed ? 'line-through text-gray-500' : 'text-[var(--jungle-dark)]'
          }`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={`text-sm mb-3 ${
              task.completed ? 'line-through text-gray-400' : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap gap-3 text-xs">
            {task.deadline && (
              <span className={`flex items-center gap-1 px-3 py-1 rounded-full bg-white shadow-sm ${getDeadlineStyle()}`}>
                <span>⏰</span>
                {formatDateTime(task.deadline)}
                {isOverdue(task.deadline) && !task.completed && <span className="ml-1">⚠️</span>}
              </span>
            )}
            
            {task.is_recurring && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 font-medium shadow-sm">
                {getRecurrenceText()}
              </span>
            )}
            
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 text-gray-500">
              <span>📅</span>
              Created {formatDateTime(task.created_at)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-all hover:scale-110 group"
            title="Edit task"
          >
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-all hover:scale-110 group"
            title="Delete task"
          >
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
