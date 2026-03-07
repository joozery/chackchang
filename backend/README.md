# Chackchang Backend API

Backend API สำหรับระบบตรวจสอบบัญชีดำช่าง (Technician Blacklist System)

## 🚀 Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **nginx** - Reverse proxy

## 📁 Project Structure

```
backend/
├── config/          # Database configuration
├── controllers/     # Request handlers
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── uploads/         # Uploaded files
├── server.js        # Main application file
├── package.json     # Dependencies
└── .env             # Environment variables
```

## 🔧 Setup & Installation

### 1. Install Dependencies
```bash
cd /srv/chackchang/backend
npm install
```

### 2. Configure Environment
Edit `.env` file:
```env
DB_HOST=145.223.21.117
DB_PORT=3306
DB_USER=debian-sys-maint
DB_PASSWORD=Str0ngP@ssw0rd!
DB_NAME=chackchang_db
PORT=5001
NODE_ENV=production
```

### 3. Initialize Database
```bash
node config/init-db.js
```

### 4. Start Server

**Development:**
```bash
npm run dev
```

**Production (with systemd):**
```bash
systemctl start chackchang-backend
systemctl status chackchang-backend
```

## 📡 API Endpoints

### Base URL
- **Production:** `https://xn--72cbg6b0a6c2az1a6c5o.com/api`
- **Local:** `http://localhost:5001/api`

### Public Endpoints

#### 1. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-11-19T07:42:55.000Z"
}
```

#### 2. Get API Info
```http
GET /api
```

**Response:**
```json
{
  "success": true,
  "message": "Chackchang API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "blacklist": "/api/blacklist",
    "public": "/api/blacklist/public",
    "stats": "/api/blacklist/stats"
  }
}
```

#### 3. Get Approved Blacklist (Public)
```http
GET /api/blacklist/public
GET /api/blacklist/public?search=keyword
```

**Response:**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": 1,
      "reportId": "497050",
      "name": "สมชาย ทิ้งงาน",
      "idCard": "1234567890123",
      "offense": "รับเงินมัดจำแล้วหาย ไม่สามารถติดต่อได้",
      "workType": "รับซ่อมบ้าน งานทาสี",
      "reportedBy": "สมหญิง ใจดี",
      "bankAccount": "123-4-56789-0",
      "bankName": "ธนาคารกสิกรไทย",
      "transferDate": "2025-10-15",
      "postedDate": "2025-10-28 14:30",
      "date": "2025-11-19",
      "amount": "15000.00",
      "reportCount": 1,
      "totalAmount": "15000.00"
    }
  ]
}
```

#### 4. Get Statistics
```http
GET /api/blacklist/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 4,
    "pending": "0",
    "approved": "4",
    "rejected": "0",
    "totalAmount": "73500.00",
    "totalReports": "7"
  }
}
```

#### 5. Get Blacklist by ID
```http
GET /api/blacklist/public/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "reportId": "497050",
    "name": "สมชาย ทิ้งงาน",
    ...
  }
}
```

### Admin Endpoints

#### 6. Get All Blacklist (with filters)
```http
GET /api/blacklist
GET /api/blacklist?status=pending
GET /api/blacklist?search=keyword&status=approved&limit=10
```

**Response:**
```json
{
  "success": true,
  "count": 4,
  "data": [...]
}
```

#### 7. Create New Entry
```http
POST /api/blacklist
Content-Type: application/json

{
  "name": "ชื่อช่าง",
  "idCard": "1234567890123",
  "offense": "พฤติกรรมที่ถูกแจ้ง",
  "workType": "ประเภทงาน",
  "reportedBy": "ชื่อผู้แจ้ง",
  "bankAccount": "123-4-56789-0",
  "bankName": "ธนาคารกสิกรไทย",
  "transferDate": "2025-10-15",
  "postedDate": "2025-10-28 14:30:00",
  "amount": 15000,
  "description": "รายละเอียดเพิ่มเติม"
}
```

**Response:**
```json
{
  "success": true,
  "message": "เพิ่มข้อมูลสำเร็จ",
  "data": {
    "id": 5,
    "reportId": "497054"
  }
}
```

#### 8. Update Entry
```http
PUT /api/blacklist/:id
Content-Type: application/json

{
  "name": "ชื่อใหม่",
  "offense": "พฤติกรรมที่แก้ไข"
}
```

**Response:**
```json
{
  "success": true,
  "message": "แก้ไขข้อมูลสำเร็จ"
}
```

#### 9. Update Status
```http
PATCH /api/blacklist/:id/status
Content-Type: application/json

{
  "status": "approved"
}
```

**Valid statuses:** `pending`, `approved`, `rejected`

**Response:**
```json
{
  "success": true,
  "message": "อัปเดตสถานะสำเร็จ"
}
```

#### 10. Delete Entry
```http
DELETE /api/blacklist/:id
```

**Response:**
```json
{
  "success": true,
  "message": "ลบข้อมูลสำเร็จ"
}
```

## 🗄️ Database Schema

### blacklist table
```sql
CREATE TABLE blacklist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_id VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  id_card VARCHAR(20),
  offense TEXT NOT NULL,
  work_type VARCHAR(255),
  reported_by VARCHAR(255) NOT NULL,
  bank_account VARCHAR(50),
  bank_name VARCHAR(100),
  transfer_date DATE,
  posted_date DATETIME,
  amount DECIMAL(10, 2) DEFAULT 0,
  report_count INT DEFAULT 1,
  total_amount DECIMAL(10, 2) DEFAULT 0,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔐 Security

- CORS enabled for specific domains
- Helmet.js for security headers
- Input validation with express-validator
- SQL injection prevention with prepared statements
- HTTPS enforced in production

## 📝 Logs

- **Application logs:** `/var/log/chackchang-backend.log`
- **Error logs:** `/var/log/chackchang-backend-error.log`

## 🛠️ Systemd Service

**Service file:** `/etc/systemd/system/chackchang-backend.service`

**Commands:**
```bash
# Start
systemctl start chackchang-backend

# Stop
systemctl stop chackchang-backend

# Restart
systemctl restart chackchang-backend

# Status
systemctl status chackchang-backend

# View logs
journalctl -u chackchang-backend -f
```

## 🌐 Production URL

**Website:** https://xn--72cbg6b0a6c2az1a6c5o.com (ตรวจสอบช่าง.com)  
**API:** https://xn--72cbg6b0a6c2az1a6c5o.com/api

## 📞 Support

For issues or questions, please contact the system administrator.

---

**Last Updated:** November 19, 2025

