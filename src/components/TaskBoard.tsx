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
    countBadge: 'bg-amber-50 text-amber-800 border border-amber-200',
    headerBorder: 'border-t-amber-500',
    columnBg: 'bg-slate-100/70',
    icon: Clock,
    iconColor: 'text-amber-600',
  },
  {
    id: 'in_progress',
    title: 'กำลังดำเนินการ',
    countBadge: 'bg-blue-50 text-blue-800 border border-blue-200',
    headerBorder: 'border-t-blue-600',
    columnBg: 'bg-slate-100/70',
    icon: PlayCircle,
    iconColor: 'text-blue-600',
  },
  {
    id: 'review',
    title: 'รอหัวหน้าตรวจ',
    countBadge: 'bg-indigo-50 text-indigo-800 border border-indigo-200',
    headerBorder: 'border-t-indigo-600',
    columnBg: 'bg-slate-100/70',
    icon: AlertCircle,
    iconColor: 'text-indigo-600',
  },
  {
    id: 'completed',
    title: 'เสร็จสมบูรณ์',
    countBadge: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    headerBorder: 'border-t-emerald-600',
    columnBg: 'bg-slate-100/70',
    icon: CheckCircle2,
    iconColor: 'text-emerald-600',
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
            className={`flex flex-col rounded-xl border border-slate-200 bg-slate-100/60 p-3 shadow-2xs border-t-[3px] ${column.headerBorder}`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-1 py-1 mb-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white border border-slate-200 shadow-2xs">
                  <Icon className={`h-3.5 w-3.5 ${column.iconColor}`} />
                </div>
                <h2 className="text-xs font-bold text-slate-800">{column.title}</h2>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-2xs font-bold ${column.countBadge}`}
              >
                {columnTasks.length}
              </span>
            </div>

            {/* Tasks List in Column */}
            <div className="flex flex-1 flex-col gap-2.5 min-h-[300px]">
              {columnTasks.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white/70 p-6 text-center">
                  <p className="text-xs font-medium text-slate-500">ไม่มีงานในสถานะนี้</p>
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
