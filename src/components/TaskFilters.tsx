'use client';

import React from 'react';
import { Department, Priority, TaskStatus } from '@/types';
import { Search, LayoutGrid, List, Filter, X } from 'lucide-react';

interface TaskFiltersProps {
  departments: Department[];
  selectedDepartment: string;
  onSelectDepartment: (deptId: string) => void;
  selectedPriority: Priority | 'all';
  onSelectPriority: (priority: Priority | 'all') => void;
  selectedStatus: TaskStatus | 'all';
  onSelectStatus: (status: TaskStatus | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'board' | 'table';
  onViewModeChange: (mode: 'board' | 'table') => void;
}

export function TaskFilters({
  departments,
  selectedDepartment,
  onSelectDepartment,
  selectedPriority,
  onSelectPriority,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
}: TaskFiltersProps) {
  const hasActiveFilters =
    selectedDepartment !== 'all' ||
    selectedPriority !== 'all' ||
    searchQuery.trim() !== '';

  const clearFilters = () => {
    onSelectDepartment('all');
    onSelectPriority('all');
    onSearchChange('');
  };

  return (
    <div className="space-y-3.5">
      {/* Top Search Bar & View Mode Switcher */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาชื่องาน, รายละเอียด, ผู้รับผิดชอบ หรือรหัส..."
            className="w-full rounded-xl border border-slate-200/90 bg-slate-50/50 py-2.5 pl-10 pr-9 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* View Switcher & Clear Button */}
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-xs transition-all cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              ล้างตัวกรอง
            </button>
          )}

          {/* View Toggle */}
          <div className="flex items-center rounded-xl border border-slate-200/80 bg-slate-100 p-1 shadow-inner">
            <button
              type="button"
              onClick={() => onViewModeChange('board')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-950/5'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>บอร์ด</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-950/5'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>ตาราง</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Row: Department Pills & Priority Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        {/* Department Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1 shrink-0">
            <Filter className="h-3.5 w-3.5" /> ฝ่าย:
          </span>
          <button
            type="button"
            onClick={() => onSelectDepartment('all')}
            className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              selectedDepartment === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ทุกฝ่าย
          </button>
          {departments.map((dept) => {
            const isSelected = selectedDepartment === dept.id;
            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => onSelectDepartment(dept.id)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept.name.split(' (')[0]}
              </button>
            );
          })}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-400">ความเร่งด่วน:</span>
          <select
            value={selectedPriority}
            onChange={(e) => onSelectPriority(e.target.value as Priority | 'all')}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden cursor-pointer"
          >
            <option value="all">ทั้งหมด</option>
            <option value="urgent">🔴 ด่วนที่สุด</option>
            <option value="high">🟠 ด่วน</option>
            <option value="normal">🔵 ปกติ</option>
            <option value="low">⚪ ทั่วไป</option>
          </select>
        </div>
      </div>
    </div>
  );
}
