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
import { Loader2, Plus, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

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
        // Rollback on failure
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
    <div className="min-h-screen bg-zinc-100/60 font-sans text-zinc-900 flex flex-col">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenNewTaskModal={() => setIsNewTaskOpen(true)}
        onOpenGuideModal={() => setIsGuideOpen(true)}
        isSheetsConnected={isSheetsConnected}
      />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 space-y-6">
        {/* Banner notification for Demo Mode */}
        {!isSheetsConnected && !isLoading && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-5 w-5 shrink-0 text-amber-600" />
              <div className="text-xs">
                <span className="font-semibold text-amber-900">
                  ระบบกำลังทำงานในโหมดทดลองใช้งาน (Demo Data):
                </span>{' '}
                <span className="text-amber-800">
                  คุณสามารถลองกดสั่งงาน ตรวจงาน เปลี่ยนสถานะได้ทันที และสามารถต่อ Google Sheet จริงได้ทุกเมื่อ
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500 shadow-2xs shrink-0 transition-colors"
            >
              ดูวิธีเชื่อม Google Sheet
            </button>
          </div>
        )}

        {/* Role Information Card */}
        <div className="flex items-center justify-between rounded-xl bg-white p-3.5 border border-zinc-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold ${
                currentRole === 'head'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {currentRole === 'head' ? '👔' : '👷'}
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-900">
                โหมดปัจจุบัน:{' '}
                <span className={currentRole === 'head' ? 'text-blue-700' : 'text-emerald-700'}>
                  {currentRole === 'head'
                    ? 'หัวหน้าฝ่าย / ผู้บริหาร (Manager View)'
                    : 'พนักงาน / ผู้ปฏิบัติงาน (Staff View)'}
                </span>
              </div>
              <p className="text-2xs text-zinc-500">
                {currentRole === 'head'
                  ? 'คุณสามารถกดปุ่ม "สั่งงานใหม่", มอบหมายงานให้แต่ละฝ่าย, อนุมัติงาน หรือตีกลับงานที่ส่งมาได้'
                  : 'คุณสามารถดูงานที่ได้รับมอบหมาย, กดเริ่มทำงาน, และส่งงานให้หัวหน้าตรวจพร้อมแนบลิงก์ผลงาน'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchTasks(false)}
            disabled={isRefreshing}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 p-1.5 rounded-md hover:bg-zinc-100 transition-colors"
            title="รีเฟรชข้อมูลล่าสุด"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden sm:inline">รีเฟรช</span>
          </button>
        </div>

        {/* Stats Cards */}
        <StatCards
          tasks={tasks}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
        />

        {/* Filter Toolbar */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xs">
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
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium">กำลังโหลดรายการงานจากระบบ...</p>
          </div>
        ) : (
          <div>
            <div className="mb-3 flex items-center justify-between text-xs text-zinc-500">
              <span>
                แสดงผล <strong>{filteredTasks.length}</strong> จากทั้งหมด <strong>{tasks.length}</strong> งาน
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
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-500/30 hover:bg-blue-500 focus-visible:outline-hidden md:hidden"
        title="สั่งงานใหม่"
      >
        <Plus className="h-6 w-6" />
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

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200 bg-white py-4 text-center text-xs text-zinc-400">
        ระบบมอบหมายงานองค์กร • ทำงานร่วมกับ Google Sheets &amp; Vercel • รองรับการสั่งงานข้ามฝ่าย
      </footer>
    </div>
  );
}
