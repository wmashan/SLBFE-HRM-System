@echo off
title SLBFE HRM Development Server
echo Starting SLBFE HRM System Development Servers...
echo.

:: Change to the project root directory
cd /d "%~dp0"

:: Start backend in a new window
echo Starting Backend API Server...
start "Backend API" cmd /k "cd backend && dotnet run --project SLBFE.HRM.API.csproj"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Start frontend in a new window
echo Starting Frontend Development Server...
start "Frontend Dev" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting up...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul