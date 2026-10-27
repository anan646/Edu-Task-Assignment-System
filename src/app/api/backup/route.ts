import { NextResponse } from 'next/server';
import { backupAllTasksToSheet } from '@/lib/sheets';

export async function POST() {
  try {
    const result = await backupAllTasksToSheet();
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error('Error in POST /api/backup:', err);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการสำรองข้อมูล: ' + String(err) },
      { status: 500 }
    );
  }
}
