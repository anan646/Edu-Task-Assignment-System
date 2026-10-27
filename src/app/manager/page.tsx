'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Department, Priority, Task, TaskStatus, User } from '@/types';
import { PortalNavbar } from '@/components/PortalNavbar';
import { StatCards } from '@/components/StatCards';
import { TaskFilters } from '@/components/TaskFilters';
import { TaskBoard } from '@/components/TaskBoard';
import { TaskTable } from '@/components/TaskTable';
import { NewTaskModal } from '@/components/NewTaskModal';
import { TaskDetailModal } from '@/components/TaskDetailModal';
import { BackupModal } from '@/components/BackupModal';
import { Loader2, Plus, ShieldCheck, RefreshCw } from 'lucide-react';

export default function ManagerPortal() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
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
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
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
        setUsers(data.users);
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

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (selectedDepartment !== 'all' && task.departmentId !== selectedDepartment) return false;
      if (selectedStatus !== 'all' && task.status !== selectedStatus) return false;
      if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;
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
  }, [tasks, selectedDepartment, selectedStatus, selectedPriority, searchQuery]);

  const handleCreateTask = async (taskData: any) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    const data = await res.json();
    if (data.success && data.task) {
      setTasks((prev) => [data.task, ...prev]);
    } else {
      throw new Error(data.error || 'Failed to create task');
    }
  };

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

  const handleDeleteTask = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) fetchTasks(false);
    } catch (err) {
      fetchTasks(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <PortalNavbar
        onOpenNewTaskModal={() => setIsNewTaskOpen(true)}
        onOpenBackupModal={() => setIsBackupOpen(true)}
        isSheetsConnected={isSheetsConnected}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 space-y-6">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">
                  พอร์ทัลหัวหน้าฝ่าย / ผู้บริหาร (Manager Portal)
                </h1>
                <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-2xs font-bold text-blue-700 border border-blue-200/60">
                  สิทธิ์ผู้สั่งการ
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">
                คุณสามารถกดปุ่ม <strong>&quot;+ สั่งงานใหม่&quot;</strong>, มอบหมายงานข้ามฝ่าย, อนุมัติงาน หรือตีกลับงานที่ส่งมาให้แก้ไขได้
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
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-slate-600' : ''}`} />
              <span>รีเฟรช</span>
            </button>
            <button
              type="button"
              onClick={() => setIsNewTaskOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.2]" />
              <span>สั่งงานใหม่</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <StatCards
          tasks={tasks}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
        />

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
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
                currentRole="head"
                onUpdateStatus={handleUpdateStatus}
                onOpenDetail={setSelectedTaskDetail}
              />
            ) : (
              <TaskTable
                tasks={filteredTasks}
                departments={departments}
                currentRole="head"
                onUpdateStatus={handleUpdateStatus}
                onOpenDetail={setSelectedTaskDetail}
              />
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        departments={departments}
        users={users}
        onCreateTask={handleCreateTask}
      />

      <TaskDetailModal
        task={selectedTaskDetail}
        isOpen={Boolean(selectedTaskDetail)}
        onClose={() => setSelectedTaskDetail(null)}
        departments={departments}
        currentRole="head"
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
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
