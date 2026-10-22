import { NextResponse } from 'next/server';
import { getConfigStatus } from '@/lib/sheets';

export async function GET() {
  const status = getConfigStatus();
  return NextResponse.json(status);
}
