'use client';

import React, { useState } from 'react';
import { Department, Priority, Task, TaskStatus, UserRole } from '@/types';
import {
  X,
  Calendar,
  Building,
  User,
  CheckCircle2,
  RotateCcw,
  PlayCircle,
  FileText,
  Send,
  MessageSquare,
  Clock,
} from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  currentRole: UserRole;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
}

const PRIORITY_BADGES: Record<Priority, { label: string; badge: string }> = {
  urgent: { label: 'ด่วนที่สุด', badge: 'bg-rose-50 text-rose-700 ring-rose-600/20' },
  high: { label: 'ด่วน', badge: 'bg-amber-50 text-amber-800 ring-amber-600/20' },
  normal: { label: 'ปกติ', badge: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
  low: { label: 'ทั่วไป', badge: 'bg-zinc-100 text-zinc-600 ring-zinc-500/20' },
};

const STATUS_BADGES: Record<TaskStatus, { label: string; badge: string }> = {
  pending: { label: 'รอดำเนินการ', badge: 'bg-amber-50 text-amber-800 ring-amber-600/20' },
  in_progress: { label: 'กำลังดำเนินการ', badge: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
  review: { label: 'รอหัวหน้าตรวจ', badge: 'bg-purple-50 text-purple-700 ring-purple-600/20' },
  completed: { label: 'เสร็จสมบูรณ์', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
};

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  departments,
  currentRole,
  onUpdateTask,
}: TaskDetailModalProps) {
  const [notes, setNotes] = useState(task?.notes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync notes when task changes
  React.useEffect(() => {
    if (task) {
      setNotes(task.notes || '');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const dept = departments.find((d) => d.id === task.departmentId);
  const priorityInfo = PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.normal;
  const statusInfo = STATUS_BADGES[task.status] || STATUS_BADGES.pending;

  const handleSaveNotes = async () => {
    try {
      setIsUpdating(true);
      await onUpdateTask(task.id, { notes });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      setIsUpdating(true);
      await onUpdateTask(task.id, { status: newStatus, notes });
      onClose();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div
        className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-zinc-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-zinc-400">{task.id}</span>
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-2xs font-semibold ring-1 ring-inset ${statusInfo.badge}`}
              >
                {statusInfo.label}
              </span>
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-2xs font-medium ring-1 ring-inset ${priorityInfo.badge}`}
              >
                {priorityInfo.label}
              </span>
            </div>
            <h2 className="mt-1.5 text-lg font-bold text-zinc-900 leading-snug">{task.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4 text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 rounded-xl bg-zinc-50 p-3.5 sm:grid-cols-3">
            <div>
              <span className="text-zinc-400 flex items-center gap-1 font-medium">
                <Building className="h-3.5 w-3.5" /> ฝ่ายที่รับผิดชอบ
              </span>
              <p className="mt-1 font-semibold text-zinc-800">
                {dept?.name ? dept.name.split(' (')[0] : task.departmentId}
              </p>
            </div>
            <div>
              <span className="text-zinc-400 flex items-center gap-1 font-medium">
                <User className="h-3.5 w-3.5" /> ผู้รับผิดชอบ
              </span>
              <p className="mt-1 font-semibold text-zinc-800">{task.assignedTo}</p>
            </div>
            <div>
              <span className="text-zinc-400 flex items-center gap-1 font-medium">
                <Calendar className="h-3.5 w-3.5" /> กำหนดส่ง
              </span>
              <p className="mt-1 font-semibold text-zinc-800">{task.dueDate}</p>
            </div>
            <div>
              <span className="text-zinc-400 flex items-center gap-1 font-medium">
                <User className="h-3.5 w-3.5" /> ผู้สั่งการ
              </span>
              <p className="mt-1 font-medium text-zinc-700">{task.assignedBy}</p>
            </div>
            <div>
              <span className="text-zinc-400 flex items-center gap-1 font-medium">
                <Clock className="h-3.5 w-3.5" /> สร้างเมื่อ
              </span>
              <p className="mt-1 text-zinc-600">{task.createdAt?.slice(0, 10)}</p>
            </div>
            <div>
              <span className="text-zinc-400 flex items-center gap-1 font-medium">
                <Clock className="h-3.5 w-3.5" /> อัปเดตล่าสุด
              </span>
              <p className="mt-1 text-zinc-600">{task.updatedAt?.slice(0, 10)}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-zinc-800 flex items-center gap-1">
              <FileText className="h-4 w-4 text-zinc-400" /> รายละเอียดงานและข้อกำหนด
            </h3>
            <div className="mt-1.5 rounded-lg border border-zinc-200 bg-white p-3 text-zinc-700 leading-relaxed whitespace-pre-wrap">
              {task.description || 'ไม่มีคำอธิบายเพิ่มเติม'}
            </div>
          </div>

          {/* Progress Notes / Deliverables */}
          <div>
            <h3 className="font-semibold text-zinc-800 flex items-center gap-1">
              <MessageSquare className="h-4 w-4 text-zinc-400" /> ผลงาน / บันทึกความคืบหน้า (Deliverables & Links)
            </h3>
            <p className="text-2xs text-zinc-400 mt-0.5">
              สามารถแนบลิงก์ Google Drive, ลิงก์เอกสาร หรือข้อความสรุปผลงานได้ที่นี่
            </p>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เช่น ทำแบบร่างเสร็จแล้ว แนบลิงก์ Drive: https://... หรือบันทึกปัญหาที่พบ"
              className="mt-1.5 w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-800 focus:border-blue-500 focus:outline-hidden"
            />
            <div className="mt-1 flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isUpdating}
                className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-2xs font-medium text-zinc-700 hover:bg-zinc-50"
              >
                {isUpdating ? 'กำลังบันทึก...' : 'บันทึกข้อความ'}
              </button>
            </div>
          </div>
        </div>

        {/* Action Controls Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-200 px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
          >
            ปิดหน้าต่าง
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {/* Staff Action Options */}
            {currentRole === 'staff' && (
              <>
                {task.status === 'pending' && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleStatusChange('in_progress')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span>กดรับงานและเริ่มทำ</span>
                  </button>
                )}
                {task.status === 'in_progress' && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleStatusChange('review')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500"
                  >
                    <Send className="h-4 w-4" />
                    <span>ส่งให้หัวหน้าตรวจงาน</span>
                  </button>
                )}
              </>
            )}

            {/* Manager / Head Action Options */}
            {currentRole === 'head' && (
              <>
                {task.status === 'review' && (
                  <>
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleStatusChange('in_progress')}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>ส่งกลับให้แก้ไข</span>
                    </button>
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleStatusChange('completed')}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>อนุมัติงาน (เสร็จสมบูรณ์)</span>
                    </button>
                  </>
                )}
                {task.status !== 'review' && task.status !== 'completed' && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleStatusChange('completed')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>บันทึกว่าเสร็จสิ้นแล้ว</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
