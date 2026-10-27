import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ระบบมอบหมายงานองค์กร | Task Assignment System',
  description: 'ระบบมอบหมายงาน ติดตามสถานะงานข้ามฝ่าย พร้อมจัดเก็บข้อมูลลง Google Sheets',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="h-full">
      <body className="min-h-full flex flex-col font-sans antialiased text-slate-900 bg-slate-50">
        {children}
      </body>
    </html>
  );
}
