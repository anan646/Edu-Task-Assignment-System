import { google } from 'googleapis';
import { Department, Task, User } from '@/types';
import { INITIAL_DEPARTMENTS, INITIAL_TASKS, INITIAL_USERS } from './initial-data';

// In-memory fallback cache when Google Sheets is not configured or in development
let inMemoryTasks: Task[] = [...INITIAL_TASKS];
const inMemoryDepartments: Department[] = [...INITIAL_DEPARTMENTS];
const inMemoryUsers: User[] = [...INITIAL_USERS];

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email || !privateKey || !sheetId) {
    return null;
  }

  // Handle escaped newlines from environment variables
  privateKey = privateKey.replace(/\\n/g, '\n');

  try {
    const auth = new google.auth.JWT({
      email,
      key: privateKey,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.readonly',
      ],
    });
    return { auth, sheetId };
  } catch (err) {
    console.error('Google Auth configuration error:', err);
    return null;
  }
}

export function isGoogleSheetsConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SHEET_WEBAPP_URL ||
    (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
     process.env.GOOGLE_PRIVATE_KEY &&
     process.env.GOOGLE_SHEET_ID)
  );
}

export function getConfigStatus() {
  const isWebapp = Boolean(process.env.GOOGLE_SHEET_WEBAPP_URL);
  const isServiceAccount = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_SHEET_ID
  );

  return {
    isConfigured: isWebapp || isServiceAccount,
    method: isWebapp ? 'apps_script' : isServiceAccount ? 'service_account' : 'demo',
    sheetId: process.env.GOOGLE_SHEET_ID ? `${process.env.GOOGLE_SHEET_ID.slice(0, 8)}...` : undefined,
    clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || undefined,
    webAppUrl: process.env.GOOGLE_SHEET_WEBAPP_URL ? `${process.env.GOOGLE_SHEET_WEBAPP_URL.slice(0, 30)}...` : undefined,
  };
}

/**
 * Backup all in-memory tasks to Google Sheet via Service Account or Apps Script
 */
export async function backupAllTasksToSheet(): Promise<{ success: boolean; message: string; count: number }> {
  const webAppUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;

  // 1. Try Apps Script Web App if configured
  if (webAppUrl) {
    try {
      const res = await fetch(webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'backup',
          tasks: inMemoryTasks,
        }),
        redirect: 'follow',
      });
      const data = await res.json();
      return {
        success: true,
        message: 'สำรองข้อมูลลง Google Sheet เรียบร้อยแล้ว (' + (data.count || inMemoryTasks.length) + ' รายการ)',
        count: data.count || inMemoryTasks.length,
      };
    } catch (err) {
      console.error('Error backing up to Apps Script Web App:', err);
      return {
        success: false,
        message: 'ไม่สามารถสำรองข้อมูลผ่าน Web App ได้: ' + String(err),
        count: 0,
      };
    }
  }

  // 2. Try Google Service Account if configured
  const creds = getAuth();
  if (creds) {
    try {
      const sheets = google.sheets({ version: 'v4', auth: creds.auth });
      await ensureTasksSheet(sheets, creds.sheetId);

      const headers = [
        'ID',
        'Title',
        'Description',
        'DepartmentId',
        'AssignedTo',
        'AssignedBy',
        'Priority',
        'Status',
        'DueDate',
        'Notes',
        'CreatedAt',
        'UpdatedAt',
      ];

      const rows = inMemoryTasks.map(t => [
        t.id,
        t.title,
        t.description,
        t.departmentId,
        t.assignedTo,
        t.assignedBy,
        t.priority,
        t.status,
        t.dueDate,
        t.notes || '',
        t.createdAt,
        t.updatedAt,
      ]);

      // Overwrite sheet with complete backup
      await sheets.spreadsheets.values.update({
        spreadsheetId: creds.sheetId,
        range: 'Tasks!A1:L' + (rows.length + 1),
        valueInputOption: 'RAW',
        requestBody: {
          values: [headers, ...rows],
        },
      });

      return {
        success: true,
        message: 'สำรองข้อมูลลง Google Sheet เรียบร้อยแล้ว',
        count: inMemoryTasks.length,
      };
    } catch (err) {
      console.error('Error backing up via Service Account:', err);
      return {
        success: false,
        message: 'เกิดข้อผิดพลาดในการสำรองข้อมูลผ่าน Service Account: ' + String(err),
        count: 0,
      };
    }
  }

  return {
    success: false,
    message: 'ยังไม่ได้ตั้งค่า Google Sheet Web App URL หรือ Service Account ในระบบ',
    count: inMemoryTasks.length,
  };
}

