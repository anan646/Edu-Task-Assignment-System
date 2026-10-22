'use client';

import React from 'react';
import { Department, Priority, Task, TaskStatus, UserRole } from '@/types';
import { Calendar, User, ArrowRight, CheckCircle2, RotateCcw, AlertTriangle, MessageSquare } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  departments: Department[];
  currentRole: UserRole;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onOpenDetail: (task: Task) => void;
}

const PRIORITY_CONFIG: Record<Priority, { label: string; badge: string }> = {
  urgent: { label: 'ด่วนที่สุด', badge: 'bg-rose-50 text-rose-700 ring-rose-600/20' },
  high: { label: 'ด่วน', badge: 'bg-amber-50 text-amber-800 ring-amber-600/20' },
  normal: { label: 'ปกติ', badge: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
  low: { label: 'ทั่วไป', badge: 'bg-zinc-100 text-zinc-600 ring-zinc-500/20' },
};

const DEPT_COLORS: Record<string, string> = {
  it: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  mkt: 'bg-pink-50 text-pink-700 ring-pink-600/20',
  acc: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  hr: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  ops: 'bg-amber-50 text-amber-800 ring-amber-600/20',
};

export function TaskCard({
  task,
  departments,
  currentRole,
  onUpdateStatus,
  onOpenDetail,
}: TaskCardProps) {
  const dept = departments.find((d) => d.id === task.departmentId);
  const deptBadgeStyle = DEPT_COLORS[task.departmentId] || 'bg-zinc-100 text-zinc-700 ring-zinc-500/20';
  const priorityInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.normal;

  // Due date calculation
  const [today, setToday] = React.useState('');
  React.useEffect(() => {
    setToday(new Date().toISOString().split('T')[0]);
  }, []);

  const isOverdue = Boolean(today && task.status !== 'completed' && task.dueDate < today);
  const isDueToday = Boolean(today && task.dueDate === today);

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs hover:border-zinc-300 hover:shadow-md transition-all">
      {/* Top Bar: Dept + Priority + Task ID */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-2xs font-semibold ring-1 ring-inset ${deptBadgeStyle}`}
            >
              {dept?.name ? dept.name.split(' (')[0] : task.departmentId}
            </span>
            <span
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-2xs font-medium ring-1 ring-inset ${priorityInfo.badge}`}
            >
              {priorityInfo.label}
            </span>
          </div>
          <span className="text-2xs font-mono font-medium text-zinc-400">
            {task.id}
          </span>
        </div>

        {/* Task Title & Description */}
        <button
          type="button"
          onClick={() => onOpenDetail(task)}
          className="mt-2.5 block text-left group-hover:text-blue-600 transition-colors w-full cursor-pointer"
        >
          <h3 className="text-sm font-semibold text-zinc-900 leading-snug line-clamp-2">
            {task.title}
          </h3>
          <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        </button>

        {/* Notes preview if exists */}
        {task.notes && (
          <div className="mt-2 flex items-start gap-1 rounded-md bg-zinc-50 p-1.5 text-2xs text-zinc-600">
            <MessageSquare className="h-3 w-3 shrink-0 text-zinc-400 mt-0.5" />
            <span className="line-clamp-1 italic">{task.notes}</span>
          </div>
        )}
      </div>

      {/* Bottom Info: Due Date & Assignee */}
      <div className="mt-3.5 pt-3 border-t border-zinc-100">
        <div className="flex items-center justify-between text-xs">
          {/* Due date */}
          <div
            className={`flex items-center gap-1 ${
              isOverdue
                ? 'font-semibold text-rose-600'
                : isDueToday
                ? 'font-medium text-amber-600'
                : 'text-zinc-500'
            }`}
          >
            {isOverdue ? (
              <AlertTriangle className="h-3.5 w-3.5" />
            ) : (
              <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            )}
            <span>
              {isOverdue ? `เกินกำหนด (${task.dueDate})` : isDueToday ? 'ส่งวันนี้' : task.dueDate}
            </span>
          </div>

          {/* Assignee */}
          <div className="flex items-center gap-1.5 text-zinc-600" title={`มอบหมายโดย: ${task.assignedBy}`}>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-2xs font-bold text-zinc-700">
              {task.assignedTo ? task.assignedTo.charAt(0) : 'U'}
            </div>
            <span className="truncate max-w-[110px] text-2xs font-medium">
              {task.assignedTo}
            </span>
          </div>
        </div>

        {/* Action Buttons based on Role & Status */}
        <div className="mt-3 flex items-center justify-end gap-1.5">
          {/* Staff actions */}
          {currentRole === 'staff' && (
            <>
              {task.status === 'pending' && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(task.id, 'in_progress')}
                  className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-blue-50 px-2 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <span>เริ่มทำงาน</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
              {task.status === 'in_progress' && (
                <button
                  type="button"
                  onClick={() => onOpenDetail(task)}
                  className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-purple-50 px-2 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-colors"
                >
                  <span>ส่งตรวจงาน</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
              {task.status === 'review' && (
                <span className="w-full text-center text-2xs font-medium text-purple-600 py-1">
                  ⏳ อยู่ระหว่างรอหัวหน้าตรวจ
                </span>
              )}
              {task.status === 'completed' && (
                <span className="inline-flex w-full items-center justify-center gap-1 text-2xs font-medium text-emerald-600 py-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> เสร็จสมบูรณ์แล้ว
                </span>
              )}
            </>
          )}

          {/* Head / Manager actions */}
          {currentRole === 'head' && (
            <>
              {task.status === 'review' && (
                <div className="flex w-full items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(task.id, 'in_progress')}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
                    title="ส่งกลับให้พนักงานแก้ไข"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>ตีกลับ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(task.id, 'completed')}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-600 px-2 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-2xs transition-colors"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>อนุมัติ</span>
                  </button>
                </div>
              )}

              {task.status === 'pending' && (
                <button
                  type="button"
                  onClick={() => onOpenDetail(task)}
                  className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
                >
                  <span>ดูรายละเอียด / แก้ไข</span>
                </button>
              )}

              {task.status === 'in_progress' && (
                <button
                  type="button"
                  onClick={() => onOpenDetail(task)}
                  className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-blue-100 bg-blue-50/50 px-2 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <span>ติดตามความคืบหน้า</span>
                </button>
              )}

              {task.status === 'completed' && (
                <button
                  type="button"
                  onClick={() => onOpenDetail(task)}
                  className="inline-flex w-full items-center justify-center gap-1 text-2xs font-medium text-emerald-700 hover:underline py-1"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>ดูผลงานที่ส่งมอบ</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
