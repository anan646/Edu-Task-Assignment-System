'use client';

import React from 'react';
import { Plus, Sheet, HelpCircle, CheckCircle2, AlertTriangle, ShieldCheck, User as UserIcon, CloudUpload, Sparkles } from 'lucide-react';
import { UserRole } from '@/types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenNewTaskModal: () => void;
  onOpenGuideModal: () => void;
  onOpenBackupModal: () => void;
  isSheetsConnected: boolean;
}

export function Header({
  currentRole,
  onRoleChange,
  onOpenNewTaskModal,
  onOpenGuideModal,
  onOpenBackupModal,
  isSheetsConnected,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl shadow-xs transition-all">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand & System Title */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 text-white shadow-lg shadow-blue-500/25 ring-2 ring-white">
            <CheckCircle2 className="h-6 w-6 stroke-[2.2]" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                ระบบมอบหมายงานองค์กร
              </h1>
              {isSheetsConnected ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/90 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/25 shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  <Sheet className="h-3 w-3 text-emerald-600" />
                  Google Sheet ซิงค์อยู่
                </span>
              ) : (
                <button
                  type="button"
                  onClick={onOpenGuideModal}
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-600/20 hover:bg-amber-100 transition-colors cursor-pointer shadow-2xs"
                  title="คลิกเพื่อดูวิธีเชื่อมต่อ Google Sheet"
                >
                  <AlertTriangle className="h-3 w-3 text-amber-600" />
                  โหมดทดสอบ (Demo)
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 hidden sm:block font-normal">
              สั่งงาน ตรวจรับมอบหมายงาน และติดตามความคืบหน้าระหว่างฝ่าย
            </p>
          </div>
        </div>

        {/* Actions & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Backup Button */}
          <button
            type="button"
            onClick={onOpenBackupModal}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200/90 bg-emerald-50/90 px-3 py-2 text-xs font-semibold text-emerald-800 shadow-xs hover:bg-emerald-100/90 hover:shadow-sm transition-all cursor-pointer active:scale-95"
            title="สำรองข้อมูลลง Google Sheet"
          >
            <CloudUpload className="h-4 w-4 text-emerald-600" />
            <span className="hidden sm:inline">สำรองข้อมูล</span>
            <span className="sm:hidden">สำรอง</span>ชีต
          </button>

          {/* Setup Guide Button */}
          <button
            type="button"
            onClick={onOpenGuideModal}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
          >
            <HelpCircle className="h-4 w-4 text-slate-500" />
            <span className="hidden md:inline">คู่มือ</span>
          </button>

          {/* Role Switcher */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 text-xs font-medium text-slate-600 border border-slate-200/60 shadow-inner">
            <button
              type="button"
              onClick={() => onRoleChange('head')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                currentRole === 'head'
                  ? 'bg-white font-bold text-blue-700 shadow-xs ring-1 ring-slate-950/5'
                  : 'hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              <span>หัวหน้า</span>
            </button>
            <button
              type="button"
              onClick={() => onRoleChange('staff')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                currentRole === 'staff'
                  ? 'bg-white font-bold text-emerald-700 shadow-xs ring-1 ring-slate-950/5'
                  : 'hover:text-slate-900'
              }`}
            >
              <UserIcon className="h-3.5 w-3.5 text-emerald-600" />
              <span>พนักงาน</span>
            </button>
          </div>

          {/* Assign Task Button */}
          <button
            type="button"
            onClick={onOpenNewTaskModal}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>สั่งงานใหม่</span>
          </button>
        </div>
      </div>
    </header>
  );
}
