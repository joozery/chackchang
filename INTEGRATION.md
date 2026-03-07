# Frontend - Backend Integration Guide

## ✅ Integration Status: COMPLETE

Frontend React application has been successfully integrated with the Backend API.

---

## 🔗 API Configuration

### Configuration File
**Location:** `/srv/chackchang/src/config/api.js`

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
```

The frontend uses `/api` as the base URL, which is proxied by nginx to `http://localhost:5001/api`

---

## 📦 Service Layer

### Blacklist Service
**Location:** `/srv/chackchang/src/services/blacklistService.js`

All API calls are centralized in the service layer:
- `getApproved(search)` - Get approved blacklist (public)
- `getById(id)` - Get entry by ID
- `getStats()` - Get statistics
- `getAll(filters)` - Get all entries with filters (admin)
- `create(data)` - Create new entry
- `update(id, data)` - Update entry
- `updateStatus(id, status)` - Update status
- `delete(id)` - Delete entry

---

## 📄 Updated Pages

### 1. HomePage (`/srv/chackchang/src/pages/HomePage.jsx`)
**Changes:**
- ✅ Replaced `localStorage` with API calls
- ✅ Added `blacklistService.getApproved()` to fetch data
- ✅ Added loading and error states
- ✅ Fallback to initial data if API fails

**API Endpoint Used:**
- `GET /api/blacklist/public`

---

### 2. DetailPage (`/srv/chackchang/src/pages/DetailPage.jsx`)
**Changes:**
- ✅ Replaced `localStorage` with API calls
- ✅ Added `blacklistService.getById(id)` to fetch entry
- ✅ Added loading and error states

**API Endpoint Used:**
- `GET /api/blacklist/public/:id`

---

### 3. ReportPage (`/srv/chackchang/src/pages/ReportPage.jsx`)
**Changes:**
- ✅ Replaced `localStorage` save with API call
- ✅ Added `blacklistService.create(data)` to submit report
- ✅ Added error handling with toast notifications
- ✅ Properly formatted data for API (camelCase to API format)

**API Endpoint Used:**
- `POST /api/blacklist`

**Data Transformation:**
```javascript
{
  name, idCard, offense, workType, reportedBy,
  bankAccount, bankName, transferDate, postedDate,
  amount, description, reportCount, totalAmount
}
```

---

### 4. ManageBlacklistPage (`/srv/chackchang/src/pages/admin/ManageBlacklistPage.jsx`)
**Changes:**
- ✅ Replaced `localStorage` with API calls
- ✅ Added `blacklistService.getAll()` to fetch all entries
- ✅ Added `blacklistService.create()` for adding entries
- ✅ Added `blacklistService.update()` for editing entries
- ✅ Added `blacklistService.updateStatus()` for status changes
- ✅ Added `blacklistService.delete()` for deleting entries
- ✅ Added error handling for all operations

**API Endpoints Used:**
- `GET /api/blacklist?status=...&search=...`
- `POST /api/blacklist`
- `PUT /api/blacklist/:id`
- `PATCH /api/blacklist/:id/status`
- `DELETE /api/blacklist/:id`

---

## 🌐 Nginx Configuration

### Proxy Configuration
**File:** `/etc/nginx/sites-available/xn--72cbg6b0a6c2az1a6c5o.com`

```nginx
# Backend API proxy
location /api/ {
    proxy_pass http://127.0.0.1:5001/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # CORS headers
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
}
```

---

## 🧪 Testing

### Frontend URL
https://xn--72cbg6b0a6c2az1a6c5o.com (ตรวจสอบช่าง.com)

### Test API Endpoints

**1. Health Check**
```bash
curl https://xn--72cbg6b0a6c2az1a6c5o.com/api/health
```

**2. Get Public Blacklist**
```bash
curl https://xn--72cbg6b0a6c2az1a6c5o.com/api/blacklist/public
```

**3. Get Statistics**
```bash
curl https://xn--72cbg6b0a6c2az1a6c5o.com/api/blacklist/stats
```

**4. Search Blacklist**
```bash
curl "https://xn--72cbg6b0a6c2az1a6c5o.com/api/blacklist/public?search=สมชาย"
```

---

## 🔄 Data Flow

### Public User Flow
1. User visits homepage
2. React app calls `blacklistService.getApproved()`
3. Service makes `fetch('/api/blacklist/public')`
4. Nginx proxies to `http://localhost:5001/api/blacklist/public`
5. Backend API queries MySQL database
6. Data returned → React renders UI

### Report Submission Flow
1. User fills report form
2. React calls `blacklistService.create(data)`
3. Service POSTs to `/api/blacklist`
4. Nginx proxies to backend
5. Backend validates and inserts to MySQL
6. Success response → User redirected to homepage

### Admin Management Flow
1. Admin views dashboard
2. React calls `blacklistService.getAll()`
3. Admin can:
   - View all entries (including pending)
   - Approve/Reject entries
   - Edit entries
   - Delete entries
4. All actions call respective API endpoints
5. Backend updates MySQL
6. React updates UI

---

## 📊 Database Tables

### blacklist
Main table storing all reports:
- `id`, `report_id`, `name`, `id_card`
- `offense`, `work_type`, `reported_by`
- `bank_account`, `bank_name`, `transfer_date`, `posted_date`
- `amount`, `report_count`, `total_amount`
- `status` (pending/approved/rejected)
- `description`, `created_at`, `updated_at`

---

## 🚀 Deployment

### Frontend
- **Path:** `/srv/chackchang/dist/`
- **Build:** `npm run build`
- **Served by:** nginx (static files)

### Backend
- **Path:** `/srv/chackchang/backend/`
- **Service:** `chackchang-backend.service` (systemd)
- **Port:** 5001 (proxied by nginx)
- **Logs:** `/var/log/chackchang-backend.log`

### Commands
```bash
# Rebuild frontend
cd /srv/chackchang && npm run build

# Restart backend
systemctl restart chackchang-backend

# Reload nginx
systemctl reload nginx

# View logs
tail -f /var/log/chackchang-backend.log
journalctl -u chackchang-backend -f
```

---

## ✨ Features Implemented

✅ Public blacklist viewing  
✅ Search functionality  
✅ Detail page for each entry  
✅ Report submission form  
✅ Admin dashboard  
✅ CRUD operations (Create, Read, Update, Delete)  
✅ Status management (pending/approved/rejected)  
✅ Statistics display  
✅ Error handling  
✅ Loading states  
✅ Toast notifications  
✅ Responsive design  
✅ HTTPS with SSL  
✅ CORS configuration  
✅ API proxy through nginx  

---

## 🔮 Future Enhancements

- [ ] User authentication for admin panel
- [ ] Image upload support
- [ ] Export to CSV/PDF
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Pagination on backend
- [ ] Rate limiting
- [ ] API documentation (Swagger)
- [ ] Unit tests
- [ ] E2E tests

---

## 📚 Related Files

- Frontend: `/srv/chackchang/src/`
- Backend: `/srv/chackchang/backend/`
- Config: `/srv/chackchang/backend/.env`
- Nginx: `/etc/nginx/sites-available/xn--72cbg6b0a6c2az1a6c5o.com`
- Service: `/etc/systemd/system/chackchang-backend.service`
- Logs: `/var/log/chackchang-backend.log`

---

**Integration Completed:** November 19, 2025  
**Status:** ✅ Production Ready

