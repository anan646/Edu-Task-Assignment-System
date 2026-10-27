'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Department, Priority, Task, TaskStatus } from '@/types';
import { PortalNavbar } from '@/components/PortalNavbar';
import { StatCards } from '@/components/StatCards';
import { TaskFilters } from '@/components/TaskFilters';
import { TaskBoard } from '@/components/TaskBoard';
import { TaskTable } from '@/components/TaskTable';
import { TaskDetailModal } from '@/components/TaskDetailModal';
import { BackupModal } from '@/components/BackupModal';
import { Loader2, User as UserIcon, RefreshCw, CheckCircle, Send, UserCheck } from 'lucide-react';

export default function StaffPortal() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [isSheetsConnected, setIsSheetsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'all'>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');

  // Modals
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null);

  const fetchTasks = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      else setIsRefreshing(true);

      const res = await fetch('/api/tasks');
      const data = await res.json();

      if (data.success) {
        setTasks(data.tasks);
        setDepartments(data.departments);
        setUsers(data.users || []);
        setIsSheetsConnected(Boolean(data.config?.isConfigured));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Compute unique assignees from tasks and user directory
  const distinctAssignees = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.assignedTo) set.add(t.assignedTo.trim());
    });
    users.forEach((u) => {
      if (u.name) set.add(u.name.trim());
    });
    return Array.from(set).sort();
  }, [tasks, users]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (selectedDepartment !== 'all' && task.departmentId !== selectedDepartment) return false;
      if (selectedStatus !== 'all' && task.status !== selectedStatus) return false;
      if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;
      if (selectedAssignee !== 'all' && !task.assignedTo.toLowerCase().includes(selectedAssignee.toLowerCase())) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchDesc = task.description.toLowerCase().includes(query);
        const matchAssignee = task.assignedTo.toLowerCase().includes(query);
        const matchId = task.id.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchAssignee && !matchId) return false;
      }
      return true;
    });
  }, [tasks, selectedDepartment, selectedStatus, selectedPriority, searchQuery, selectedAssignee]);

  const handleUpdateStatus = async (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t))
    );
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) fetchTasks(false);
    } catch (err) {
      fetchTasks(false);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success && data.task) {
        setTasks((prev) => prev.map((t) => (t.id === taskId ? data.task : t)));
        if (selectedTaskDetail?.id === taskId) setSelectedTaskDetail(data.task);
      }
    } catch (err) {
      fetchTasks(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <PortalNavbar
        onOpenBackupModal={() => setIsBackupOpen(true)}
        isSheetsConnected={isSheetsConnected}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 space-y-6">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <UserIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">
                  พอร์ทัลพนักงาน / ผู้ปฏิบัติงาน (Staff Workspace)
                </h1>
                <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-2xs font-bold text-emerald-700 border border-emerald-200/60">
                  สิทธิ์ผู้ปฏิบัติงาน
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">
                คุณสามารถตรวจดูกล่องงานที่ได้รับมอบหมาย, กดปุ่ม <strong>&quot;เริ่มทำงาน&quot;</strong>, และส่งผลงานพร้อมแนบลิงก์ Google Drive ให้หัวหน้าตรวจ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center">
            <button
              type="button"
              onClick={() => fetchTasks(false)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
              <span>รีเฟรช</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <StatCards
          tasks={tasks}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
        />

        {/* Staff User Selector Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-white p-3.5 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800">
                เลือกมุมมองพนักงาน (Assignee Filter):
              </span>
              <p className="text-2xs text-slate-400">เลือกชื่อของคุณเพื่อดูกล่องงานเฉพาะตัว หรือเลือกดูงานทั้งหมด</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all cursor-pointer shadow-2xs"
            >
              <option value="all">👥 ดูงานของทุกคนในองค์กร ({tasks.length} งาน)</option>
              {distinctAssignees.map((name) => {
                const count = tasks.filter((t) => t.assignedTo?.toLowerCase().includes(name.toLowerCase())).length;
                return (
                  <option key={name} value={name}>
                    👤 {name} ({count} งาน)
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <TaskFilters
            departments={departments}
            selectedDepartment={selectedDepartment}
            onSelectDepartment={setSelectedDepartment}
            selectedPriority={selectedPriority}
            onSelectPriority={setSelectedPriority}
            selectedStatus={selectedStatus}
            onSelectStatus={setSelectedStatus}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>

        {/* Task View */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="text-xs font-semibold">กำลังโหลดข้อมูลงาน...</p>
          </div>
        ) : (
          <div>
            <div className="mb-3.5 flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                แสดงผล <strong className="text-slate-800">{filteredTasks.length}</strong> จากทั้งหมด{' '}
                <strong className="text-slate-800">{tasks.length}</strong> งาน
              </span>
            </div>

            {viewMode === 'board' ? (
              <TaskBoard
                tasks={filteredTasks}
                departments={departments}
                currentRole="staff"
                onUpdateStatus={handleUpdateStatus}
                onOpenDetail={setSelectedTaskDetail}
              />
            ) : (
              <TaskTable
                tasks={filteredTasks}
                departments={departments}
                currentRole="staff"
                onUpdateStatus={handleUpdateStatus}
                onOpenDetail={setSelectedTaskDetail}
              />
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <TaskDetailModal
        task={selectedTaskDetail}
        isOpen={Boolean(selectedTaskDetail)}
        onClose={() => setSelectedTaskDetail(null)}
        departments={departments}
        currentRole="staff"
        onUpdateTask={handleUpdateTask}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        tasks={tasks}
        sheetId="1g1ynWNSsHnd6Ta9rSolO6Fx6AXVRVuItgr0taKb2HMg"
      />
    </div>
  );
}
