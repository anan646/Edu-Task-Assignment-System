'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  User as UserIcon,
  LayoutDashboard,
  Home,
  CheckCircle2,
  Sheet,
  CloudUpload,
  Plus,
} from 'lucide-react';

interface PortalNavbarProps {
  onOpenNewTaskModal?: () => void;
  onOpenBackupModal?: () => void;
  isSheetsConnected?: boolean;
}

export function PortalNavbar({
  onOpenNewTaskModal,
  onOpenBackupModal,
  isSheetsConnected = true,
}: PortalNavbarProps) {
  const pathname = usePathname();

  const links = [
    { href: '/manager', label: 'หัวหน้าฝ่าย', icon: ShieldCheck, color: 'text-blue-600' },
    { href: '/staff', label: 'พนักงาน', icon: UserIcon, color: 'text-emerald-600' },
    { href: '/admin', label: 'แดชบอร์ดแอดมิน', icon: LayoutDashboard, color: 'text-purple-600' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Left: Brand & Home Link */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity"
            title="กลับสู่หน้าแรก (Landing Page)"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-xs">
              <CheckCircle2 className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  ระบบมอบหมายงาน
                </span>
                {isSheetsConnected ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-2xs font-semibold text-emerald-700 border border-emerald-200">
                    <Sheet className="h-3 w-3 text-emerald-600" />
                    <span className="hidden sm:inline">Google Sheets</span>
                  </span>
                ) : null}
              </div>
              <p className="text-2xs text-slate-500 hidden sm:block">Edu Task Assignment System</p>
            </div>
          </Link>
        </div>

        {/* Center: Quick Portal Switcher Pills */}
        <nav className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/60 shadow-inner text-xs">
          <Link
            href="/"
            className="px-2.5 py-1.5 rounded-xl font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-all flex items-center gap-1"
            title="หน้าแรก"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden md:inline">หน้าแรก</span>
          </Link>

          {links.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-950/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${item.color}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {onOpenBackupModal && (
            <button
              type="button"
              onClick={onOpenBackupModal}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200/90 bg-emerald-50/90 px-3 py-2 text-xs font-semibold text-emerald-800 shadow-xs hover:bg-emerald-100 transition-all cursor-pointer"
              title="สำรองข้อมูลลง Google Sheet"
            >
              <CloudUpload className="h-4 w-4 text-emerald-600" />
              <span className="hidden lg:inline">สำรองข้อมูล</span>
            </button>
          )}

          {onOpenNewTaskModal && (
            <button
              type="button"
              onClick={onOpenNewTaskModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.2]" />
              <span>สั่งงานใหม่</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
