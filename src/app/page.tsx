'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  User as UserIcon,
  LayoutDashboard,
  CheckCircle2,
  Sheet,
  ArrowRight,
  ClipboardList,
  Clock,
  Layers,
  Database,
  CloudUpload,
  Send,
  ExternalLink,
} from 'lucide-react';

export default function LandingPage() {
  const [stats, setStats] = useState({ total: 5, pending: 2, inProgress: 1, review: 1, completed: 1 });
  const [isSheetsConnected, setIsSheetsConnected] = useState(true);

  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.tasks) {
          const tasks = data.tasks;
          setStats({
            total: tasks.length,
            pending: tasks.filter((t: any) => t.status === 'pending').length,
            inProgress: tasks.filter((t: any) => t.status === 'in_progress').length,
            review: tasks.filter((t: any) => t.status === 'review').length,
            completed: tasks.filter((t: any) => t.status === 'completed').length,
          });
          setIsSheetsConnected(Boolean(data.config?.isConfigured));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-xs">
              <CheckCircle2 className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-bold text-base text-slate-900 leading-tight block">
                ระบบมอบหมายงานองค์กร
              </span>
              <span className="text-2xs text-slate-500 font-medium">Edu Task Assignment System</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isSheetsConnected ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <Sheet className="h-3.5 w-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Google Sheets ซิงค์อยู่</span>
              </span>
            ) : null}

            <a
              href="https://github.com/anan646/Edu-Task-Assignment-System"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors hidden md:inline-flex items-center gap-1"
            >
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-12 pb-14 px-4 sm:px-6 lg:pt-16 lg:pb-16 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200 mb-6">
            <ClipboardList className="h-3.5 w-3.5 text-blue-700" />
            <span>ระบบบริหาร จัดสรร และติดตามภาระงานระหว่างฝ่าย</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            มอบหมายงานอย่างเป็นระบบ <br className="hidden sm:inline" />
            <span className="text-blue-700">เชื่อมโยงข้อมูลสู่ Google Sheets</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            แพลตฟอร์มบริหารงานที่แบ่งพื้นที่การทำงานอย่างชัดเจนสำหรับ <strong>หัวหน้าฝ่าย</strong>, <strong>พนักงาน</strong>, และ <strong>ผู้ดูแลระบบ</strong> เพื่อการประสานงานที่รวดเร็ว ชัดเจน และตรวจสอบได้
          </p>

          {/* Quick Counter Strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-200">
              <span className="h-2 w-2 rounded-full bg-blue-600"></span>
              <span>งานทั้งหมดในระบบ: <strong className="text-slate-900">{stats.total} งาน</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-200">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              <span>รอหัวหน้าตรวจ: <strong className="text-slate-900">{stats.review} งาน</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
              <span>เสร็จสมบูรณ์แล้ว: <strong className="text-slate-900">{stats.completed} งาน</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Role Portals Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Workspaces by Role
          </p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
            เลือกเข้าสู่พื้นที่ทำงานตามบทบาทหน้าที่
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Manager Portal Card */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all">
            <div className="absolute inset-x-0 top-0 h-1 bg-blue-700"></div>

            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                  <ShieldCheck className="h-6 w-6 stroke-[2]" />
                </div>
                <span className="rounded-md bg-blue-50 px-2.5 py-1 text-2xs font-bold text-blue-700 border border-blue-200/60">
                  สำหรับหัวหน้าฝ่าย / ผู้จัดการ
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                พอร์ทัลหัวหน้าฝ่าย (Manager)
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                สั่งงานใหม่ มอบหมายงานข้ามฝ่าย ติดตามกำหนดส่ง ตรวจสอบผลงานที่ส่งมอบ และกดอนุมัติหรือตีกลับงานได้ทันที
              </p>

              <div className="mt-4 space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-2xs font-bold">✓</span>
                  <span>ปุ่มสร้างและมอบหมายงานใหม่ (+ สั่งงาน)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-2xs font-bold">✓</span>
                  <span>ระบบตรวจรับงาน (อนุมัติ / ตีกลับแก้ไข)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-2xs font-bold">✓</span>
                  <span>มุมมอง Kanban Board 4 คอลัมน์</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/manager"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 py-2.5 px-4 text-xs font-semibold text-white shadow-xs transition-colors"
              >
                <span>เข้าสู่ระบบหัวหน้าฝ่าย</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* 2. Staff Portal Card */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all">
            <div className="absolute inset-x-0 top-0 h-1 bg-emerald-600"></div>

            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <UserIcon className="h-6 w-6 stroke-[2]" />
                </div>
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-2xs font-bold text-emerald-700 border border-emerald-200/60">
                  สำหรับผู้ปฏิบัติงาน / พนักงาน
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                พอร์ทัลพนักงาน (Staff Workspace)
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                ดูกล่องงานที่ได้รับมอบหมาย กดเริ่มทำงาน บันทึกความคืบหน้า และส่งมอบงานให้หัวหน้าตรวจพร้อมแนบลิงก์
              </p>

              <div className="mt-4 space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-2xs font-bold">✓</span>
                  <span>กล่องงานที่ได้รับมอบหมาย (My Tasks)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-2xs font-bold">✓</span>
                  <span>กดเริ่มทำ และส่งตรวจงานได้ทันที</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-2xs font-bold">✓</span>
                  <span>แนบลิงก์ Google Drive หรือเอกสารผลงาน</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/staff"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 py-2.5 px-4 text-xs font-semibold text-white shadow-xs transition-colors"
              >
                <span>เข้าสู่พื้นที่พนักงาน</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* 3. Admin Dashboard Card */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-400 hover:shadow-sm transition-all">
            <div className="absolute inset-x-0 top-0 h-1 bg-slate-800"></div>

            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                  <LayoutDashboard className="h-6 w-6 stroke-[2]" />
                </div>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-2xs font-bold text-slate-700 border border-slate-200">
                  สำหรับผู้ดูแลระบบ
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                แดชบอร์ดแอดมิน (Admin Dashboard)
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                ศูนย์กลางดูภาพรวมประสิทธิภาพทุกฝ่าย สรุปภาระงาน ควบคุมการเชื่อมต่อ Google Sheets และสำรองข้อมูล
              </p>

              <div className="mt-4 space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-2xs font-bold">✓</span>
                  <span>สถิติประสิทธิภาพและภาระงานแยกตามฝ่าย</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-2xs font-bold">✓</span>
                  <span>สถานะการซิงค์ Google Sheets เรียลไทม์</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-2xs font-bold">✓</span>
                  <span>ดาวน์โหลดไฟล์สำรองข้อมูล CSV (Excel)</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/admin"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 py-2.5 px-4 text-xs font-semibold text-white shadow-xs transition-colors"
              >
                <span>เข้าสู่แดชบอร์ดแอดมิน</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="bg-slate-100 py-14 px-4 sm:px-6 border-t border-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              ออกแบบเพื่อการปฏิบัติงานจริงในระดับองค์กร
            </h2>
            <p className="mt-2 text-xs text-slate-600">
              เชื่อมต่อการทำงานของฝ่ายต่างๆ เข้ากับ Google Sheets ฐานข้อมูลที่ใช้งานง่ายและยืดหยุ่น
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="rounded-xl bg-white p-5 border border-slate-200 shadow-xs">
              <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3 border border-blue-100">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">สั่งงานข้ามฝ่ายได้ทันที</h3>
              <p className="text-xs text-slate-600 mt-1">
                ระบุฝ่ายที่รับผิดชอบและกำหนดตัวบุคคลได้ชัดเจน หมดปัญหางานตกหล่น
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 border border-slate-200 shadow-xs">
              <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 border border-emerald-100">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Google Sheets Database</h3>
              <p className="text-xs text-slate-600 mt-1">
                ข้อมูลบันทึกลงในสเปรดชีตของคุณโดยตรง เปิดกรองหรือทำกราฟสรุปได้อิสระ
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 border border-slate-200 shadow-xs">
              <div className="h-9 w-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3 border border-slate-200">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Kanban Board &amp; Table</h3>
              <p className="text-xs text-slate-600 mt-1">
                สลับมุมมองแบบการ์ดคันบันหรือตารางได้ตามความถนัดของผู้ใช้งาน
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 border border-slate-200 shadow-xs">
              <div className="h-9 w-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3 border border-amber-100">
                <CloudUpload className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">สำรองข้อมูล 1 คลิก</h3>
              <p className="text-xs text-slate-600 mt-1">
                กดซิงค์ข้อมูลลงชีต หรือดาวน์โหลดเป็นไฟล์ CSV สำหรับเปิดใน Excel ได้ทุกเมื่อ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>ระบบมอบหมายงานองค์กร • Edu Task Assignment System</span>
          <div className="flex items-center gap-4 text-slate-500">
            <Link href="/manager" className="hover:text-blue-600">หัวหน้าฝ่าย</Link>
            <Link href="/staff" className="hover:text-emerald-600">พนักงาน</Link>
            <Link href="/admin" className="hover:text-purple-600">แดชบอร์ดแอดมิน</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
