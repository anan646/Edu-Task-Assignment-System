'use client';

import React, { useState } from 'react';
import { Department, Priority, User } from '@/types';
import { X, Send, AlertCircle, Calendar, UserCheck, Building, Sparkles } from 'lucide-react';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  users: User[];
  onCreateTask: (taskData: {
    title: string;
    description: string;
    departmentId: string;
    assignedTo: string;
    assignedBy: string;
    priority: Priority;
    dueDate: string;
    notes?: string;
  }) => Promise<void>;
}

export function NewTaskModal({
  isOpen,
  onClose,
  departments,
  users,
  onCreateTask,
}: NewTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || 'it');
  const [assignedTo, setAssignedTo] = useState('');
  const [assignedBy, setAssignedBy] = useState('หัวหน้างาน (Supervisor)');
  const [priority, setPriority] = useState<Priority>('normal');
  const [dueDate, setDueDate] = useState('');

  React.useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    setDueDate(d.toISOString().split('T')[0]);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter users by selected department for convenient selection
  const deptUsers = users.filter((u) => u.departmentId === departmentId);
  const currentDept = departments.find((d) => d.id === departmentId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('กรุณากรอกชื่องาน');
      return;
    }
    if (!assignedTo.trim()) {
      setError('กรุณาเลือกหรือระบุผู้รับผิดชอบ');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onCreateTask({
        title: title.trim(),
        description: description.trim(),
        departmentId,
        assignedTo: assignedTo.trim(),
        assignedBy: assignedBy.trim(),
        priority,
        dueDate,
      });

      // Reset form
      setTitle('');
      setDescription('');
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการบันทึกงาน กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl transition-all border border-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 id="modal-title" className="text-base font-bold text-slate-900">
                มอบหมายงานใหม่ (Assign Task)
              </h2>
              <p className="text-xs text-slate-500 font-normal">สั่งงาน ระบุฝ่าย และกำหนดวันส่งมอบ</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Title */}
          <div>
            <label htmlFor="task-title" className="block text-xs font-bold text-slate-700">
              ชื่องาน / วาระงาน <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="task-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น ออกแบบแบนเนอร์โปรโมชัน Q4, จัดทำรายงานการเงินประจำปี ฯลฯ"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* Department Selection */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="dept-select" className="block text-xs font-bold text-slate-700">
                <Building className="inline h-3.5 w-3.5 mr-1 text-slate-400" />
                มอบหมายให้ฝ่าย <span className="text-rose-500">*</span>
              </label>
              <select
                id="dept-select"
                value={departmentId}
                onChange={(e) => {
                  setDepartmentId(e.target.value);
                  setAssignedTo('');
                }}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label htmlFor="assignee-input" className="block text-xs font-bold text-slate-700">
                <UserCheck className="inline h-3.5 w-3.5 mr-1 text-slate-400" />
                ผู้รับผิดชอบ <span className="text-rose-500">*</span>
              </label>
              <div className="mt-1.5 flex flex-col gap-1">
                <input
                  type="text"
                  id="assignee-input"
                  required
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="เช่น คุณกิตติศักดิ์ หรือ ทั้งแผนก"
                  list="assignee-suggestions"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <datalist id="assignee-suggestions">
                  <option value={`${currentDept?.name?.split(' (')[0] || 'แผนก'} (ทั้งแผนก)`} />
                  {deptUsers.map((u) => (
                    <option key={u.id} value={u.name} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* Priority & Due Date */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="priority-select" className="block text-xs font-bold text-slate-700">
                ระดับความสำคัญ
              </label>
              <select
                id="priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="urgent">🔴 ด่วนที่สุด (Urgent)</option>
                <option value="high">🟠 ด่วน (High)</option>
                <option value="normal">🔵 ปกติ (Normal)</option>
                <option value="low">⚪ ทั่วไป (Low)</option>
              </select>
            </div>

            <div>
              <label htmlFor="due-date" className="block text-xs font-bold text-slate-700">
                <Calendar className="inline h-3.5 w-3.5 mr-1 text-slate-400" />
                กำหนดส่ง (Deadline) <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                id="due-date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-desc" className="block text-xs font-bold text-slate-700">
              รายละเอียดงานและคำสั่งการ
            </label>
            <textarea
              id="task-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุข้อกำหนด วัตถุประสงค์ หรือลิงก์เอกสารอ้างอิง..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* Supervisor Name */}
          <div>
            <label htmlFor="supervisor-name" className="block text-xs font-medium text-slate-500">
              ผู้สั่งการ
            </label>
            <input
              type="text"
              id="supervisor-name"
              value={assignedBy}
              onChange={(e) => setAssignedBy(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-100/70 px-3.5 py-2 text-xs text-slate-700 font-medium"
            />
          </div>

          {/* Submit Buttons */}
          <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? 'กำลังบันทึกลงชีต...' : 'บันทึกและสั่งงาน'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
