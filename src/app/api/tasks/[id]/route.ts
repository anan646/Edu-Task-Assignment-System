import { NextResponse } from 'next/server';
import { updateTask } from '@/lib/sheets';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await req.json();

    const updated = await updateTask(id, updates);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      task: updated,
    });
  } catch (err: unknown) {
    console.error('API Error in PATCH /api/tasks/[id]:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to update task' },
      { status: 500 }
    );
  }
}
