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

const STATUS_CONFIG: Record<TaskStatus, { label: string; badge: string }> = {
  pending: { label: 'รอดำเนินการ', badge: 'bg-amber-50 text-amber-800 ring-amber-600/20' },
  in_progress: { label: 'กำลังทำ', badge: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
  review: { label: 'รอตรวจ', badge: 'bg-purple-50 text-purple-700 ring-purple-600/20' },
  completed: { label: 'เสร็จสิ้น', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
};

const PRIORITY_LABELS: Record<Priority, { label: string; color: string }> = {
  urgent: { label: 'ด่วนที่สุด', color: 'text-rose-600' },
  high: { label: 'ด่วน', color: 'text-amber-600' },
  normal: { label: 'ปกติ', color: 'text-blue-600' },
  low: { label: 'ทั่วไป', color: 'text-zinc-500' },
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
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-600">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-2xs uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-semibold">รหัส / ชื่องาน</th>
              <th className="px-4 py-3 font-semibold">ฝ่าย</th>
              <th className="px-4 py-3 font-semibold">ผู้รับผิดชอบ</th>
              <th className="px-4 py-3 font-semibold">ความเร่งด่วน</th>
              <th className="px-4 py-3 font-semibold">กำหนดส่ง</th>
              <th className="px-4 py-3 font-semibold">สถานะ</th>
              <th className="px-4 py-3 text-right font-semibold">การกระทำ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">
                  ไม่พบรายการงานที่ตรงกับเงื่อนไข
                </td>
              </tr>
            ) : (
              tasks.map((task) => {
                const dept = departments.find((d) => d.id === task.departmentId);
                const statusInfo = STATUS_CONFIG[task.status];
                const priorityInfo = PRIORITY_LABELS[task.priority];
                const isOverdue = task.status !== 'completed' && task.dueDate < today;

                return (
                  <tr
                    key={task.id}
                    className="hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                    onClick={() => onOpenDetail(task)}
                  >
                    {/* Title & ID */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-2xs font-semibold text-zinc-400">
                          {task.id}
                        </span>
                        <span className="font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {task.title}
                        </span>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-2xs font-medium text-zinc-700">
                        {dept?.name ? dept.name.split(' (')[0] : task.departmentId}
                      </span>
                    </td>

                    {/* Assignee */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-medium text-zinc-800">{task.assignedTo}</span>
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`font-semibold ${priorityInfo.color}`}>
                        {priorityInfo.label}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 ${
                          isOverdue ? 'font-semibold text-rose-600' : 'text-zinc-600'
                        }`}
                      >
                        {isOverdue && <AlertTriangle className="h-3 w-3" />}
                        {task.dueDate}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-2xs font-semibold ring-1 ring-inset ${statusInfo.badge}`}
                      >
                        {statusInfo.label}
                      </span>
                    </td>

                    {/* Action */}
                    <td
                      className="px-4 py-3 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {currentRole === 'head' && task.status === 'review' && (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(task.id, 'in_progress')}
                            className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-2xs font-medium text-amber-800 hover:bg-amber-100"
                          >
                            ตีกลับ
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(task.id, 'completed')}
                            className="rounded-md bg-emerald-600 px-2 py-1 text-2xs font-medium text-white hover:bg-emerald-500"
                          >
                            อนุมัติ
                          </button>
                        </div>
                      )}

                      {currentRole === 'staff' && task.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(task.id, 'in_progress')}
                          className="rounded-md bg-blue-50 px-2 py-1 text-2xs font-medium text-blue-700 hover:bg-blue-100"
                        >
                          เริ่มทำ
                        </button>
                      )}

                      {currentRole === 'staff' && task.status === 'in_progress' && (
                        <button
                          type="button"
                          onClick={() => onOpenDetail(task)}
                          className="rounded-md bg-purple-50 px-2 py-1 text-2xs font-medium text-purple-700 hover:bg-purple-100"
                        >
                          ส่งตรวจ
                        </button>
                      )}

                      {((currentRole === 'head' && task.status !== 'review') ||
                        (currentRole === 'staff' && (task.status === 'review' || task.status === 'completed'))) && (
                        <button
                          type="button"
                          onClick={() => onOpenDetail(task)}
                          className="text-2xs font-medium text-zinc-500 hover:text-blue-600 underline"
                        >
                          รายละเอียด
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
