'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Department, Priority, Task, TaskStatus, User, UserRole } from '@/types';
import { Header } from '@/components/Header';
import { StatCards } from '@/components/StatCards';
import { TaskFilters } from '@/components/TaskFilters';
import { TaskBoard } from '@/components/TaskBoard';
import { TaskTable } from '@/components/TaskTable';
import { NewTaskModal } from '@/components/NewTaskModal';
import { TaskDetailModal } from '@/components/TaskDetailModal';
import { GoogleSheetsSetupGuide } from '@/components/GoogleSheetsSetupGuide';
import { BackupModal } from '@/components/BackupModal';
import { Loader2, Plus, Sparkles, RefreshCw, Sheet } from 'lucide-react';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isSheetsConnected, setIsSheetsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter States
  const [currentRole, setCurrentRole] = useState<UserRole>('head');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'all'>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');

  // Modal States
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null);

  // Fetch initial tasks
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
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filtered tasks computation
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filter by Department
      if (selectedDepartment !== 'all' && task.departmentId !== selectedDepartment) {
        return false;
      }
      // Filter by Status
      if (selectedStatus !== 'all' && task.status !== selectedStatus) {
        return false;
      }
      // Filter by Priority
      if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
        return false;
      }
      // Filter by Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchDesc = task.description.toLowerCase().includes(query);
        const matchAssignee = task.assignedTo.toLowerCase().includes(query);
        const matchId = task.id.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchAssignee && !matchId) {
          return false;
        }
      }
      return true;
    });
  }, [tasks, selectedDepartment, selectedStatus, selectedPriority, searchQuery]);

  // Handler: Create task
  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    departmentId: string;
    assignedTo: string;
    assignedBy: string;
    priority: Priority;
    dueDate: string;
    notes?: string;
  }) => {
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

  // Handler: Update status
  const handleUpdateStatus = async (taskId: string, newStatus: TaskStatus) => {
    // Optimistic UI update
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
      if (!data.success) {
        fetchTasks(false);
      }
    } catch (err) {
      console.error(err);
      fetchTasks(false);
    }
  };

  // Handler: Update full task
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
        if (selectedTaskDetail?.id === taskId) {
          setSelectedTaskDetail(data.task);
        }
      }
    } catch (err) {
      console.error(err);
      fetchTasks(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50/70 to-slate-100/80 font-sans text-slate-900 flex flex-col">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenNewTaskModal={() => setIsNewTaskOpen(true)}
        onOpenGuideModal={() => setIsGuideOpen(true)}
        onOpenBackupModal={() => setIsBackupOpen(true)}
        isSheetsConnected={isSheetsConnected}
      />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 space-y-6">
        {/* Banner notification for Demo Mode or Connected */}
        {!isSheetsConnected && !isLoading ? (
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-amber-200/90 bg-amber-50/80 p-4 shadow-xs backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700 shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-amber-900">
                  ระบบพร้อมสำรองข้อมูลลง Google Sheet:
                </span>{' '}
                <span className="text-amber-800">
                  คุณสามารถกดปุ่ม <strong>&quot;สำรองข้อมูลชีต&quot;</strong> เพื่อซิงค์งานทั้งหมดลงในชีตของคุณ หรือดาวน์โหลดเป็นไฟล์ CSV ได้ทันที
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsBackupOpen(true)}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-sm shrink-0 transition-all cursor-pointer"
            >
              สำรองข้อมูลเดี๋ยวนี้
            </button>
          </div>
        ) : isSheetsConnected && !isLoading ? (
          <div className="flex items-center justify-between rounded-2xl border border-emerald-200/80 bg-emerald-50/60 px-4 py-2.5 text-xs text-emerald-800 shadow-2xs">
            <div className="flex items-center gap-2">
              <Sheet className="h-4 w-4 text-emerald-600" />
              <span>
                เชื่อมต่อกับ Google Sheet สำเร็จ • ระบบจะซิงค์ข้อมูลงาน <strong>{tasks.length} รายการ</strong> แบบเรียลไทม์
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsBackupOpen(true)}
              className="font-bold text-emerald-700 hover:text-emerald-900 underline text-2xs cursor-pointer"
            >
              จัดการการสำรองข้อมูล →
            </button>
          </div>
        ) : null}

        {/* Role Information Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-white p-4 border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-bold shadow-xs ${
                currentRole === 'head'
                  ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-500/20'
                  : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20'
              }`}
            >
              {currentRole === 'head' ? '👔' : '👷'}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span>โหมดสิทธิ์การใช้งาน:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-2xs font-extrabold ${
                    currentRole === 'head'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {currentRole === 'head'
                    ? 'หัวหน้าฝ่าย / ผู้บริหาร (Manager View)'
                    : 'พนักงาน / ผู้ปฏิบัติงาน (Staff View)'}
                </span>
              </div>
              <p className="text-2xs text-slate-500 mt-0.5 font-normal">
                {currentRole === 'head'
                  ? 'สามารถสั่งงานใหม่, มอบหมายงานข้ามฝ่าย, อนุมัติงาน หรือตีกลับงานที่ส่งมาให้แก้ไข'
                  : 'สามารถดูงานที่ได้รับมอบหมาย, กดเริ่มทำงาน, และส่งงานให้หัวหน้าตรวจพร้อมแนบลิงก์ผลงาน'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={() => fetchTasks(false)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer"
              title="ดึงข้อมูลล่าสุดจาก Google Sheet"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
              <span>รีเฟรชข้อมูล</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatCards
          tasks={tasks}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
        />

        {/* Filter Toolbar */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
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

        {/* Tasks View: Kanban Board or Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-xs font-semibold">กำลังโหลดรายการงานจาก Google Sheet...</p>
          </div>
        ) : (
          <div>
            <div className="mb-3.5 flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-medium">
                แสดงผล <strong className="text-slate-800">{filteredTasks.length}</strong> จากทั้งหมด{' '}
                <strong className="text-slate-800">{tasks.length}</strong> งาน
              </span>
            </div>

            {viewMode === 'board' ? (
              <TaskBoard
                tasks={filteredTasks}
                departments={departments}
                currentRole={currentRole}
                onUpdateStatus={handleUpdateStatus}
                onOpenDetail={setSelectedTaskDetail}
              />
            ) : (
              <TaskTable
                tasks={filteredTasks}
                departments={departments}
                currentRole={currentRole}
                onUpdateStatus={handleUpdateStatus}
                onOpenDetail={setSelectedTaskDetail}
              />
            )}
          </div>
        )}
      </main>

      {/* Floating Action Button on Mobile */}
      <button
        type="button"
        onClick={() => setIsNewTaskOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/35 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all md:hidden cursor-pointer"
        title="สั่งงานใหม่"
      >
        <Plus className="h-6 w-6 stroke-[2.5]" />
      </button>

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
        currentRole={currentRole}
        onUpdateTask={handleUpdateTask}
      />

      <GoogleSheetsSetupGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        isConfigured={isSheetsConnected}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        tasks={tasks}
        sheetId="1g1ynWNSsHnd6Ta9rSolO6Fx6AXVRVuItgr0taKb2HMg"
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400 font-medium">
        ระบบมอบหมายงานองค์กร • เชื่อมต่อ Google Sheets &amp; Vercel • ใช้งานได้ทุกอุปกรณ์
      </footer>
    </div>
  );
}
