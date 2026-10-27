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
  Sparkles,
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100/90 font-sans text-slate-900 flex flex-col">
      {/* Top Floating Navbar */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 text-white shadow-md shadow-blue-500/25">
              <CheckCircle2 className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg text-slate-900 leading-tight block">
                ระบบมอบหมายงานองค์กร
              </span>
              <span className="text-2xs text-slate-400 font-medium">Edu Task Assignment System</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isSheetsConnected ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/25">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Sheet className="h-3.5 w-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Google Sheet ซิงค์อยู่</span>
              </span>
            ) : null}

            <a
              href="https://github.com/anan646/Edu-Task-Assignment-System"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors hidden md:inline-flex items-center gap-1"
            >
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:pt-16 lg:pb-20">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50/90 px-3.5 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-blue-600/20 mb-6 shadow-xs animate-in fade-in duration-300">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span>ระบบสั่งงาน ตรวจงาน และติดตามความคืบหน้าระหว่างฝ่าย</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            มอบหมายงานอย่างมีระบบ <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              เชื่อมโยงข้อมูลสู่ Google Sheets
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            แพลตฟอร์มบริหารงานที่แบ่งพื้นที่การทำงานอย่างชัดเจนสำหรับ <strong>หัวหน้าฝ่าย</strong>, <strong>พนักงาน</strong>, และ <strong>ผู้ดูแลระบบ</strong> เพื่อการประสานงานที่รวดเร็วและตรวจสอบได้ทุกขั้นตอน
          </p>

          {/* Quick Counter Strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              <span>งานทั้งหมดในระบบ: <strong>{stats.total} งาน</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-purple-500"></span>
              <span>รอหัวหน้าตรวจ: <strong>{stats.review} งาน</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>เสร็จสมบูรณ์แล้ว: <strong>{stats.completed} งาน</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Role Portals Cards (The Core Focus of the User's Request) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        <div className="text-center mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">
            CHOOSE YOUR WORKSPACE PORTAL
          </h2>
          <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
            เลือกพอร์ทัลเข้าใช้งานตามบทบาทของคุณ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Manager Portal Card */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-blue-200/80 bg-white p-7 shadow-lg shadow-blue-500/5 hover:-translate-y-1.5 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/15 transition-all duration-300">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-500/20 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="h-7 w-7 stroke-[2.2]" />
                </div>
                <span className="rounded-full bg-blue-100/80 px-3 py-1 text-2xs font-extrabold text-blue-800">
                  สำหรับหัวหน้าฝ่าย / ผู้จัดการ
                </span>
              </div>

              <h3 className="mt-5 text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                พอร์ทัลหัวหน้าฝ่าย (Manager)
              </h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                สั่งงานใหม่ มอบหมายงานข้ามฝ่าย ติดตามกำหนดส่ง ตรวจสอบผลงานที่ส่งมอบ และกดอนุมัติหรือตีกลับงานได้ทันที
              </p>

              <div className="mt-5 space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-2xs font-bold">✓</span>
                  <span>ปุ่มสร้างและมอบหมายงานใหม่ (+ สั่งงาน)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-2xs font-bold">✓</span>
                  <span>ระบบตรวจรับงาน (อนุมัติ / ตีกลับแก้ไข)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-2xs font-bold">✓</span>
                  <span>มุมมอง Kanban Board 4 คอลัมน์</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/manager"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-4 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all"
              >
                <span>เข้าสู่ระบบหัวหน้าฝ่าย</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* 2. Staff Portal Card */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-emerald-200/80 bg-white p-7 shadow-lg shadow-emerald-500/5 hover:-translate-y-1.5 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/15 transition-all duration-300">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-emerald-500 to-teal-600"></div>

            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20 group-hover:scale-105 transition-transform">
                  <UserIcon className="h-7 w-7 stroke-[2.2]" />
                </div>
                <span className="rounded-full bg-emerald-100/80 px-3 py-1 text-2xs font-extrabold text-emerald-800">
                  สำหรับผู้ปฏิบัติงาน / พนักงาน
                </span>
              </div>

              <h3 className="mt-5 text-xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                พอร์ทัลพนักงาน (Staff Workspace)
              </h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                ดูกล่องงานที่ได้รับมอบหมาย กดเริ่มทำงาน บันทึกความคืบหน้า และส่งมอบงานให้หัวหน้าตรวจพร้อมแนบลิงก์
              </p>

              <div className="mt-5 space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-2xs font-bold">✓</span>
                  <span>กล่องงานที่ได้รับมอบหมาย (My Tasks)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-2xs font-bold">✓</span>
                  <span>กดเริ่มทำ และส่งตรวจงานได้ทันที</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-2xs font-bold">✓</span>
                  <span>แนบลิงก์ Google Drive หรือเอกสารผลงาน</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/staff"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 px-4 text-xs font-bold text-white shadow-md shadow-emerald-500/25 hover:from-emerald-500 hover:to-teal-500 active:scale-95 transition-all"
              >
                <span>เข้าสู่พื้นที่พนักงาน</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* 3. Admin Dashboard Card */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-purple-200/80 bg-white p-7 shadow-lg shadow-purple-500/5 hover:-translate-y-1.5 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/15 transition-all duration-300">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-purple-500 to-violet-600"></div>

            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 ring-1 ring-purple-500/20 group-hover:scale-105 transition-transform">
                  <LayoutDashboard className="h-7 w-7 stroke-[2.2]" />
                </div>
                <span className="rounded-full bg-purple-100/80 px-3 py-1 text-2xs font-extrabold text-purple-800">
                  สำหรับแอดมิน / ผู้บริหารสูงสุด
                </span>
              </div>

              <h3 className="mt-5 text-xl font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
                แดชบอร์ดแอดมิน (Admin Dashboard)
              </h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                ศูนย์กลางดูภาพรวมประสิทธิภาพทุกฝ่าย สรุปภาระงาน ควบคุมการเชื่อมต่อ Google Sheets และสำรองข้อมูล
              </p>

              <div className="mt-5 space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-2xs font-bold">✓</span>
                  <span>สถิติประสิทธิภาพและภาระงานแยกตามฝ่าย</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-2xs font-bold">✓</span>
                  <span>สถานะการซิงค์ Google Sheets เรียลไทม์</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-2xs font-bold">✓</span>
                  <span>ดาวน์โหลดไฟล์สำรองข้อมูล CSV (Excel)</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/admin"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 py-3 px-4 text-xs font-bold text-white shadow-md shadow-purple-500/25 hover:from-purple-500 hover:to-violet-500 active:scale-95 transition-all"
              >
                <span>เข้าสู่แดชบอร์ดแอดมิน</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="bg-slate-100/60 py-16 px-4 sm:px-6 border-t border-slate-200/80">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              ออกแบบเพื่อการทำงานจริงในระดับองค์กร
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              ผสานความง่ายของ Google Sheets เข้ากับความรวดเร็วและสวยงามของเว็บแอปสมัยใหม่
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg mb-3">
                🏢
              </div>
              <h3 className="font-bold text-sm text-slate-900">สั่งงานข้ามฝ่ายได้ทันที</h3>
              <p className="text-xs text-slate-500 mt-1">
                ระบุฝ่ายที่รับผิดชอบและกำหนดตัวบุคคลได้ชัดเจน หมดปัญหางานตกหล่น
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg mb-3">
                📊
              </div>
              <h3 className="font-bold text-sm text-slate-900">Google Sheets Database</h3>
              <p className="text-xs text-slate-500 mt-1">
                ข้อมูลบันทึกลงในสเปรดชีตของคุณโดยตรง เปิดกรองหรือทำกราฟสรุปได้อิสระ
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg mb-3">
                📋
              </div>
              <h3 className="font-bold text-sm text-slate-900">Kanban Board &amp; Table</h3>
              <p className="text-xs text-slate-500 mt-1">
                สลับมุมมองแบบการ์ดคันบันหรือตารางได้ตามความถนัดของผู้ใช้งาน
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-lg mb-3">
                ☁️
              </div>
              <h3 className="font-bold text-sm text-slate-900">สำรองข้อมูล 1 คลิก</h3>
              <p className="text-xs text-slate-500 mt-1">
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
