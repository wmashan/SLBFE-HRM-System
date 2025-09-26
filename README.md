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

### Backend (Planned)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB/PostgreSQL** - Database
- **JWT** - Authentication
- **Multer** - File uploads

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

- ✅ **Frontend Foundation** - React setup, routing, authentication
- ✅ **UI Components** - Reusable component library
- ✅ **User Management** - Registration and login flows
- 🚧 **Backend Development** - In planning phase
- 🚧 **Database Design** - Schema planning
- ⏳ **Testing Suite** - To be implemented
- ⏳ **Deployment** - Production setup pending

---

**Built with ❤️ for Sri Lanka Bureau of Foreign Employment**
