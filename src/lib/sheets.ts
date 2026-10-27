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

function getWebAppUrl(): string | null {
  const rawUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;
  if (!rawUrl) return null;
  return rawUrl.replace(/\/a\/macros\/[^/]+\/s\//, '/macros/s/');
}

/**
 * Backup all in-memory tasks to Google Sheet via Service Account or Apps Script
 */
export async function backupAllTasksToSheet(customTasks?: Task[]): Promise<{ success: boolean; message: string; count: number }> {
  const targetTasks = customTasks && customTasks.length > 0 ? customTasks : inMemoryTasks;
  const webAppUrl = getWebAppUrl();

  // 1. Try Apps Script Web App if configured
  if (webAppUrl) {
    try {
      const res = await fetch(webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'backup',
          tasks: targetTasks,
        }),
        redirect: 'follow',
      });
      const data = await res.json();
      inMemoryTasks = targetTasks;
      return {
        success: true,
        message: 'สำรองข้อมูลลง Google Sheet เรียบร้อยแล้ว (' + (data.count || targetTasks.length) + ' รายการ)',
        count: data.count || targetTasks.length,
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
  const webAppUrl = getWebAppUrl();
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

    if (tasks.length > 0) {
      inMemoryTasks = tasks;
      return tasks;
    }
    return inMemoryTasks;
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

  // Ensure we have the latest list from Google Sheets before prepending
  const existing = await getTasks();
  inMemoryTasks = [newTask, ...existing.filter(t => t.id !== id)];

  // Sync immediately to Google Sheet via Web App
  const webAppUrl = getWebAppUrl();
  if (webAppUrl) {
    try {
      await fetch(webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'backup',
          tasks: inMemoryTasks,
        }),
        redirect: 'follow',
      });
    } catch (err) {
      console.error('Error syncing new task to Apps Script Web App:', err);
    }
    return newTask;
  }

  // Fallback to Service Account if configured
  const creds = getAuth();
  if (creds) {
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
    } catch (err) {
      console.error('Error appending task to Google Sheets via Service Account:', err);
    }
  }

  return newTask;
}

/**
 * Update an existing task in Google Sheets
 */
export async function updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
  const now = new Date().toISOString();

  // Load latest state first
  const currentTasks = await getTasks();
  const idx = currentTasks.findIndex(t => t.id === id);

  if (idx === -1) {
    return null;
  }

  const updatedTask: Task = {
    ...currentTasks[idx],
    ...updates,
    updatedAt: now,
  };

  currentTasks[idx] = updatedTask;
  inMemoryTasks = currentTasks;

  // Sync to Google Sheet via Web App
  const webAppUrl = getWebAppUrl();
  if (webAppUrl) {
    try {
      await fetch(webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'backup',
          tasks: inMemoryTasks,
        }),
        redirect: 'follow',
      });
    } catch (err) {
      console.error('Error syncing updated task to Apps Script Web App:', err);
    }
    return updatedTask;
  }

  // Fallback to Service Account if configured
  const creds = getAuth();
  if (creds) {
    try {
      const sheets = google.sheets({ version: 'v4', auth: creds.auth });
      const rowNum = idx + 2;
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
    } catch (err) {
      console.error('Error updating task in Google Sheets via Service Account:', err);
    }
  }

  return updatedTask;
}

/**
 * Delete a task from Google Sheets
 */
export async function deleteTask(id: string): Promise<boolean> {
  const currentTasks = await getTasks();
  const exists = currentTasks.some(t => t.id === id);
  if (!exists) return false;

  inMemoryTasks = currentTasks.filter(t => t.id !== id);

  const webAppUrl = getWebAppUrl();
  if (webAppUrl) {
    try {
      await fetch(webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'backup',
          tasks: inMemoryTasks,
        }),
        redirect: 'follow',
      });
    } catch (err) {
      console.error('Error syncing deleteTask to Apps Script:', err);
    }
  }

  return true;
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