/**
 * Ensure the sheet has the required tab and headers
 */
async function ensureTasksSheet(sheets: ReturnType<typeof google.sheets>, spreadsheetId: string) {
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetExists = meta.data.sheets?.some(s => s.properties?.title === 'Tasks');

    if (!sheetExists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: { title: 'Tasks' },
              },
            },
          ],
        },
      });
    }

    // Check if headers exist
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Tasks!A1:L1',
    });

    if (!res.data.values || res.data.values.length === 0) {
      const headers = [
        'ID',
        'Title',
        'Description',
        'DepartmentId',
        'AssignedTo',
        'AssignedBy',
        'Priority',
        'Status',
        'DueDate',
        'Notes',
        'CreatedAt',
        'UpdatedAt',
      ];

      const initialRows = inMemoryTasks.map(t => [
        t.id,
        t.title,
        t.description,
        t.departmentId,
        t.assignedTo,
        t.assignedBy,
        t.priority,
        t.status,
        t.dueDate,
        t.notes || '',
        t.createdAt,
        t.updatedAt,
      ]);

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Tasks!A1:L' + (initialRows.length + 1),
        valueInputOption: 'RAW',
        requestBody: {
          values: [headers, ...initialRows],
        },
      });
    }
  } catch (err) {
    console.error('Error ensuring Tasks sheet:', err);
  }
}

/**
 * Fetch all tasks from Google Sheets (or fallback)
 */
export async function getTasks(): Promise<Task[]> {
  const webAppUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;
  if (webAppUrl) {
    try {
      const res = await fetch(`${webAppUrl}?action=getTasks`, { cache: 'no-store', redirect: 'follow' });
      const data = await res.json();
      if (data && Array.isArray(data.tasks) && data.tasks.length > 0) {
        const formattedTasks: Task[] = data.tasks.map((t: Task) => ({
          ...t,
          dueDate: t.dueDate ? String(t.dueDate).slice(0, 10) : '',
        }));
        inMemoryTasks = formattedTasks;
        return formattedTasks;
      }
    } catch (err) {
      console.error('Error fetching from Google Apps Script Web App:', err);
    }
  }

  const creds = getAuth();
  if (!creds) {
    return inMemoryTasks;
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth: creds.auth });
    await ensureTasksSheet(sheets, creds.sheetId);

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: creds.sheetId,
      range: 'Tasks!A2:L',
    });

    const rows = res.data.values || [];
    const tasks: Task[] = rows
      .filter(row => row && row[0])
      .map(row => ({
        id: row[0] || '',
        title: row[1] || '',
        description: row[2] || '',
        departmentId: row[3] || '',
        assignedTo: row[4] || '',
        assignedBy: row[5] || '',
        priority: (row[6] as Task['priority']) || 'normal',
        status: (row[7] as Task['status']) || 'pending',
        dueDate: row[8] || '',
        notes: row[9] || '',
        createdAt: row[10] || new Date().toISOString(),
        updatedAt: row[11] || new Date().toISOString(),
      }));

    return tasks.length > 0 ? tasks : inMemoryTasks;
  } catch (err) {
    console.error('Error fetching tasks from Google Sheets, using fallback:', err);
    return inMemoryTasks;
  }
}

/**
 * Add a new task to Google Sheets
 */
