'use client';

import React, { useState } from 'react';
import { Task } from '@/types/task';
import { formatDateTime, isOverdue, isUpcoming } from '@/lib/datetime';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check, Trash2, Edit2, Calendar, Clock, RefreshCw, AlertTriangle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      onDelete(task.id);
    }
  };

  const handleToggle = async () => {
    if (isToggling) return;

    setIsToggling(true);
    try {
      await onToggle(task.id);
    } finally {
      setTimeout(() => setIsToggling(false), 500);
    }
  };

  const getRecurringLabel = () => {
    if (!task.recurring) return null;

    const { type, day_of_week, time } = task.recurring;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    if (type === 'weekly' && day_of_week !== undefined) {
      return `Every ${days[day_of_week]}${time ? ` at ${time}` : ''}`;
    } else if (type === 'daily') {
      return `Daily${time ? ` at ${time}` : ''}`;
    } else if (type === 'monthly') {
      return `Monthly${time ? ` at ${time}` : ''}`;
    }
    return null;
  };

  const statusColor = isOverdue(task.deadline, task.completed)
    ? 'border-destructive/50 bg-destructive/5'
    : isUpcoming(task.deadline) && !task.completed
      ? 'border-yellow-500/50 bg-yellow-500/5'
      : 'border-white/10';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("overflow-hidden transition-all duration-300 group", statusColor, task.completed && "opacity-60")}>
        <CardContent className="p-5 flex items-start gap-4">
          <div className="relative pt-1">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handleToggle}
              disabled={isToggling}
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                task.completed
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-slate-500 hover:border-primary",
                isToggling && "opacity-50 cursor-wait"
              )}
            >
              {task.completed && <Check className="w-3.5 h-3.5" />}
            </motion.button>
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex justify-between items-start gap-2">
              <h3 className={cn(
                "text-lg font-semibold leading-tight transition-all",
                task.completed ? "line-through text-slate-500" : "text-white"
              )}>
                {task.title}
              </h3>
            </div>

            {task.description && (
              <p className={cn("text-sm", task.completed ? "text-slate-600" : "text-slate-400")}>
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              {task.deadline && (
                <div className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                  isOverdue(task.deadline, task.completed)
                    ? "bg-destructive/10 text-destructive border-destructive/20"
                    : isUpcoming(task.deadline) && !task.completed
                      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                )}>
                  {isOverdue(task.deadline, task.completed) ? (
                    <AlertCircle className="w-3.5 h-3.5" />
                  ) : isUpcoming(task.deadline) && !task.completed ? (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  ) : (
                    <Calendar className="w-3.5 h-3.5" />
                  )}
                  {formatDateTime(task.deadline)}
                </div>
              )}

              {getRecurringLabel() && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <RefreshCw className="w-3.5 h-3.5" />
                  {getRecurringLabel()}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
              <span className="flex items-center gap-1">
                Created {new Date(task.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(task)}
              disabled={isDeleting || isToggling}
              className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/10"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting || isToggling}
              className="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
