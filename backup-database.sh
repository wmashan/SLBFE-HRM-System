#!/bin/bash

# SLBFE HRM Database Backup Script for Docker SQL Server on macOS
# This script creates a backup of the database and copies it to the host machine

set -e  # Exit on error

# Configuration
DB_NAME="SLBFE_HRM_DB"
CONTAINER_NAME="sql_server_container"  # Change this to your actual container name
SA_PASSWORD="SLBFE_HRM_2025!"
BACKUP_DIR="./database-backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${DB_NAME}_backup_${TIMESTAMP}.bak"
CONTAINER_BACKUP_PATH="/var/opt/mssql/data/${BACKUP_FILE}"

echo "======================================"
echo "SLBFE HRM Database Backup Script"
echo "======================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker Desktop."
    exit 1
fi

# Find SQL Server container
echo "🔍 Finding SQL Server container..."
CONTAINER_ID=$(docker ps --filter "ancestor=mcr.microsoft.com/mssql/server" --format "{{.ID}}" | head -1)

if [ -z "$CONTAINER_ID" ]; then
    # Try to find by name
    CONTAINER_ID=$(docker ps --filter "name=sql" --format "{{.ID}}" | head -1)
fi

if [ -z "$CONTAINER_ID" ]; then
    echo "❌ Error: No running SQL Server container found."
    echo "Please make sure your SQL Server Docker container is running."
    exit 1
fi

CONTAINER_NAME=$(docker ps --filter "id=${CONTAINER_ID}" --format "{{.Names}}")
echo "✅ Found container: ${CONTAINER_NAME} (${CONTAINER_ID})"
echo ""

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create database backup inside the container
echo "📦 Creating database backup..."
docker exec "$CONTAINER_ID" /opt/mssql-tools/bin/sqlcmd \
    -S localhost -U sa -P SLBFE_HRM_2025! \
    -Q "BACKUP DATABASE [${DB_NAME}] TO DISK = N'${CONTAINER_BACKUP_PATH}' WITH NOFORMAT, NOINIT, NAME = '${DB_NAME}-Full Database Backup', SKIP, NOREWIND, NOUNLOAD, STATS = 10"

if [ $? -eq 0 ]; then
    echo "✅ Database backup created successfully inside container"
else
    echo "❌ Error: Failed to create database backup"
    exit 1
fi

# Copy backup file from container to host
echo ""
echo "📥 Copying backup file to host machine..."
docker cp "${CONTAINER_ID}:${CONTAINER_BACKUP_PATH}" "${BACKUP_DIR}/${BACKUP_FILE}"

if [ $? -eq 0 ]; then
    echo "✅ Backup copied to: ${BACKUP_DIR}/${BACKUP_FILE}"
else
    echo "❌ Error: Failed to copy backup file from container"
    exit 1
fi

# Get backup file size
BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_FILE}" | cut -f1)
echo ""
echo "======================================"
echo "✅ Backup completed successfully!"
echo "======================================"
echo "📁 Backup location: ${BACKUP_DIR}/${BACKUP_FILE}"
echo "📊 Backup size: ${BACKUP_SIZE}"
echo "🕒 Timestamp: ${TIMESTAMP}"
echo ""

# Optional: Clean up old backups (keep last 5)
echo "🧹 Cleaning up old backups (keeping last 5)..."
cd "$BACKUP_DIR"
ls -t ${DB_NAME}_backup_*.bak | tail -n +6 | xargs -I {} rm -- {} 2>/dev/null || true
BACKUP_COUNT=$(ls -1 ${DB_NAME}_backup_*.bak 2>/dev/null | wc -l)
echo "📦 Total backups: ${BACKUP_COUNT}"
echo ""

# Optional: Remove backup file from container to save space
echo "🗑️  Removing backup file from container..."
docker exec "$CONTAINER_ID" rm "${CONTAINER_BACKUP_PATH}" 2>/dev/null || true

echo "✅ Done!"
