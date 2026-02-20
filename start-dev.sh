#!/bin/bash

# SLBFE HRM Development Server Startup Script
echo "🚀 Starting SLBFE HRM System Development Servers..."
echo "=================================================="

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Function to kill processes on script exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit 0
}

# Set up cleanup trap
trap cleanup SIGINT SIGTERM

# Check if node_modules exists in frontend
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo "🔧 Starting Backend API Server..."
cd backend
dotnet run > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

echo "⚡ Starting Frontend Development Server..."
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Both servers are running!"
echo "📡 Backend API: http://localhost:5001"
echo "🌐 Frontend: http://localhost:3000 (or next available port)"
echo "📋 Swagger UI: http://localhost:5001/swagger"
echo ""
echo "📝 Logs are being written to:"
echo "   - Backend: logs/backend.log"
echo "   - Frontend: logs/frontend.log"
echo ""
echo "Press Ctrl+C to stop both servers..."

# Create logs directory if it doesn't exist
mkdir -p logs

# Keep script running and show live logs
tail -f logs/backend.log logs/frontend.log &
TAIL_PID=$!

# Wait for user to interrupt
wait

# Cleanup
cleanup