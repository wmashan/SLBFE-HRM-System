# SLBFE HR Management System

A comprehensive Human Resource Management System built specifically for the Sri Lanka Bureau of Foreign Employment (SLBFE).

## 📋 Project Overview

The SLBFE HRM System is designed to streamline HR operations for Sri Lanka's premier foreign employment bureau, managing staff across 50+ branches and facilitating overseas employment for thousands of Sri Lankan workers.

## 🏗️ Architecture

This project follows industry-standard architecture patterns:

```
SLBFE-HRM-System/
├── frontend/                 # React TypeScript Frontend
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── common/      # Shared components
│   │   │   ├── features/    # Feature-specific components
│   │   │   ├── layout/      # Layout components
│   │   │   └── ui/          # UI library components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── styles/          # Global styles
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   └── constants/       # Application constants
├── backend/                 # Node.js Backend (To be implemented)
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── config/          # Configuration files
├── docs/                    # Documentation
├── tests/                   # Test files
└── scripts/                 # Build and deployment scripts
```

## 🚀 Features

### Core HR Modules
- **Employee Management** - Comprehensive staff profiles and lifecycle management
- **Multi-Country Program Management** - Korea EPS, Japan Technical Training, Middle East programs
- **Training & Certification Tracking** - Pre-departure training coordination
- **Branch Network Management** - 50+ branch offices nationwide
- **Performance Analytics** - Program-specific metrics and reporting
- **Document Management** - Centralized document storage and retrieval

### SLBFE-Specific Features
- **Foreign Employment Programs** - Specialized workflows for different destination countries
- **Staff Assignment** - Assign staff to specific migrant worker cases
- **Branch Operations** - Multi-location management and reporting
- **Government Compliance** - Audit trails and regulatory compliance
- **24/7 Support Integration** - Integration with SLBFE hotline (1989)

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - Styling framework
- **Lucide React** - Icon library

### Backend
- **ASP.NET Core 8.0** - Web API framework
- **C#** - Programming language
- **Entity Framework Core** - ORM
- **Microsoft SQL Server** - Database
- **JWT Bearer** - Authentication
- **Serilog** - Logging framework
- **Hangfire** - Background jobs
- **AutoMapper** - Object mapping
- **FluentValidation** - Input validation

### Infrastructure
- **Windows Server** - Server OS
- **IIS 10.0+** - Web server
- **SQL Server 2019/2022** - Database server

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/wmashan/SLBFE-HRM-System.git
   cd SLBFE-HRM-System
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔄 Project Status

- ✅ **Frontend Foundation** - React setup, routing, authentication (95% Complete)
- ✅ **UI Components** - Reusable component library (100% Complete)
- ✅ **API Service Layer** - Comprehensive API integration (100% Complete)
- ✅ **Backend Structure** - ASP.NET Core 8.0 project setup (100% Complete)
- ✅ **IIS Configuration** - Production-ready web.config files (100% Complete)
- ✅ **Deployment Scripts** - Automated PowerShell scripts (100% Complete)
- 🚧 **Backend Implementation** - Controllers, services, models (10% Complete)
- 🚧 **Database Schema** - EF Core models and migrations (0% Complete)
- ⏳ **Testing Suite** - Unit and integration tests (0% Complete)

**Overall Progress**: ~40% Complete  
**Estimated Time to Production**: 8-12 weeks with dedicated team

## 📚 Documentation

### Quick Links
- [IIS Deployment Optimization Guide](docs/IIS_DEPLOYMENT_OPTIMIZATION.md)
- [Code Structure Analysis](docs/CODE_STRUCTURE_ANALYSIS.md)
- [Deployment Scripts](docs/DEPLOYMENT_SCRIPTS.md)
- [Quick Reference Guide](docs/QUICK_REFERENCE.md)

### Key Features Implemented

#### Backend Infrastructure
- ✅ JWT Authentication with role-based authorization
- ✅ Global exception handling middleware
- ✅ Request/response logging with Serilog
- ✅ Response caching and compression (Brotli/Gzip)
- ✅ Health checks for system monitoring
- ✅ Swagger/OpenAPI documentation
- ✅ Security headers (HSTS, X-Frame-Options, CSP)
- ✅ EF Core with automatic audit fields

#### Deployment Optimization
- ✅ IIS-optimized web.config for both frontend and backend
- ✅ Production-ready appsettings with environment-specific configs
- ✅ Automated PowerShell deployment scripts
- ✅ Database setup automation
- ✅ SSL certificate integration
- ✅ Application pool configuration
- ✅ Automated backup before deployment

