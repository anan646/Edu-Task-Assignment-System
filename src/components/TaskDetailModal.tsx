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
  ExternalLink,
  Trash2,
} from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  currentRole: UserRole;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDeleteTask?: (taskId: string) => Promise<void>;
}

const PRIORITY_BADGES: Record<Priority, { label: string; badge: string; dot: string }> = {
  urgent: { label: 'ด่วนที่สุด', badge: 'bg-rose-50 text-rose-700 ring-rose-600/25', dot: 'bg-rose-500' },
  high: { label: 'ด่วน', badge: 'bg-amber-50 text-amber-800 ring-amber-600/25', dot: 'bg-amber-500' },
  normal: { label: 'ปกติ', badge: 'bg-blue-50 text-blue-700 ring-blue-600/25', dot: 'bg-blue-500' },
  low: { label: 'ทั่วไป', badge: 'bg-slate-100 text-slate-600 ring-slate-500/25', dot: 'bg-slate-400' },
};

const STATUS_BADGES: Record<TaskStatus, { label: string; badge: string; dot: string }> = {
  pending: { label: 'รอดำเนินการ', badge: 'bg-amber-50 text-amber-800 ring-amber-600/25', dot: 'bg-amber-500' },
  in_progress: { label: 'กำลังดำเนินการ', badge: 'bg-blue-50 text-blue-700 ring-blue-600/25', dot: 'bg-blue-500' },
  review: { label: 'รอหัวหน้าตรวจ', badge: 'bg-purple-50 text-purple-700 ring-purple-600/25', dot: 'bg-purple-500' },
  completed: { label: 'เสร็จสมบูรณ์', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/25', dot: 'bg-emerald-500' },
};

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  departments,
  currentRole,
  onUpdateTask,
  onDeleteTask,
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

  const handleDelete = async () => {
    if (!onDeleteTask) return;
    if (confirm(`คุณต้องการลบงาน "${task.title}" ออกจากระบบและ Google Sheet ใช่หรือไม่?`)) {
      try {
        setIsUpdating(true);
        await onDeleteTask(task.id);
        onClose();
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl transition-all border border-slate-100 max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                {task.id}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-2xs font-semibold ring-1 ring-inset ${statusInfo.badge}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`}></span>
                {statusInfo.label}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-2xs font-semibold ring-1 ring-inset ${priorityInfo.badge}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${priorityInfo.dot}`}></span>
                {priorityInfo.label}
              </span>
            </div>
            <h2 className="mt-2 text-lg font-bold text-slate-900 leading-snug">{task.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-4 text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100 sm:grid-cols-3">
            <div>
              <span className="text-slate-400 flex items-center gap-1 font-semibold">
                <Building className="h-3.5 w-3.5" /> ฝ่ายที่รับผิดชอบ
              </span>
              <p className="mt-1 font-bold text-slate-800">
                {dept?.name ? dept.name.split(' (')[0] : task.departmentId}
              </p>
            </div>
            <div>
              <span className="text-slate-400 flex items-center gap-1 font-semibold">
                <User className="h-3.5 w-3.5" /> ผู้รับผิดชอบ
              </span>
              <p className="mt-1 font-bold text-slate-800">{task.assignedTo}</p>
            </div>
            <div>
              <span className="text-slate-400 flex items-center gap-1 font-semibold">
                <Calendar className="h-3.5 w-3.5" /> กำหนดส่ง
              </span>
              <p className="mt-1 font-bold text-slate-800">{task.dueDate}</p>
            </div>
            <div>
              <span className="text-slate-400 flex items-center gap-1 font-semibold">
                <User className="h-3.5 w-3.5" /> ผู้สั่งการ
              </span>
              <p className="mt-1 font-medium text-slate-700">{task.assignedBy}</p>
            </div>
            <div>
              <span className="text-slate-400 flex items-center gap-1 font-semibold">
                <Clock className="h-3.5 w-3.5" /> สร้างเมื่อ
              </span>
              <p className="mt-1 text-slate-600">{task.createdAt?.slice(0, 10)}</p>
            </div>
            <div>
              <span className="text-slate-400 flex items-center gap-1 font-semibold">
                <Clock className="h-3.5 w-3.5" /> อัปเดตล่าสุด
              </span>
              <p className="mt-1 text-slate-600">{task.updatedAt?.slice(0, 10)}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-slate-400" /> รายละเอียดงานและข้อกำหนด
            </h3>
            <div className="mt-1.5 rounded-2xl border border-slate-200/90 bg-white p-3.5 text-slate-700 leading-relaxed whitespace-pre-wrap font-normal">
              {task.description || 'ไม่มีคำอธิบายเพิ่มเติม'}
            </div>
          </div>

          {/* Progress Notes / Deliverables */}
          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-slate-400" /> ผลงาน / บันทึกความคืบหน้า (Deliverables &amp; Links)
            </h3>
            <p className="text-2xs text-slate-500 mt-0.5">
              แนบลิงก์ Google Drive, ลิงก์เอกสาร หรือข้อความสรุปผลงานที่นี่
            </p>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เช่น ทำแบบร่างเสร็จแล้ว แนบลิงก์ Drive: https://... หรือบันทึกปัญหาที่พบ"
              className="mt-2 w-full rounded-2xl border border-slate-200/90 bg-slate-50/50 p-3 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <div className="mt-1.5 flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isUpdating}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
              >
                {isUpdating ? 'กำลังบันทึก...' : 'บันทึกข้อความ'}
              </button>
            </div>
          </div>
        </div>

        {/* Action Controls Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>

            {currentRole === 'head' && onDeleteTask && (
              <button
                type="button"
                disabled={isUpdating}
                onClick={handleDelete}
                className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 active:scale-95 transition-colors cursor-pointer"
                title="ลบงานนี้ออกจากระบบ"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>ลบงาน</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Staff Action Options */}
            {currentRole === 'staff' && (
              <>
                {task.status === 'pending' && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleStatusChange('in_progress')}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all cursor-pointer"
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
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-500/25 hover:from-purple-500 hover:to-violet-500 active:scale-95 transition-all cursor-pointer"
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
                      className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 active:scale-95 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>ส่งกลับให้แก้ไข</span>
                    </button>
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleStatusChange('completed')}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/25 hover:from-emerald-500 hover:to-teal-500 active:scale-95 transition-all cursor-pointer"
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
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/25 hover:from-emerald-500 hover:to-teal-500 active:scale-95 transition-all cursor-pointer"
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
