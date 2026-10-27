'use client';

import React from 'react';
import { Department, Priority, Task, TaskStatus, UserRole } from '@/types';
import { Calendar, AlertTriangle, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

interface TaskTableProps {
  tasks: Task[];
  departments: Department[];
  currentRole: UserRole;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onOpenDetail: (task: Task) => void;
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; badge: string; dot: string }> = {
  pending: { label: 'รอดำเนินการ', badge: 'bg-amber-50 text-amber-800 ring-amber-600/25', dot: 'bg-amber-500' },
  in_progress: { label: 'กำลังดำเนินการ', badge: 'bg-blue-50 text-blue-700 ring-blue-600/25', dot: 'bg-blue-500' },
  review: { label: 'รอตรวจ', badge: 'bg-purple-50 text-purple-700 ring-purple-600/25', dot: 'bg-purple-500' },
  completed: { label: 'เสร็จสมบูรณ์', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/25', dot: 'bg-emerald-500' },
};

const PRIORITY_LABELS: Record<Priority, { label: string; color: string; dot: string }> = {
  urgent: { label: 'ด่วนที่สุด', color: 'text-rose-600 font-bold', dot: 'bg-rose-500' },
  high: { label: 'ด่วน', color: 'text-amber-600 font-bold', dot: 'bg-amber-500' },
  normal: { label: 'ปกติ', color: 'text-blue-600 font-medium', dot: 'bg-blue-500' },
  low: { label: 'ทั่วไป', color: 'text-slate-500 font-normal', dot: 'bg-slate-400' },
};

export function TaskTable({
  tasks,
  departments,
  currentRole,
  onUpdateStatus,
  onOpenDetail,
}: TaskTableProps) {
  const [today, setToday] = React.useState('');
  React.useEffect(() => {
    setToday(new Date().toISOString().split('T')[0]);
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-2xs uppercase tracking-wider text-slate-500 font-bold">
            <tr>
              <th className="px-5 py-3.5">รหัส / ชื่องาน</th>
              <th className="px-4 py-3.5">ฝ่าย</th>
              <th className="px-4 py-3.5">ผู้รับผิดชอบ</th>
              <th className="px-4 py-3.5">ความเร่งด่วน</th>
              <th className="px-4 py-3.5">กำหนดส่ง</th>
              <th className="px-4 py-3.5">สถานะ</th>
              <th className="px-5 py-3.5 text-right">การกระทำ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                  ไม่พบรายการงานที่ตรงกับเงื่อนไข
                </td>
              </tr>
            ) : (
              tasks.map((task) => {
                const dept = departments.find((d) => d.id === task.departmentId);
                const statusInfo = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
                const priorityInfo = PRIORITY_LABELS[task.priority] || PRIORITY_LABELS.normal;
                const isOverdue = Boolean(today && task.status !== 'completed' && task.dueDate < today);

                return (
                  <tr
                    key={task.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => onOpenDetail(task)}
                  >
                    {/* Title & ID */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-2xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          {task.id}
                        </span>
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {task.title}
                        </span>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-2xs font-semibold text-slate-700">
                        {dept?.name ? dept.name.split(' (')[0] : task.departmentId}
                      </span>
                    </td>

                    {/* Assignee */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-2xs font-bold text-slate-700">
                          {task.assignedTo ? task.assignedTo.charAt(0) : 'U'}
                        </div>
                        <span className="font-medium text-slate-800">{task.assignedTo}</span>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${priorityInfo.dot}`}></span>
                        <span className={priorityInfo.color}>
                          {priorityInfo.label}
                        </span>
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 ${
                          isOverdue
                            ? 'font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md ring-1 ring-rose-200'
                            : 'text-slate-600'
                        }`}
                      >
                        {isOverdue && <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />}
                        {task.dueDate}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-2xs font-semibold ring-1 ring-inset ${statusInfo.badge}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`}></span>
                        {statusInfo.label}
                      </span>
                    </td>

                    {/* Action */}
                    <td
                      className="px-5 py-3.5 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {currentRole === 'head' && task.status === 'review' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(task.id, 'in_progress')}
                            className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-2xs font-bold text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                          >
                            ตีกลับ
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(task.id, 'completed')}
                            className="rounded-lg bg-emerald-600 px-2.5 py-1 text-2xs font-bold text-white hover:bg-emerald-500 shadow-2xs transition-colors cursor-pointer"
                          >
                            อนุมัติ
                          </button>
                        </div>
                      )}

                      {currentRole === 'staff' && task.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(task.id, 'in_progress')}
                          className="rounded-lg bg-blue-50 px-2.5 py-1 text-2xs font-bold text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          เริ่มทำ
                        </button>
                      )}

                      {currentRole === 'staff' && task.status === 'in_progress' && (
                        <button
                          type="button"
                          onClick={() => onOpenDetail(task)}
                          className="rounded-lg bg-purple-50 px-2.5 py-1 text-2xs font-bold text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer"
                        >
                          ส่งตรวจ
                        </button>
                      )}

                      {((currentRole === 'head' && task.status !== 'review') ||
                        (currentRole === 'staff' && (task.status === 'review' || task.status === 'completed'))) && (
                        <button
                          type="button"
                          onClick={() => onOpenDetail(task)}
                          className="text-2xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
                        >
                          ดูรายละเอียด →
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
