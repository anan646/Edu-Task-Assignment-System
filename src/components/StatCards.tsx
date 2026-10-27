'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types';
import { Clock, PlayCircle, CheckCircle2, AlertCircle, Layers } from 'lucide-react';

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
      desc: 'ทุกสถานะในระบบ',
      icon: Layers,
      accentBorder: 'bg-slate-500',
      activeRing: 'ring-2 ring-slate-800 bg-slate-50 shadow-xs',
      iconBox: 'bg-slate-100 text-slate-700',
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'pending' as TaskStatus,
      title: 'รอดำเนินการ',
      count: pending,
      desc: total > 0 ? `${Math.round((pending / total) * 100)}% ของงานทั้งหมด` : '0%',
      icon: Clock,
      accentBorder: 'bg-amber-500',
      activeRing: 'ring-2 ring-amber-500 bg-amber-50/50 shadow-xs',
      iconBox: 'bg-amber-100 text-amber-800',
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200',
    },
    {
      id: 'in_progress' as TaskStatus,
      title: 'กำลังดำเนินการ',
      count: inProgress,
      desc: total > 0 ? `${Math.round((inProgress / total) * 100)}% ของงานทั้งหมด` : '0%',
      icon: PlayCircle,
      accentBorder: 'bg-blue-600',
      activeRing: 'ring-2 ring-blue-600 bg-blue-50/50 shadow-xs',
      iconBox: 'bg-blue-100 text-blue-800',
      badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200',
    },
    {
      id: 'review' as TaskStatus,
      title: 'รอหัวหน้าตรวจ',
      count: review,
      desc: review > 0 ? 'ต้องการการตรวจสอบ' : 'ไม่มีงานรอตรวจ',
      icon: AlertCircle,
      accentBorder: 'bg-indigo-600',
      activeRing: 'ring-2 ring-indigo-600 bg-indigo-50/50 shadow-xs',
      iconBox: 'bg-indigo-100 text-indigo-800',
      badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    },
    {
      id: 'completed' as TaskStatus,
      title: 'เสร็จสมบูรณ์',
      count: completed,
      desc: total > 0 ? `${Math.round((completed / total) * 100)}% สำเร็จแล้ว` : '0%',
      icon: CheckCircle2,
      accentBorder: 'bg-emerald-600',
      activeRing: 'ring-2 ring-emerald-600 bg-emerald-50/50 shadow-xs',
      iconBox: 'bg-emerald-100 text-emerald-800',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = selectedStatus === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectStatus(card.id as TaskStatus | 'all')}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 text-left shadow-xs transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-md ${
              isActive ? card.activeRing : 'hover:border-slate-300'
            }`}
          >
            {/* Top accent line */}
            <div className={`absolute inset-x-0 top-0 h-1 ${card.accentBorder}`} />

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-800 transition-colors">
                {card.title}
              </span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${card.iconBox}`}>
                <Icon className="h-5 w-5 stroke-[2.2]" />
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                  {card.count}
                </span>
                <span className="text-xs text-slate-400 font-normal">งาน</span>
              </div>
              <p className="mt-1 text-2xs font-medium text-slate-500 truncate">
                {card.desc}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
