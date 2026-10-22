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
  selectedStatus,
  onSelectStatus,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
}: TaskFiltersProps) {
  const hasActiveFilters =
    selectedDepartment !== 'all' ||
    selectedPriority !== 'all' ||
    selectedStatus !== 'all' ||
    searchQuery.trim() !== '';

  const clearFilters = () => {
    onSelectDepartment('all');
    onSelectPriority('all');
    onSelectStatus('all');
    onSearchChange('');
  };

  return (
    <div className="space-y-3">
      {/* Search Bar & View Mode Switcher */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาชื่องาน, รายละเอียด, ผู้รับผิดชอบ หรือรหัส..."
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
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
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 shadow-2xs"
            >
              <X className="h-3.5 w-3.5" />
              ล้างตัวกรอง
            </button>
          )}

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => onViewModeChange('board')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                viewMode === 'board'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">บอร์ด</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">ตาราง</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Row: Department Pills & Priority Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-100">
        {/* Department Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-medium text-zinc-400 flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" /> ฝ่าย:
          </span>
          <button
            type="button"
            onClick={() => onSelectDepartment('all')}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all shrink-0 ${
              selectedDepartment === 'all'
                ? 'bg-zinc-900 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
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
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {dept.name.split(' (')[0]}
              </button>
            );
          })}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1 text-xs text-zinc-500">
          <span className="font-medium text-zinc-400">ความเร่งด่วน:</span>
          <select
            value={selectedPriority}
            onChange={(e) => onSelectPriority(e.target.value as Priority | 'all')}
            className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-2xs focus:border-blue-500 focus:outline-hidden"
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
