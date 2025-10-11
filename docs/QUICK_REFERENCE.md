# SLBFE HRM System - Quick Reference Guide

## 🚀 Quick Start Commands

### Backend Development
```bash
# Restore dependencies
dotnet restore

# Build project
dotnet build

# Run in development
dotnet run

# Run with watch (auto-reload)
dotnet watch run

# Create migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Publish for production
dotnet publish -c Release -o ./publish
```

### Frontend Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

---

## 📁 Important File Locations

### Configuration Files
- **Backend Dev Config**: `backend/SLBFE.HRM.API/appsettings.json`
- **Backend Prod Config**: `backend/SLBFE.HRM.API/appsettings.Production.json`
- **Backend IIS Config**: `backend/SLBFE.HRM.API/web.config`
- **Frontend Config**: `frontend/vite.config.ts`
- **Frontend IIS Config**: `frontend/public/web.config`

### Key Source Files
- **API Entry Point**: `backend/SLBFE.HRM.API/Program.cs`
- **Database Context**: `backend/SLBFE.HRM.API/Data/ApplicationDbContext.cs`
- **Frontend API Service**: `frontend/src/services/api.ts`
- **Error Handling**: `backend/SLBFE.HRM.API/Middleware/ExceptionHandlingMiddleware.cs`
- **Request Logging**: `backend/SLBFE.HRM.API/Middleware/RequestLoggingMiddleware.cs`

---

## 🔧 Configuration Updates Needed

### Before Production Deployment

1. **Update `appsettings.Production.json`:**
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "YOUR_PRODUCTION_CONNECTION_STRING"
     },
     "JwtSettings": {
       "SecretKey": "GENERATE_SECURE_256_BIT_KEY"
     },
     "CORS": {
       "AllowedOrigins": ["https://hrm.slbfe.lk"]
     }
   }
   ```

2. **Update Frontend API URL:**
   - Create `.env.production` in frontend folder:
   ```
   VITE_API_BASE_URL=https://hrm-api.slbfe.lk/api
   ```

3. **SSL Certificate:**
   - Install SSL certificate in Windows certificate store
   - Update IIS bindings with certificate

---

## 🗄️ Database Setup

### Initial Setup
```powershell
# Run database setup script (PowerShell as Admin)
.\setup-database.ps1 -ServerName "YOUR_SERVER" -AdminPassword "SA_PASSWORD" -AppPassword "APP_PASSWORD"
```

### Manual Setup (SQL)
```sql
-- Create database
CREATE DATABASE SLBFE_HRM_DB;

-- Create login
CREATE LOGIN hrm_user WITH PASSWORD = 'YourSecurePassword';

-- Create user
USE SLBFE_HRM_DB;
CREATE USER hrm_user FOR LOGIN hrm_user;
ALTER ROLE db_owner ADD MEMBER hrm_user;
```

### Connection String Format
```
Server=YOUR_SERVER;Database=SLBFE_HRM_DB;User Id=hrm_user;Password=YOUR_PASSWORD;TrustServerCertificate=True;MultipleActiveResultSets=true;
```

---

## 🚢 Deployment Commands

### Automated Deployment (Recommended)
```powershell
# Deploy everything (Run as Administrator)
.\deploy-all.ps1

# Deploy backend only
.\deploy-backend.ps1

# Deploy frontend only
.\deploy-frontend.ps1
```

### Manual Backend Deployment
```bash
# Build and publish
dotnet publish -c Release -o ./publish

# Copy to IIS directory
xcopy /E /Y .\publish C:\inetpub\wwwroot\SLBFE-HRM-API\
```

### Manual Frontend Deployment
```bash
# Build
npm run build

# Copy to IIS directory
xcopy /E /Y .\dist C:\inetpub\wwwroot\SLBFE-HRM-Frontend\
```

---

## 🔐 Default Users (Development)

### Admin User
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Administrator
- **Access**: Full system access

### HR Manager
- **Username**: `hrmanager`
- **Password**: `hrpass123`
- **Role**: HR Manager
- **Access**: HR operations + Medical Claims

### Employee
- **Username**: `employee`
- **Password**: `emp123`
- **Role**: Employee
- **Access**: Self-service portal

---

## 🔍 Common Issues & Solutions

### Issue: Database Connection Fails
**Solution:**
```bash
# Check SQL Server is running
Get-Service MSSQLSERVER

# Test connection
sqlcmd -S localhost -U sa -P YourPassword -Q "SELECT @@VERSION"

