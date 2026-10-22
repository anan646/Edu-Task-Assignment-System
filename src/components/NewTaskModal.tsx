'use client';

import React, { useState } from 'react';
import { Department, Priority, User } from '@/types';
import { X, Send, AlertCircle, Calendar, UserCheck, Building } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Send className="h-4 w-4" />
            </div>
            <div>
              <h2 id="modal-title" className="text-base font-bold text-zinc-900">
                มอบหมายงานใหม่ (Assign Task)
              </h2>
              <p className="text-xs text-zinc-500">สั่งงานและกำหนดฝ่าย/ผู้รับผิดชอบ</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="task-title" className="block text-xs font-semibold text-zinc-700">
              ชื่องาน / วาระงาน <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="task-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น ออกแบบแบนเนอร์โปรโมชัน Q4, ทำเอกสารจัดซื้อ ฯลฯ"
              className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Department Selection */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="dept-select" className="block text-xs font-semibold text-zinc-700">
                <Building className="inline h-3.5 w-3.5 mr-1 text-zinc-400" />
                มอบหมายให้ฝ่าย <span className="text-rose-500">*</span>
              </label>
              <select
                id="dept-select"
                value={departmentId}
                onChange={(e) => {
                  setDepartmentId(e.target.value);
                  setAssignedTo('');
                }}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-hidden"
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
              <label htmlFor="assignee-input" className="block text-xs font-semibold text-zinc-700">
                <UserCheck className="inline h-3.5 w-3.5 mr-1 text-zinc-400" />
                ผู้รับผิดชอบ <span className="text-rose-500">*</span>
              </label>
              <div className="mt-1 flex flex-col gap-1">
                <input
                  type="text"
                  id="assignee-input"
                  required
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="เช่น คุณสมชาย หรือ ทั้งแผนก"
                  list="assignee-suggestions"
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-hidden"
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
              <label htmlFor="priority-select" className="block text-xs font-semibold text-zinc-700">
                ระดับความสำคัญ
              </label>
              <select
                id="priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-hidden"
              >
                <option value="urgent">🔴 ด่วนที่สุด (Urgent)</option>
                <option value="high">🟠 ด่วน (High)</option>
                <option value="normal">🔵 ปกติ (Normal)</option>
                <option value="low">⚪ ทั่วไป (Low)</option>
              </select>
            </div>

            <div>
              <label htmlFor="due-date" className="block text-xs font-semibold text-zinc-700">
                <Calendar className="inline h-3.5 w-3.5 mr-1 text-zinc-400" />
                กำหนดส่ง (Deadline) <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                id="due-date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-desc" className="block text-xs font-semibold text-zinc-700">
              รายละเอียดงานและคำสั่งการ
            </label>
            <textarea
              id="task-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุข้อกำหนด วัตถุประสงค์ หรือลิงก์เอกสารอ้างอิง..."
              className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Supervisor Name */}
          <div>
            <label htmlFor="supervisor-name" className="block text-xs font-medium text-zinc-500">
              ผู้สั่งการ
            </label>
            <input
              type="text"
              id="supervisor-name"
              value={assignedBy}
              onChange={(e) => setAssignedBy(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-700"
            />
          </div>

          {/* Submit Buttons */}
          <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? 'กำลังบันทึกลงชีต...' : 'มอบหมายงาน'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
