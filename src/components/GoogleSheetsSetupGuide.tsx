'use client';

import React, { useState } from 'react';
import { X, Sheet, Key, Share2, UploadCloud, CheckCircle2, Copy, ExternalLink } from 'lucide-react';

interface GoogleSheetsSetupGuideProps {
  isOpen: boolean;
  onClose: () => void;
  isConfigured: boolean;
}

export function GoogleSheetsSetupGuide({ isOpen, onClose, isConfigured }: GoogleSheetsSetupGuideProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl transition-all max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Sheet className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                คู่มือเชื่อมต่อ Google Sheet & นำขึ้น Vercel
              </h2>
              <p className="text-xs text-slate-500">
                {isConfigured ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> ระบบเชื่อมต่อ Google Sheet เรียบร้อยแล้ว
                  </span>
                ) : (
                  'ขณะนี้ระบบทำงานในโหมดตัวอย่าง (Demo Data) ทำตาม 4 ขั้นตอนนี้เพื่อเชื่อมต่อชีตจริง'
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step-by-Step Guide */}
        <div className="mt-5 space-y-6 text-xs text-slate-700">
          {/* Step 1: Create Google Sheet */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                1
              </span>
              <span>สร้าง Google Sheets แผ่นใหม่</span>
            </div>
            <p className="mt-2 text-slate-600 leading-relaxed">
              ไปที่{' '}
              <a
                href="https://sheets.new"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-600 hover:underline inline-flex items-center gap-0.5"
              >
                sheets.new <ExternalLink className="h-3 w-3" />
              </a>{' '}
              เพื่อสร้าง Google Sheet แผ่นใหม่ ตั้งชื่อ เช่น <strong>&quot;ระบบมอบหมายงาน&quot;</strong> จากนั้นสังเกต URL ของชีต:
            </p>
            <div className="mt-2 rounded-lg bg-slate-900 p-2.5 font-mono text-slate-200 text-2xs overflow-x-auto">
              https://docs.google.com/spreadsheets/d/<span className="text-amber-400 font-bold">1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms</span>/edit
            </div>
            <p className="mt-1 text-2xs text-slate-500">
              *ข้อความตัวหนาสีส้มคือ <strong>GOOGLE_SHEET_ID</strong> ให้คัดลอกเก็บไว้
            </p>
          </div>

          {/* Step 2: Google Cloud Service Account */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                2
              </span>
              <span>สร้าง Service Account ใน Google Cloud Console (ฟรี)</span>
            </div>
            <ol className="mt-2 list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed">
              <li>
                เข้า{' '}
                <a
                  href="https://console.cloud.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Google Cloud Console
                </a>{' '}
                และสร้าง Project ใหม่
              </li>
              <li>
                ไปที่เมนู <strong>APIs &amp; Services &gt; Library</strong> ค้นหา <strong>&quot;Google Sheets API&quot;</strong> แล้วกด <strong>Enable</strong>
              </li>
              <li>
                ไปที่ <strong>APIs &amp; Services &gt; Credentials</strong> กดปุ่ม <strong>Create Credentials &gt; Service Account</strong>
              </li>
              <li>
                ตั้งชื่อ Service Account (เช่น <code>task-bot</code>) แล้วกด Create
              </li>
              <li>
                คลิกที่ Service Account ที่สร้างขึ้น &gt; แท็บ <strong>Keys</strong> &gt; กด <strong>Add Key &gt; Create new key (JSON)</strong> แล้วดาวน์โหลดไฟล์เก็บไว้
              </li>
            </ol>
          </div>

          {/* Step 3: Share Sheet with Service Account */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                3
              </span>
              <span>แชร์ Google Sheet ให้ Service Account Email</span>
            </div>
            <p className="mt-2 text-slate-600 leading-relaxed">
              เปิดไฟล์ JSON ที่ดาวน์โหลดมา จะมีฟิลด์ <code>client_email</code> (เช่น <code>task-bot@my-project.iam.gserviceaccount.com</code>)
            </p>
            <p className="mt-1 text-slate-600 leading-relaxed">
              กลับไปที่หน้า Google Sheet ของคุณ กดปุ่ม <strong>&quot;แชร์ (Share)&quot;</strong> ที่มุมขวาบน วางอีเมลของ Service Account และเลือกสิทธิ์เป็น <strong>&quot;ผู้แก้ไข (Editor)&quot;</strong>
            </p>
          </div>

          {/* Step 4: Environment Variables */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                4
              </span>
              <span>ตั้งค่าตัวแปรใน <code>.env.local</code> (และใน Vercel)</span>
            </div>
            <p className="mt-2 text-slate-600">
              สร้างไฟล์ <code>.env.local</code> ในโฟลเดอร์โปรเจกต์ หรือนำไปใส่ในแท็บ <strong>Environment Variables</strong> ของ Vercel:
            </p>
            <div className="relative mt-2 rounded-lg bg-slate-900 p-3 font-mono text-slate-200 text-2xs overflow-x-auto">
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    `GOOGLE_SHEET_ID=your_sheet_id_here\nGOOGLE_SERVICE_ACCOUNT_EMAIL=task-bot@project.iam.gserviceaccount.com\nGOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"`,
                    'env'
                  )
                }
                className="absolute right-2 top-2 rounded bg-slate-800 px-2 py-1 text-2xs font-sans text-slate-300 hover:bg-slate-700"
              >
                {copiedKey === 'env' ? 'คัดลอกแล้ว!' : 'คัดลอก'}
              </button>
              <pre className="whitespace-pre">
{`GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=task-bot@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIEvg...\\n-----END PRIVATE KEY-----\\n"`}
              </pre>
            </div>
            <p className="mt-2 text-2xs text-amber-700 bg-amber-50 p-2 rounded-md">
              💡 <strong>ข้อควรระวัง:</strong> ในไฟล์ <code>.env</code> ให้ครอบ <code>GOOGLE_PRIVATE_KEY</code> ด้วยเครื่องหมายคำพูดคู่ (&quot;) และคง <code>\n</code> ไว้
            </p>
          </div>

          {/* Step 5: GitHub & Vercel */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-900">
              <UploadCloud className="h-5 w-5 text-blue-600" />
              <span>การนำขึ้น GitHub &amp; Vercel</span>
            </div>
            <ol className="mt-2 list-decimal list-inside space-y-1 text-blue-900 leading-relaxed text-xs">
              <li>สร้าง GitHub Repository เปล่าขึ้นมา</li>
              <li>
                สั่งคำสั่ง Git เพื่อ Push โค้ด:
                <div className="my-1.5 rounded-md bg-slate-900 p-2 font-mono text-slate-200 text-2xs">
                  git init<br />
                  git add .<br />
                  git commit -m &quot;Initial commit: Task assignment system&quot;<br />
                  git branch -M main<br />
                  git remote add origin https://github.com/&lt;your-user&gt;/&lt;repo&gt;.git<br />
                  git push -u origin main
                </div>
              </li>
              <li>เปิดเว็บ <a href="https://vercel.com" target="_blank" rel="noreferrer" className="underline font-bold">Vercel.com</a> กด <strong>Add New &gt; Project</strong> แล้วเลือก GitHub Repository นี้</li>
              <li>ในหน้าตั้งค่าก่อน Deploy ให้ใส่ Environment Variables ทั้ง 3 ตัวในข้อ 4 แล้วกด <strong>Deploy</strong></li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            เข้าใจแล้ว ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