# Update connection string in appsettings.json
```

### Issue: JWT Authentication Fails
**Solution:**
- Verify JWT SecretKey in appsettings.json (min 256 bits)
- Check token expiration settings
- Clear browser cookies/localStorage

### Issue: CORS Errors
**Solution:**
```json
// Update appsettings.json CORS settings
"CORS": {
  "AllowedOrigins": ["http://localhost:3000", "https://your-domain.com"]
}
```

### Issue: Build Fails
**Solution:**
```bash
# Backend
dotnet clean
dotnet restore
dotnet build

# Frontend
rm -rf node_modules
npm install
npm run build
```

---

## 📊 API Endpoints Quick Reference

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Password reset
- `GET /api/auth/me` - Get current user

### Employees
- `GET /api/employees` - List employees
- `GET /api/employees/{id}` - Get employee
- `POST /api/employees` - Create employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

### Salary
- `GET /api/salary/records` - List salary records
- `POST /api/salary/adjustments` - Create adjustment
- `POST /api/salary/adjustments/{id}/approve` - Approve adjustment
- `GET /api/salary/increments` - List upcoming increments

### Loans
- `GET /api/loans` - List loans
- `POST /api/loans` - Create loan
- `POST /api/loans/{id}/approve` - Approve loan
- `GET /api/loans/eligibility` - Check eligibility

### Reports
- `GET /api/reports/configs` - List report configs
- `POST /api/reports/generate` - Generate report
- `GET /api/reports/download/{id}` - Download report

### Health & System
- `GET /` - API status
- `GET /health` - Health check
- `GET /swagger` - API documentation

---

## 🛡️ Security Best Practices

### Password Requirements
- Minimum 8 characters
- Must include uppercase letter
- Must include lowercase letter
- Must include digit
- Must include special character

### JWT Token
- Expiration: 480 minutes (8 hours)
- Stored in localStorage
- Sent in Authorization header: `Bearer {token}`

### File Uploads
- Max size: 10MB
- Allowed types: PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG
- Stored in: `C:\SLBFE\HRM\Files`

---

## 📈 Performance Monitoring

### Key Metrics to Monitor
- API response time (target: <200ms)
- Database query time (target: <100ms)
- Memory usage
- CPU usage
- Active connections

### Log Locations
- **Application Logs**: `backend/SLBFE.HRM.API/Logs/`
- **IIS Logs**: `C:\inetpub\logs\LogFiles`
- **SQL Server Logs**: SQL Server Management Studio

### Health Check URL
```
http://localhost:5000/health
```

---

## 🔄 Backup & Recovery

### Automated Backups
- **Full Backup**: Daily at 2:00 AM
- **Differential**: Every 6 hours
- **Transaction Log**: Every 30 minutes
- **Location**: `D:\Backups\SLBFE_HRM`

### Manual Backup (SQL)
```sql
-- Full backup
BACKUP DATABASE SLBFE_HRM_DB
TO DISK = 'D:\Backups\SLBFE_HRM_Full.bak'
WITH FORMAT, COMPRESSION;

-- Restore
RESTORE DATABASE SLBFE_HRM_DB
FROM DISK = 'D:\Backups\SLBFE_HRM_Full.bak'
WITH REPLACE;
```

---

## 📞 Support & Resources

### Documentation
- **Deployment Guide**: `docs/IIS_DEPLOYMENT_OPTIMIZATION.md`
- **Code Analysis**: `docs/CODE_STRUCTURE_ANALYSIS.md`
- **Deployment Scripts**: `docs/DEPLOYMENT_SCRIPTS.md`

### External Resources
- [ASP.NET Core Docs](https://docs.microsoft.com/aspnet/core)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [IIS Documentation](https://docs.microsoft.com/iis)

### Contact
- **IT Support**: it@slbfe.lk
- **Development**: dev@slbfe.lk
- **Hotline**: 1989

---

## 🎯 Development Workflow

### Feature Development
1. Create feature branch: `git checkout -b feature/feature-name`
2. Implement feature
3. Write unit tests
4. Update documentation
5. Create pull request
6. Code review
7. Merge to main

### Database Changes
1. Create migration: `dotnet ef migrations add MigrationName`
2. Review generated migration
3. Test locally: `dotnet ef database update`
4. Commit migration files
5. Apply to production during deployment

### Release Process
1. Update version numbers
2. Run all tests
3. Build production packages
4. Backup production database
5. Deploy to staging
6. User acceptance testing
7. Deploy to production
8. Monitor logs and performance

---

**Last Updated**: October 5, 2025  
**Version**: 1.0
