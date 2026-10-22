import { NextResponse } from 'next/server';
import { getTasks, createTask, getDepartments, getUsers, getConfigStatus } from '@/lib/sheets';

export async function GET() {
  try {
    const [tasks, departments, users] = await Promise.all([
      getTasks(),
      getDepartments(),
      getUsers(),
    ]);

    const config = getConfigStatus();

    return NextResponse.json({
      success: true,
      tasks,
      departments,
      users,
      config,
    });
  } catch (err: unknown) {
    console.error('API Error in GET /api/tasks:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve tasks' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title || !body.departmentId || !body.assignedTo) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (title, departmentId, assignedTo)' },
        { status: 400 }
      );
    }

    const newTask = await createTask({
      title: body.title,
      description: body.description || '',
      departmentId: body.departmentId,
      assignedTo: body.assignedTo,
      assignedBy: body.assignedBy || 'หัวหน้างาน (Supervisor)',
      priority: body.priority || 'normal',
      status: body.status || 'pending',
      dueDate: body.dueDate || new Date().toISOString().split('T')[0],
      notes: body.notes || '',
    });

    return NextResponse.json({
      success: true,
      task: newTask,
    });
  } catch (err: unknown) {
    console.error('API Error in POST /api/tasks:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
