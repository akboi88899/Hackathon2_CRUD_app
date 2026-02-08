'use client';

import React from 'react';
import { Task } from '@/types/task';
import TaskItem from './TaskItem';
import { AnimatePresence, motion } from 'framer-motion';

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  isLoading: boolean;
}

export default function TaskList({ tasks, onToggle, onDelete, onEdit, isLoading }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-16 space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse rounded-full h-8 w-8 bg-primary/20"></div>
          </div>
        </div>
        <p className="text-slate-400 font-medium animate-pulse">Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20"
      >
        <div className="mb-6 text-7xl animate-bounce">✨</div>
        <h3 className="text-2xl font-bold text-white mb-2">No tasks found</h3>
        <p className="text-slate-400 text-lg">Create your first task to get started!</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
