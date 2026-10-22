'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types';
import { Clock, PlayCircle, CheckCircle, AlertCircle, FileText } from 'lucide-react';

interface StatCardsProps {
  tasks: Task[];
  selectedStatus: TaskStatus | 'all';
  onSelectStatus: (status: TaskStatus | 'all') => void;
}

export function StatCards({ tasks, selectedStatus, onSelectStatus }: StatCardsProps) {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const review = tasks.filter((t) => t.status === 'review').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;

  const cards = [
    {
      id: 'all',
      title: 'งานทั้งหมด',
      count: total,
      icon: FileText,
      color: 'border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50',
      activeColor: 'ring-2 ring-zinc-800 bg-zinc-50',
      iconColor: 'text-zinc-600 bg-zinc-100',
    },
    {
      id: 'pending' as TaskStatus,
      title: 'รอดำเนินการ',
      count: pending,
      icon: Clock,
      color: 'border-amber-200 text-amber-900 bg-white hover:bg-amber-50/50',
      activeColor: 'ring-2 ring-amber-500 bg-amber-50/50',
      iconColor: 'text-amber-600 bg-amber-100',
    },
    {
      id: 'in_progress' as TaskStatus,
      title: 'กำลังทำ',
      count: inProgress,
      icon: PlayCircle,
      color: 'border-blue-200 text-blue-900 bg-white hover:bg-blue-50/50',
      activeColor: 'ring-2 ring-blue-500 bg-blue-50/50',
      iconColor: 'text-blue-600 bg-blue-100',
    },
    {
      id: 'review' as TaskStatus,
      title: 'รอหัวหน้าตรวจ',
      count: review,
      icon: AlertCircle,
      color: 'border-purple-200 text-purple-900 bg-white hover:bg-purple-50/50',
      activeColor: 'ring-2 ring-purple-500 bg-purple-50/50',
      iconColor: 'text-purple-600 bg-purple-100',
    },
    {
      id: 'completed' as TaskStatus,
      title: 'เสร็จสมบูรณ์',
      count: completed,
      icon: CheckCircle,
      color: 'border-emerald-200 text-emerald-900 bg-white hover:bg-emerald-50/50',
      activeColor: 'ring-2 ring-emerald-500 bg-emerald-50/50',
      iconColor: 'text-emerald-600 bg-emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = selectedStatus === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectStatus(card.id as TaskStatus | 'all')}
            className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all cursor-pointer shadow-2xs ${card.color} ${
              isActive ? card.activeColor : ''
            }`}
          >
            <div>
              <p className="text-xs font-medium text-zinc-500">{card.title}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900">{card.count}</p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconColor}`}>
              <Icon className="h-5 w-5" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
