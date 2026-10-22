# ระบบมอบหมายงานองค์กร (Task Assignment System)

ระบบสั่งงาน ตรวจงาน และติดตามความคืบหน้างานระหว่างหัวหน้าและลูกน้องแต่ละฝ่าย พัฒนาด้วย **Next.js (App Router)**, **Tailwind CSS** และใช้ **Google Sheets เป็น Database** ฟรี 100% พร้อมรองรับการ Deploy ขึ้น **Vercel**

---

## 🌟 จุดเด่นของระบบ

1. **สลับมุมมองบทบาท (Role Switcher):**
   - **👔 หัวหน้าฝ่าย / ผู้บริหาร (Manager View):** สามารถกด "+ สั่งงานใหม่", มอบหมายงานข้ามฝ่าย, อนุมัติงาน (Review -> Completed), ตีกลับงานแก้ไข (Revise)
   - **👷 พนักงาน (Staff View):** ดูงานที่ได้รับมอบหมาย, กดเริ่มทำงาน (In Progress), ส่งงานให้ตรวจพร้อมแนบลิงก์ผลงาน (Review)
2. **มุมมองแบบ Kanban Board & Table:** ดูงานแบบการ์ด 4 คอลัมน์ หรือแบบตาราง
3. **ระบบค้นหาและตัวกรองรอบด้าน:** กรองตามฝ่าย (IT, การตลาด, บัญชี, HR, ปฏิบัติการ), กรองตามความเร่งด่วน, ค้นหาตามคำสำคัญ
4. **Google Sheets as a Database:**
   - ใช้งานฟรีตลอดชีพ
   - ตารางอัปเดตอัตโนมัติเมื่อมีการสั่งงาน/เปลี่ยนสถานะ
   - มีโหมด **Demo Mode** ที่ทดสอบใช้งานได้ทันทีแม้ยังไม่ได้ต่อ Google Sheet

---

## 🚀 การรันในเครื่อง (Local Development)

```bash
# 1. ติดตั้ง Dependencies (ถ้ายังไม่ได้ลง)
npm install

# 2. เริ่มต้นรันเซิร์ฟเวอร์
npm run dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

---

## 📊 ขั้นตอนการเชื่อมต่อ Google Sheets

### ขั้นที่ 1: สร้าง Google Sheets
1. ไปที่ [sheets.new](https://sheets.new) เพื่อสร้างชีตใหม่ ตั้งชื่อว่า **"ระบบมอบหมายงาน"**
2. คัดลอก **Spreadsheet ID** จาก URL:
   `https://docs.google.com/spreadsheets/d/`**[ID ตรงนี้]**`/edit`

### ขั้นที่ 2: สร้าง Service Account บน Google Cloud (ฟรี)
1. เข้าไปที่ [Google Cloud Console](https://console.cloud.google.com)
2. สร้างโปรเจกต์ใหม่ (หรือเลือกโปรเจกต์ที่มีอยู่แล้ว)
3. ไปที่เมนู **APIs & Services > Library** ค้นหา **"Google Sheets API"** แล้วกด **Enable**
4. ไปที่ **APIs & Services > Credentials** กด **Create Credentials > Service Account**
5. ตั้งชื่อ Service Account เช่น `task-bot` แล้วกดสร้างจนเสร็จ
6. คลิกที่ชื่อ Service Account ที่เพิ่งสร้าง > ไปที่แท็บ **Keys** > กด **Add Key > Create new key** เลือกประเภท **JSON** แล้วดาวน์โหลดไฟล์เก็บไว้

### ขั้นที่ 3: แชร์ชีตให้ Service Account
1. เปิดไฟล์ JSON ที่ดาวน์โหลดมา มองหาฟิลด์ `client_email` (เช่น `task-bot@my-project.iam.gserviceaccount.com`)
2. กลับไปที่ Google Sheets ของคุณ กดปุ่ม **แชร์ (Share)** ที่มุมบนขวา
3. วางอีเมล `client_email` ลงไป และกำหนดสิทธิ์เป็น **"ผู้แก้ไข (Editor)"**

### ขั้นที่ 4: ใส่ Environment Variables
สร้างไฟล์ `.env.local` ในโฟลเดอร์โปรเจกต์นี้:
```env
GOOGLE_SHEET_ID=ไอดีชีตจากขั้นที่_1
GOOGLE_SERVICE_ACCOUNT_EMAIL=อีเมล_service_account_จากขั้นที่_3
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```
*(หมายเหตุ: ต้องครอบด้วยเครื่องหมายคำพูดคู่ `"` และคง `\n` ไว้)*

---

## 🌐 ขั้นตอนการเชื่อม GitHub & นำขึ้น Vercel

### 1. สั่ง Git Push ขึ้น GitHub
```bash
git init
git add .
git commit -m "Initial commit: Task assignment system"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

### 2. นำขึ้น Vercel
1. สมัคร/ล็อกอินที่ [Vercel.com](https://vercel.com) (ใช้บัญชี GitHub ล็อกอินได้เลย)
2. กดปุ่ม **"Add New... > Project"**
3. เลือก Repository ที่เพิ่ง Push ขึ้นไป แล้วกด **Import**
4. ในส่วน **Environment Variables** ให้ใส่ค่า 3 ตัวเดิม:
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
5. กดปุ่ม **Deploy** ระบบจะเริ่ม Build และได้ URL เว็บไซต์จริง (เช่น `https://task-assignment-xxx.vercel.app`) พร้อมใช้งานได้ทันที!
