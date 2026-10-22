'use client';

import React from 'react';
import { Plus, Sheet, Database, HelpCircle, CheckCircle2, AlertTriangle, ShieldCheck, User as UserIcon } from 'lucide-react';
import { UserRole } from '@/types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenNewTaskModal: () => void;
  onOpenGuideModal: () => void;
  isSheetsConnected: boolean;
}

export function Header({
  currentRole,
  onRoleChange,
  onOpenNewTaskModal,
  onOpenGuideModal,
  isSheetsConnected,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand & System Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/20">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">
                ระบบมอบหมายงานองค์กร
              </h1>
              {isSheetsConnected ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20 ring-inset">
                  <Sheet className="h-3 w-3 text-emerald-600" />
                  Google Sheet
                </span>
              ) : (
                <button
                  type="button"
                  onClick={onOpenGuideModal}
                  className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-amber-600/20 ring-inset hover:bg-amber-100 transition-colors cursor-pointer"
                  title="คลิกเพื่อดูวิธีเชื่อมต่อ Google Sheet"
                >
                  <AlertTriangle className="h-3 w-3 text-amber-600" />
                  โหมดทดสอบ (Demo)
                </button>
              )}
            </div>
            <p className="text-xs text-zinc-500 hidden sm:block">
              สั่งงาน ตรวจงาน และติดตามความคืบหน้าแต่ละฝ่าย
            </p>
          </div>
        </div>

        {/* Actions & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Setup Guide Button */}
          <button
            type="button"
            onClick={onOpenGuideModal}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-xs hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
          >
            <HelpCircle className="h-4 w-4 text-zinc-500" />
            <span className="hidden md:inline">คู่มือเชื่อมต่อ</span> Google Sheets
          </button>

          {/* Role Switcher */}
          <div className="flex items-center rounded-lg bg-zinc-100 p-1 text-xs font-medium text-zinc-600">
            <button
              type="button"
              onClick={() => onRoleChange('head')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition-all ${
                currentRole === 'head'
                  ? 'bg-white font-semibold text-blue-700 shadow-xs'
                  : 'hover:text-zinc-900'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>หัวหน้าฝ่าย</span>
            </button>
            <button
              type="button"
              onClick={() => onRoleChange('staff')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition-all ${
                currentRole === 'staff'
                  ? 'bg-white font-semibold text-emerald-700 shadow-xs'
                  : 'hover:text-zinc-900'
              }`}
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>พนักงาน</span>
            </button>
          </div>

          {/* Assign Task Button */}
          <button
            type="button"
            onClick={onOpenNewTaskModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>สั่งงานใหม่</span>
          </button>
        </div>
      </div>
    </header>
  );
}
