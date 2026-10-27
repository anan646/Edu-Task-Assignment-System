'use client';

import React from 'react';
import { Department, Priority, Task, TaskStatus, UserRole } from '@/types';
import { Calendar, User, ArrowRight, CheckCircle2, RotateCcw, AlertTriangle, MessageSquare, Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  departments: Department[];
  currentRole: UserRole;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onOpenDetail: (task: Task) => void;
}

const PRIORITY_CONFIG: Record<Priority, { label: string; badge: string; dot: string }> = {
  urgent: { label: 'ด่วนที่สุด', badge: 'bg-rose-50 text-rose-700 ring-rose-600/25', dot: 'bg-rose-500' },
  high: { label: 'ด่วน', badge: 'bg-amber-50 text-amber-800 ring-amber-600/25', dot: 'bg-amber-500' },
  normal: { label: 'ปกติ', badge: 'bg-blue-50 text-blue-700 ring-blue-600/25', dot: 'bg-blue-500' },
  low: { label: 'ทั่วไป', badge: 'bg-slate-100 text-slate-600 ring-slate-500/25', dot: 'bg-slate-400' },
};

const DEPT_CONFIG: Record<string, { name: string; badge: string; dot: string }> = {
  it: { name: 'ไอทีและระบบ', badge: 'bg-blue-50 text-blue-700 ring-blue-500/20', dot: 'bg-blue-500' },
  mkt: { name: 'การตลาด', badge: 'bg-pink-50 text-pink-700 ring-pink-500/20', dot: 'bg-pink-500' },
  acc: { name: 'การเงิน/บัญชี', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-500/20', dot: 'bg-emerald-500' },
  hr: { name: 'ฝ่ายบุคคล', badge: 'bg-purple-50 text-purple-700 ring-purple-500/20', dot: 'bg-purple-500' },
  ops: { name: 'ปฏิบัติการ/จัดซื้อ', badge: 'bg-amber-50 text-amber-800 ring-amber-500/20', dot: 'bg-amber-500' },
};

export function TaskCard({
  task,
  departments,
  currentRole,
  onUpdateStatus,
  onOpenDetail,
}: TaskCardProps) {
  const dept = departments.find((d) => d.id === task.departmentId);
  const deptInfo = DEPT_CONFIG[task.departmentId] || {
    name: dept?.name ? dept.name.split(' (')[0] : task.departmentId,
    badge: 'bg-slate-100 text-slate-700 ring-slate-400/20',
    dot: 'bg-slate-500',
  };
  const priorityInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.normal;

  // Due date calculation
  const [today, setToday] = React.useState('');
  React.useEffect(() => {
    setToday(new Date().toISOString().split('T')[0]);
  }, []);

  const isOverdue = Boolean(today && task.status !== 'completed' && task.dueDate < today);
  const isDueToday = Boolean(today && task.dueDate === today);

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-200">
      {/* Top Bar: Dept Badge + Priority + Task ID */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-2xs font-semibold ring-1 ring-inset ${deptInfo.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${deptInfo.dot}`}></span>
              {deptInfo.name}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-semibold ring-1 ring-inset ${priorityInfo.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${priorityInfo.dot}`}></span>
              {priorityInfo.label}
            </span>
          </div>
          <span className="font-mono text-2xs font-bold text-slate-400">
            {task.id}
          </span>
        </div>

        {/* Task Title & Description */}
        <button
          type="button"
          onClick={() => onOpenDetail(task)}
          className="mt-3 block text-left group-hover:text-blue-600 transition-colors w-full cursor-pointer"
        >
          <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
            {task.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
            {task.description || 'ไม่มีคำอธิบายเพิ่มเติม'}
          </p>
        </button>

        {/* Notes preview if exists */}
        {task.notes && (
          <div className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-slate-50 p-2 text-2xs text-slate-600 border border-slate-100">
            <MessageSquare className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
            <span className="line-clamp-1 italic">{task.notes}</span>
          </div>
        )}
      </div>

      {/* Bottom Info: Due Date & Assignee */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs">
          {/* Due date */}
          <div
            className={`flex items-center gap-1.5 text-2xs font-medium ${
              isOverdue
                ? 'font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md ring-1 ring-rose-200'
                : isDueToday
                ? 'font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md ring-1 ring-amber-200'
                : 'text-slate-500'
            }`}
          >
            {isOverdue ? (
              <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
            ) : (
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
            )}
            <span>
              {isOverdue ? `เกินกำหนด (${task.dueDate})` : isDueToday ? 'ส่งวันนี้' : task.dueDate}
            </span>
          </div>

          {/* Assignee */}
          <div className="flex items-center gap-1.5 text-slate-600" title={`มอบหมายโดย: ${task.assignedBy}`}>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-2xs font-semibold text-slate-700">
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
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 active:scale-95 transition-all cursor-pointer"
                >
                  <span>เริ่มทำงาน</span>
                  <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                </button>
              )}
              {task.status === 'in_progress' && (
                <button
                  type="button"
                  onClick={() => onOpenDetail(task)}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-purple-50 px-3 py-2 text-xs font-bold text-purple-700 hover:bg-purple-100 active:scale-95 transition-all cursor-pointer"
                >
                  <span>ส่งตรวจงาน</span>
                  <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                </button>
              )}
              {task.status === 'review' && (
                <span className="w-full text-center text-2xs font-semibold text-purple-700 bg-purple-50/70 py-1.5 rounded-xl border border-purple-200/60">
                  ⏳ อยู่ระหว่างรอหัวหน้าตรวจ
                </span>
              )}
              {task.status === 'completed' && (
                <span className="inline-flex w-full items-center justify-center gap-1 text-2xs font-semibold text-emerald-700 bg-emerald-50/70 py-1.5 rounded-xl border border-emerald-200/60">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> เสร็จสมบูรณ์แล้ว
                </span>
              )}
            </>
          )}

          {/* Head / Manager actions */}
          {currentRole === 'head' && (
            <>
              {task.status === 'review' && (
                <div className="flex w-full items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(task.id, 'in_progress')}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 active:scale-95 transition-all cursor-pointer"
                    title="ส่งกลับให้พนักงานแก้ไข"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>ตีกลับ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(task.id, 'completed')}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1.5 text-xs font-semibold text-white shadow-xs active:scale-95 transition-all cursor-pointer"
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
                  className="inline-flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
                >
                  <span>ดูรายละเอียด / แก้ไข</span>
                </button>
              )}

              {task.status === 'in_progress' && (
                <button
                  type="button"
                  onClick={() => onOpenDetail(task)}
                  className="inline-flex w-full items-center justify-center gap-1 rounded-xl border border-blue-200/80 bg-blue-50/50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100/80 transition-all cursor-pointer"
                >
                  <span>ติดตามความคืบหน้า</span>
                </button>
              )}

              {task.status === 'completed' && (
                <button
                  type="button"
                  onClick={() => onOpenDetail(task)}
                  className="inline-flex w-full items-center justify-center gap-1 text-2xs font-semibold text-emerald-700 hover:underline py-1"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
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
