'use client';

import React from 'react';
import { Department, Task, TaskStatus, UserRole } from '@/types';
import { TaskCard } from './TaskCard';
import { Clock, PlayCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  departments: Department[];
  currentRole: UserRole;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onOpenDetail: (task: Task) => void;
}

interface ColumnConfig {
  id: TaskStatus;
  title: string;
  countBadge: string;
  headerBorder: string;
  columnBg: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'pending',
    title: 'รอดำเนินการ',
    countBadge: 'bg-amber-100/80 text-amber-800 ring-1 ring-amber-600/20',
    headerBorder: 'border-t-amber-400',
    columnBg: 'bg-slate-50/60',
    icon: Clock,
    iconColor: 'text-amber-500',
  },
  {
    id: 'in_progress',
    title: 'กำลังดำเนินการ',
    countBadge: 'bg-blue-100/80 text-blue-800 ring-1 ring-blue-600/20',
    headerBorder: 'border-t-blue-500',
    columnBg: 'bg-slate-50/60',
    icon: PlayCircle,
    iconColor: 'text-blue-500',
  },
  {
    id: 'review',
    title: 'รอหัวหน้าตรวจ',
    countBadge: 'bg-purple-100/80 text-purple-800 ring-1 ring-purple-600/20',
    headerBorder: 'border-t-purple-500',
    columnBg: 'bg-purple-50/30',
    icon: AlertCircle,
    iconColor: 'text-purple-500',
  },
  {
    id: 'completed',
    title: 'เสร็จสมบูรณ์',
    countBadge: 'bg-emerald-100/80 text-emerald-800 ring-1 ring-emerald-600/20',
    headerBorder: 'border-t-emerald-500',
    columnBg: 'bg-slate-50/60',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
  },
];

export function TaskBoard({
  tasks,
  departments,
  currentRole,
  onUpdateStatus,
  onOpenDetail,
}: TaskBoardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);
        const Icon = column.icon;

        return (
          <div
            key={column.id}
            className={`flex flex-col rounded-2xl border border-slate-200/80 ${column.columnBg} p-3.5 shadow-xs border-t-4 ${column.headerBorder} transition-all`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-1.5 py-1 mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-2xs">
                  <Icon className={`h-4 w-4 ${column.iconColor}`} />
                </div>
                <h2 className="text-sm font-bold text-slate-800">{column.title}</h2>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${column.countBadge}`}
              >
                {columnTasks.length}
              </span>
            </div>

            {/* Tasks List in Column */}
            <div className="flex flex-1 flex-col gap-3 min-h-[300px]">
              {columnTasks.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/60 p-6 text-center">
                  <p className="text-xs font-medium text-slate-400">ไม่มีงานในสถานะนี้</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    departments={departments}
                    currentRole={currentRole}
                    onUpdateStatus={onUpdateStatus}
                    onOpenDetail={onOpenDetail}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