#### Security Features
- ✅ JWT token-based authentication
- ✅ Role-based access control (Admin, HR, Senior HR, Employee)
- ✅ Password policy enforcement ready
- ✅ HTTPS enforcement
- ✅ CORS configuration
- ✅ Request size limits
- ✅ SQL injection protection (EF Core)

## 🚀 Deployment Guide

### Prerequisites
- Windows Server 2019/2022
- IIS 10.0+ with ASP.NET Core Hosting Bundle
- .NET 8.0 SDK and Runtime
- SQL Server 2019/2022
- Node.js 18+
- SSL Certificate (for production)

### Quick Deployment

**Option 1: Automated (Recommended)**
```powershell
# Run as Administrator
.\deploy-all.ps1
```

**Option 2: Manual Backend**
```bash
cd backend/SLBFE.HRM.API
dotnet publish -c Release -o ./publish
# Copy ./publish to IIS directory
```

**Option 3: Manual Frontend**
```bash
cd frontend
npm install
npm run build
# Copy ./dist to IIS directory
```

### Database Setup
```powershell
# Run as Administrator
.\setup-database.ps1 -ServerName "YOUR_SERVER" -AdminPassword "SA_PASSWORD" -AppPassword "APP_PASSWORD"
```

## 🔒 Security Considerations

### For Production Deployment:
1. **Update JWT Secret**: Change `JwtSettings:SecretKey` in `appsettings.Production.json`
2. **Update Connection Strings**: Use production database credentials
3. **Configure CORS**: Restrict to production domain only
4. **Enable HTTPS**: Install SSL certificate and enforce HTTPS
5. **Review Permissions**: Set appropriate IIS application pool identity
6. **Enable Logging**: Configure SQL Server logging for production
7. **Backup Strategy**: Set up automated backups (daily full, hourly differential)

## 📊 System Modules

### Core Modules
1. **Employee Management** - Complete lifecycle management
2. **Salary Management** - Records, adjustments, increments, notifications
3. **Staff Loan Management** - Applications, approvals, repayments, EMI calculations
4. **Retirement Management** - Records, benefits, pension calculations, notifications
5. **Medical Claims Management** - Request handling, document verification, approvals
6. **User & Role Management** - RBAC, role assignments, audit logs (Admin only)
7. **Backup & Restore** - Database backups, restore points, automation (Admin only)
8. **Applications Management** - Leave, transfers, general applications

### Role-Based Access
- **Admin**: Full system access, user management, backups
- **Senior HR Manager**: All HR operations + medical claims management
- **HR Manager**: Standard HR operations (employees, salary, loans, retirement, medical claims)
- **Employee**: Self-service portal (profile, applications, notifications)

## 🔧 Configuration

### Environment Variables (.env.production)
```env
VITE_API_BASE_URL=https://hrm-api.slbfe.lk/api
VITE_APP_NAME=SLBFE HRM System
```

### Backend Configuration (appsettings.Production.json)
- Database connection strings
- JWT settings (secret key, expiration)
- CORS allowed origins
- File storage paths
- Email SMTP settings
- Logging levels
- Backup schedules

## 🧪 Testing

```bash
# Backend tests (when implemented)
cd backend/SLBFE.HRM.API
dotnet test

# Frontend tests (when implemented)
cd frontend
npm test
```

## 📈 Performance Optimizations

- **Response Caching**: In-memory caching for frequently accessed data
- **Response Compression**: Brotli and Gzip compression enabled
- **Database Connection Pooling**: Min 5, Max 100 connections
- **Static Content Caching**: 7-day browser cache for static assets
- **Code Splitting**: Vendor chunks separated for better caching
- **Minification**: JavaScript and CSS minified in production
- **Image Optimization**: Lazy loading and optimized formats

## 🐛 Troubleshooting

### Common Issues

**Database Connection Fails**
```bash
# Check SQL Server service
Get-Service MSSQLSERVER

# Test connection
sqlcmd -S localhost -U sa -P YourPassword -Q "SELECT @@VERSION"
```

**CORS Errors**
- Update `CORS:AllowedOrigins` in `appsettings.json`
- Ensure frontend URL is included

**Build Errors**
```bash
# Clean and restore
dotnet clean
dotnet restore
npm install
```

For more troubleshooting, see [Quick Reference Guide](docs/QUICK_REFERENCE.md)

## 📞 Support

- **IT Department**: it@slbfe.lk
- **Development Team**: dev@slbfe.lk
- **SLBFE Hotline**: 1989
- **GitHub Issues**: [Report Issues](https://github.com/wmashan/SLBFE-HRM-System/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for Sri Lanka Bureau of Foreign Employment**  
**Optimized for Windows IIS Deployment**
