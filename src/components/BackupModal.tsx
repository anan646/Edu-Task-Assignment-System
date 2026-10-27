'use client';

import React, { useState } from 'react';
import { X, CloudUpload, Download, FileSpreadsheet, Copy, Check, ExternalLink, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Task } from '@/types';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  sheetId?: string;
}

export function BackupModal({ isOpen, onClose, tasks, sheetId }: BackupModalProps) {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupResult, setBackupResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const currentSheetId = sheetId || '1g1ynWNSsHnd6Ta9rSolO6Fx6AXVRVuItgr0taKb2HMg';
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${currentSheetId}/edit`;

  // Trigger server-side backup to Google Sheet
  const handleBackupToSheet = async () => {
    try {
      setIsBackingUp(true);
      setBackupResult(null);

      const res = await fetch('/api/backup', { method: 'POST' });
      const data = await res.json();
      setBackupResult(data);
    } catch (err: unknown) {
      setBackupResult({
        success: false,
        message: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้: ' + String(err),
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  // Export CSV directly to browser
  const handleDownloadCSV = () => {
    const headers = ['ID', 'ชื่องาน', 'รายละเอียด', 'ฝ่าย', 'ผู้รับผิดชอบ', 'ผู้สั่งการ', 'ความเร่งด่วน', 'สถานะ', 'กำหนดส่ง', 'บันทึก/ผลงาน', 'สร้างเมื่อ', 'อัปเดตเมื่อ'];
    const rows = tasks.map(t => [
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

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `สำรองข้อมูลงาน_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const appsScriptCode = `function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Tasks") || ss.insertSheet("Tasks");
  
  if (data.action === "backup" && data.tasks) {
    sheet.clear();
    var headers = ["ID", "Title", "Description", "DepartmentId", "AssignedTo", "AssignedBy", "Priority", "Status", "DueDate", "Notes", "CreatedAt", "UpdatedAt"];
    sheet.appendRow(headers);
    
    data.tasks.forEach(function(t) {
      sheet.appendRow([t.id, t.title, t.description, t.departmentId, t.assignedTo, t.assignedBy, t.priority, t.status, t.dueDate, t.notes || "", t.createdAt, t.updatedAt]);
    });
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, count: data.tasks.length })).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Unknown action" })).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Tasks");
  if (!sheet) return ContentService.createTextOutput(JSON.stringify({ tasks: [] })).setMimeType(ContentService.MimeType.JSON);
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return ContentService.createTextOutput(JSON.stringify({ tasks: [] })).setMimeType(ContentService.MimeType.JSON);
  
  var tasks = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    tasks.push({
      id: r[0], title: r[1], description: r[2], departmentId: r[3],
      assignedTo: r[4], assignedBy: r[5], priority: r[6], status: r[7],
      dueDate: r[8], notes: r[9], createdAt: r[10], updatedAt: r[11]
    });
  }
  return ContentService.createTextOutput(JSON.stringify({ tasks: tasks })).setMimeType(ContentService.MimeType.JSON);
}`;

  const copyScript = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative my-6 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl transition-all max-h-[92vh] overflow-y-auto text-xs text-slate-700"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <CloudUpload className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                ระบบสำรองข้อมูลใน Google Sheet
              </h2>
              <p className="text-xs text-slate-500">
                บันทึกและสำรองข้อมูลงานทั้งหมด ({tasks.length} รายการ) ลงในชีต
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Sheet Target */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold text-emerald-900">ชีตเป้าหมายสำหรับสำรองข้อมูล:</p>
              <p className="text-2xs text-emerald-700 font-mono truncate max-w-md">
                {currentSheetId}
              </p>
            </div>
          </div>
          <a
            href={sheetUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-2xs font-semibold text-white hover:bg-emerald-500 transition-colors"
          >
            <span>เปิดชีต</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Action: Trigger Backup */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleBackupToSheet}
            disabled={isBackingUp}
            className="flex flex-col items-center justify-center gap-1 rounded-xl border border-blue-200 bg-blue-50/80 p-4 text-center hover:bg-blue-100 transition-all cursor-pointer shadow-2xs"
          >
            {isBackingUp ? (
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            ) : (
              <CloudUpload className="h-6 w-6 text-blue-600" />
            )}
            <span className="font-bold text-sm text-blue-900 mt-1">
              {isBackingUp ? 'กำลังส่งข้อมูลไปชีต...' : 'สำรองข้อมูลลงชีตทันที'}
            </span>
            <span className="text-2xs text-blue-700">
              อัปเดตงาน {tasks.length} รายการลงในแผ่นงาน Tasks
            </span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCSV}
            className="flex flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center hover:bg-slate-100 transition-all cursor-pointer shadow-2xs"
          >
            <Download className="h-6 w-6 text-slate-700" />
            <span className="font-bold text-sm text-slate-900 mt-1">
              ดาวน์โหลดไฟล์ CSV (Excel)
            </span>
            <span className="text-2xs text-slate-500">
              บันทึกไฟล์ .csv เก็บไว้ในคอมพิวเตอร์ของคุณทันที
            </span>
          </button>
        </div>

        {/* Feedback Alert */}
        {backupResult && (
          <div
            className={`mt-4 flex items-start gap-2 rounded-xl p-3 text-xs ${
              backupResult.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-amber-50 text-amber-900 border border-amber-200'
            }`}
          >
            {backupResult.success ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{backupResult.message}</p>
              {!backupResult.success && (
                <p className="mt-1 text-2xs text-amber-800">
                  💡 หากยังไม่ได้ตั้งค่า Service Account สามารถใช้วิธี **Google Apps Script (3 คลิก)** ด้านล่างนี้เพื่อเชื่อมชีตได้เลยครับ
                </p>
              )}
            </div>
          </div>
        )}

        {/* Easy Option: Google Apps Script Web App */}
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm">
              วิธีเชื่อมต่อ Google Sheet ที่ง่ายที่สุด (ไม่ต้องใช้ Google Cloud)
            </span>
            <button
              type="button"
              onClick={copyScript}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-2xs font-medium text-white hover:bg-slate-700 cursor-pointer"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCode ? 'คัดลอกโค้ดแล้ว!' : 'คัดลอกโค้ดสคริปต์'}</span>
            </button>
          </div>

          <ol className="mt-2.5 list-decimal list-inside space-y-1.5 text-slate-600 text-xs">
            <li>
              เปิด Google Sheet ของคุณ ไปที่เมนู <strong>ส่วนขยาย (Extensions) &gt; Apps Script</strong>
            </li>
            <li>ลบโค้ดเดิมในนั้น แล้วกดปุ่ม <strong>&quot;คัดลอกโค้ดสคริปต์&quot;</strong> ด้านบนไปวางแทนที่</li>
            <li>
              กดปุ่มสีน้ำเงิน <strong>ทำให้ใช้งานได้ (Deploy) &gt; การทำให้ใช้งานได้ใหม่ (New deployment)</strong>
            </li>
            <li>เลือกประเภทเป็น <strong>เว็บแอป (Web app)</strong> และตรง <em>&quot;ใครมีสิทธิ์เข้าถึง (Who has access)&quot;</em> ให้เลือกเป็น <strong>&quot;ทุกคน (Anyone)&quot;</strong></li>
            <li>กด <strong>ทำให้ใช้งานได้</strong> แล้วคัดลอก <strong>URL เว็บแอป</strong> ที่ได้ (ขึ้นต้นด้วย <code>https://script.google.com/macros/s/...</code>)</li>
            <li>นำ URL นั้นมาใส่ในไฟล์ <code>.env.local</code>:
              <div className="mt-1 rounded bg-slate-900 p-2 font-mono text-2xs text-slate-200 overflow-x-auto">
                GOOGLE_SHEET_WEBAPP_URL=&quot;https://script.google.com/macros/s/AKfycb.../exec&quot;
              </div>
            </li>
          </ol>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
