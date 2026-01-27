#!/bin/bash

# SLBFE HRM Database Restore Script for Docker SQL Server on macOS
# This script restores a database backup from the host machine to the Docker container

set -e  # Exit on error

# Configuration
DB_NAME="SLBFE_HRM_DB"
BACKUP_DIR="./database-backups"
SA_PASSWORD="SLBFE_HRM_2025!"

echo "======================================"
echo "SLBFE HRM Database Restore Script"
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

# List available backups
echo "📋 Available backups:"
echo ""
BACKUP_FILES=($(ls -t "$BACKUP_DIR"/${DB_NAME}_backup_*.bak 2>/dev/null))

if [ ${#BACKUP_FILES[@]} -eq 0 ]; then
    echo "❌ No backup files found in ${BACKUP_DIR}"
    echo "Please run ./backup-database.sh first to create a backup."
    exit 1
fi

# Display backups with numbers
for i in "${!BACKUP_FILES[@]}"; do
    BACKUP_SIZE=$(du -h "${BACKUP_FILES[$i]}" | cut -f1)
    BACKUP_DATE=$(basename "${BACKUP_FILES[$i]}" | sed 's/.*_\([0-9]\{8\}_[0-9]\{6\}\).bak/\1/' | sed 's/_/ /')
    echo "  [$((i+1))] ${BACKUP_FILES[$i]##*/} (${BACKUP_SIZE}) - ${BACKUP_DATE}"
done

echo ""
read -p "Select backup number to restore (or press Enter for most recent): " BACKUP_NUM

if [ -z "$BACKUP_NUM" ]; then
    BACKUP_NUM=1
fi

if [ "$BACKUP_NUM" -lt 1 ] || [ "$BACKUP_NUM" -gt ${#BACKUP_FILES[@]} ]; then
    echo "❌ Invalid selection"
    exit 1
fi

SELECTED_BACKUP="${BACKUP_FILES[$((BACKUP_NUM-1))]}"
BACKUP_FILENAME=$(basename "$SELECTED_BACKUP")
CONTAINER_BACKUP_PATH="/var/opt/mssql/data/${BACKUP_FILENAME}"

echo ""
echo "Selected backup: ${BACKUP_FILENAME}"
echo ""

# Warning
echo "⚠️  WARNING: This will restore the database and overwrite any existing data!"
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

echo ""
echo "📤 Copying backup file to container..."
docker cp "$SELECTED_BACKUP" "${CONTAINER_ID}:${CONTAINER_BACKUP_PATH}"

if [ $? -eq 0 ]; then
    echo "✅ Backup file copied to container"
else
    echo "❌ Error: Failed to copy backup file to container"
    exit 1
fi

# Find sqlcmd path
if docker exec "$CONTAINER_ID" test -f /opt/mssql-tools18/bin/sqlcmd; then
    SQLCMD_PATH="/opt/mssql-tools18/bin/sqlcmd"
elif docker exec "$CONTAINER_ID" test -f /opt/mssql-tools/bin/sqlcmd; then
    SQLCMD_PATH="/opt/mssql-tools/bin/sqlcmd"
else
    SQLCMD_PATH="sqlcmd"
fi

# Close existing connections
echo ""
echo "🔒 Closing existing database connections..."
docker exec "$CONTAINER_ID" $SQLCMD_PATH \
    -S localhost -U sa -P "${SA_PASSWORD}" -C \
    -Q "ALTER DATABASE [${DB_NAME}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;" 2>/dev/null || true

# Restore database
echo ""
echo "📥 Restoring database from backup..."
docker exec "$CONTAINER_ID" $SQLCMD_PATH \
    -S localhost -U sa -P "${SA_PASSWORD}" -C \
    -Q "RESTORE DATABASE [${DB_NAME}] FROM DISK = N'${CONTAINER_BACKUP_PATH}' WITH REPLACE, STATS = 10"

if [ $? -eq 0 ]; then
    echo "✅ Database restored successfully"
else
    echo "❌ Error: Failed to restore database"
    # Try to set database back to multi-user
    docker exec "$CONTAINER_ID" $SQLCMD_PATH \
        -S localhost -U sa -P "${SA_PASSWORD}" -C \
        -Q "ALTER DATABASE [${DB_NAME}] SET MULTI_USER;" 2>/dev/null || true
    exit 1
fi

# Set database back to multi-user mode
echo ""
echo "🔓 Setting database to multi-user mode..."
docker exec "$CONTAINER_ID" $SQLCMD_PATH \
    -S localhost -U sa -P "${SA_PASSWORD}" -C \
    -Q "ALTER DATABASE [${DB_NAME}] SET MULTI_USER;"

# Verify restore
echo ""
echo "✅ Verifying restore..."
docker exec "$CONTAINER_ID" $SQLCMD_PATH \
    -S localhost -U sa -P "${SA_PASSWORD}" -C \
    -Q "SELECT name, state_desc, recovery_model_desc FROM sys.databases WHERE name = '${DB_NAME}'"

# Clean up backup file from container
echo ""
echo "🗑️  Removing backup file from container..."
docker exec "$CONTAINER_ID" rm "${CONTAINER_BACKUP_PATH}" 2>/dev/null || true

echo ""
echo "======================================"
echo "✅ Database restore completed!"
echo "======================================"
echo "Database: ${DB_NAME}"
echo "From: ${BACKUP_FILENAME}"
echo ""
echo "⚠️  Please restart your backend application to ensure it reconnects properly."
echo ""