export async function createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
  const id = `TSK-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const newTask: Task = {
    ...task,
    id,
    createdAt: now,
    updatedAt: now,
  };

  inMemoryTasks = [newTask, ...inMemoryTasks];

  const webAppUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;
  if (webAppUrl) {
    try {
      await fetch(webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createTask', task: newTask }),
      });
    } catch (err) {
      console.error('Error creating task in Apps Script Web App:', err);
    }
    return newTask;
  }

  const creds = getAuth();
  if (!creds) {
    return newTask;
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth: creds.auth });
    await ensureTasksSheet(sheets, creds.sheetId);

    const row = [
      newTask.id,
      newTask.title,
      newTask.description,
      newTask.departmentId,
      newTask.assignedTo,
      newTask.assignedBy,
      newTask.priority,
      newTask.status,
      newTask.dueDate,
      newTask.notes || '',
      newTask.createdAt,
      newTask.updatedAt,
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: creds.sheetId,
      range: 'Tasks!A:L',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    return newTask;
  } catch (err) {
    console.error('Error appending task to Google Sheets:', err);
    return newTask;
  }
}

/**
 * Update an existing task in Google Sheets
 */
export async function updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
  const now = new Date().toISOString();
  const idx = inMemoryTasks.findIndex(t => t.id === id);
  if (idx !== -1) {
    inMemoryTasks[idx] = {
      ...inMemoryTasks[idx],
      ...updates,
      updatedAt: now,
    };
  }

  const webAppUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;
  if (webAppUrl) {
    try {
      await fetch(webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateTask', id, updates }),
      });
    } catch (err) {
      console.error('Error updating task in Apps Script Web App:', err);
    }
    return inMemoryTasks[idx] || null;
  }

  const creds = getAuth();
  if (!creds) {
    return inMemoryTasks[idx] || null;
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth: creds.auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: creds.sheetId,
      range: 'Tasks!A2:L',
    });

    const rows = res.data.values || [];
    const rowIndex = rows.findIndex(row => row[0] === id);

    if (rowIndex === -1) {
      return inMemoryTasks[idx] || null;
    }

    const currentRow = rows[rowIndex];
    const updatedTask: Task = {
      id: currentRow[0],
      title: updates.title !== undefined ? updates.title : currentRow[1],
      description: updates.description !== undefined ? updates.description : currentRow[2],
      departmentId: updates.departmentId !== undefined ? updates.departmentId : currentRow[3],
      assignedTo: updates.assignedTo !== undefined ? updates.assignedTo : currentRow[4],
      assignedBy: updates.assignedBy !== undefined ? updates.assignedBy : currentRow[5],
      priority: (updates.priority !== undefined ? updates.priority : currentRow[6]) as Task['priority'],
      status: (updates.status !== undefined ? updates.status : currentRow[7]) as Task['status'],
      dueDate: updates.dueDate !== undefined ? updates.dueDate : currentRow[8],
      notes: updates.notes !== undefined ? updates.notes : currentRow[9],
      createdAt: currentRow[10] || now,
      updatedAt: now,
    };

    const rowNum = rowIndex + 2;
    await sheets.spreadsheets.values.update({
      spreadsheetId: creds.sheetId,
      range: `Tasks!A${rowNum}:L${rowNum}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          updatedTask.id,
          updatedTask.title,
          updatedTask.description,
          updatedTask.departmentId,
          updatedTask.assignedTo,
          updatedTask.assignedBy,
          updatedTask.priority,
          updatedTask.status,
          updatedTask.dueDate,
          updatedTask.notes || '',
          updatedTask.createdAt,
          updatedTask.updatedAt,
        ]],
      },
    });

    return updatedTask;
  } catch (err) {
    console.error('Error updating task in Google Sheets:', err);
    return inMemoryTasks[idx] || null;
  }
}

/**
 * Get departments
 */
export async function getDepartments(): Promise<Department[]> {
  return inMemoryDepartments;
}

/**
 * Get users
 */
export async function getUsers(): Promise<User[]> {
  return inMemoryUsers;
}
