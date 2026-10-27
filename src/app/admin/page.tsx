'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Department, Task, User } from '@/types';
import { PortalNavbar } from '@/components/PortalNavbar';
import { BackupModal } from '@/components/BackupModal';
import {
  LayoutDashboard,
  Sheet,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Download,
  CloudUpload,
  ExternalLink,
  Users,
  Building,
  RefreshCw,
  Loader2,
  FileSpreadsheet,
  BarChart3,
} from 'lucide-react';

export default function AdminDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isSheetsConnected, setIsSheetsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // Table Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [today, setToday] = useState('');
  useEffect(() => {
    setToday(new Date().toISOString().split('T')[0]);
  }, []);

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

  // Compute analytics
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const review = tasks.filter((t) => t.status === 'review').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const overdue = tasks.filter((t) => today && t.status !== 'completed' && t.dueDate < today).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Department analytics
  const deptStats = departments.map((d) => {
    const deptTasks = tasks.filter((t) => t.departmentId === d.id);
    const deptDone = deptTasks.filter((t) => t.status === 'completed').length;
    const rate = deptTasks.length > 0 ? Math.round((deptDone / deptTasks.length) * 100) : 0;
    return {
      ...d,
      total: deptTasks.length,
      done: deptDone,
      rate,
    };
  });

  const handleDownloadCSV = () => {
    const headers = ['ID', 'ชื่องาน', 'รายละเอียด', 'ฝ่าย', 'ผู้รับผิดชอบ', 'ผู้สั่งการ', 'ความเร่งด่วน', 'สถานะ', 'กำหนดส่ง', 'ผลงาน/บันทึก', 'สร้างเมื่อ', 'อัปเดตเมื่อ'];
    const rows = tasks.map((t) => [
      `"${t.id}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      `"${t.departmentId}"`,
      `"${t.assignedTo}"`,
      `"${t.assignedBy}"`,
      `"${t.priority}"`,
      `"${t.status}"`,
      `"${t.dueDate}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
      `"${t.createdAt}"`,
      `"${t.updatedAt}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `สำรองข้อมูลแอดมิน_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <PortalNavbar
        onOpenBackupModal={() => setIsBackupOpen(true)}
        isSheetsConnected={isSheetsConnected}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 space-y-6">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">
                  แดชบอร์ดผู้ดูแลระบบ (Admin Executive Dashboard)
                </h1>
                <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-2xs font-bold text-slate-700 border border-slate-200">
                  สิทธิ์ผู้ดูแลระบบ
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">
                วิเคราะห์ประสิทธิภาพองค์กร, สรุปภาระงานแต่ละฝ่าย, และควบคุมฐานข้อมูล Google Sheets
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
              <span>รีเฟรชข้อมูล</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>ดาวน์โหลด CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setIsBackupOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
            >
              <CloudUpload className="h-4 w-4" />
              <span>สำรองข้อมูลชีต</span>
            </button>
          </div>
        </div>

        {/* 4 High-level Executive KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>งานทั้งหมดในองค์กร</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                <BarChart3 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-slate-900">{total}</span>
              <p className="text-2xs text-slate-400 mt-1">แบ่งเป็น 5 ฝ่ายหลัก</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>อัตราความสำเร็จ (KPI)</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-emerald-600">{completionRate}%</span>
              <p className="text-2xs text-slate-400 mt-1">{completed} จากทั้งหมด {total} งาน</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>งานคั่งค้าง / รอตรวจ</span>
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-indigo-700">{review + inProgress}</span>
              <p className="text-2xs text-indigo-600 mt-1">รอตรวจ {review} • กำลังทำ {inProgress}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>งานเกินกำหนดส่ง (Overdue)</span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-100">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-rose-600">{overdue}</span>
              <p className="text-2xs text-rose-500 mt-1">ต้องเร่งรัดติดตาม</p>
            </div>
          </div>
        </div>

        {/* 2 Big Panels: Department Progress & Google Sheet Infrastructure */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Breakdown (2 cols) */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
                  <Building className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-900">
                    ความคืบหน้าและภาระงานแยกตามฝ่าย (Department Performance)
                  </h2>
                  <p className="text-2xs text-slate-400">สัดส่วนงานที่เสร็จสิ้นเทียบกับภาระงานทั้งหมด</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {deptStats.map((d) => (
                <div key={d.id} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-800">{d.name}</span>
                    <span className="font-semibold text-slate-600">
                      สำเร็จ {d.done}/{d.total} งาน ({d.rate}%)
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${d.rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Google Sheets Infrastructure Status (1 col) */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Sheet className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-900">
                    ฐานข้อมูล Google Sheets
                  </h2>
                  <p className="text-2xs text-slate-400">สถานะการเชื่อมต่อสเปรดชีต</p>
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50/70 border border-emerald-200/80 p-4 space-y-2.5 text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="font-bold">สถานะ: เชื่อมต่อสำเร็จ (Active)</span>
                </div>
                <div className="text-2xs text-emerald-800 font-mono truncate">
                  ID: 1g1ynWNSsHnd6Ta9rSolO6Fx6AXVRVuItgr0taKb2HMg
                </div>
                <div className="text-2xs text-emerald-700">
                  โหมด: Google Apps Script Web App (ซิงค์อัตโนมัติ)
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-600 font-medium">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span>ผู้ใช้งานในระบบ:</span>
                  <strong className="text-slate-900">{users.length} ท่าน</strong>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span>แผนก/ฝ่าย:</span>
                  <strong className="text-slate-900">{departments.length} ฝ่าย</strong>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
              <a
                href="https://docs.google.com/spreadsheets/d/1g1ynWNSsHnd6Ta9rSolO6Fx6AXVRVuItgr0taKb2HMg/edit"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                <span>เปิดดู Google Sheet จริง</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* All Tasks Table Overview for Admin */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-slate-600" />
              <span>รายการงานทั้งหมดในระบบ ({tasks.length} งาน)</span>
            </h2>
            <div className="flex items-center gap-2">
              <Link
                href="/manager"
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline"
              >
                ไปที่หน้าสั่งงานหัวหน้า →
              </Link>
            </div>
          </div>

          {/* Table Filters Bar */}
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่องาน, ผู้รับผิดชอบ หรือรหัส..."
              className="rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden cursor-pointer"
            >
              <option value="all">ทุกฝ่ายงาน</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name.split(' (')[0]}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden cursor-pointer"
            >
              <option value="all">ทุกสถานะ</option>
              <option value="pending">รอดำเนินการ (Pending)</option>
              <option value="in_progress">กำลังดำเนินการ (In Progress)</option>
              <option value="review">รอหัวหน้าตรวจ (Review)</option>
              <option value="completed">เสร็จสมบูรณ์ (Completed)</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-2xs uppercase tracking-wider text-slate-500 font-bold">
                <tr>
                  <th className="px-4 py-3">รหัส</th>
                  <th className="px-4 py-3">ชื่องาน</th>
                  <th className="px-4 py-3">ฝ่าย</th>
                  <th className="px-4 py-3">ผู้รับผิดชอบ</th>
                  <th className="px-4 py-3">กำหนดส่ง</th>
                  <th className="px-4 py-3">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks
                  .filter((task) => {
                    if (filterDept !== 'all' && task.departmentId !== filterDept) return false;
                    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
                    if (searchQuery.trim()) {
                      const q = searchQuery.toLowerCase();
                      const matchTitle = task.title.toLowerCase().includes(q);
                      const matchAssignee = task.assignedTo.toLowerCase().includes(q);
                      const matchId = task.id.toLowerCase().includes(q);
                      if (!matchTitle && !matchAssignee && !matchId) return false;
                    }
                    return true;
                  })
                  .map((task) => {
                    const statusBadge =
                      task.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : task.status === 'review'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : task.status === 'in_progress'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200';

                    const statusText =
                      task.status === 'completed'
                        ? 'เสร็จสมบูรณ์'
                        : task.status === 'review'
                        ? 'รอหัวหน้าตรวจ'
                        : task.status === 'in_progress'
                        ? 'กำลังทำ'
                        : 'รอดำเนินการ';

                    return (
                      <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-slate-400">{task.id}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">{task.title}</td>
                        <td className="px-4 py-3 font-medium text-slate-700">{task.departmentId.toUpperCase()}</td>
                        <td className="px-4 py-3 font-medium text-slate-800">{task.assignedTo}</td>
                        <td className="px-4 py-3">{task.dueDate}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-0.5 rounded-md text-2xs font-bold ${statusBadge}`}>
                            {statusText}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        tasks={tasks}
        sheetId="1g1ynWNSsHnd6Ta9rSolO6Fx6AXVRVuItgr0taKb2HMg"
      />
    </div>
  );
}
