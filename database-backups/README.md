# Database Backups

This directory contains backup files for the SLBFE HRM SQL Server database.

## Backup Files

Backup files are named with the following pattern:
```
SLBFE_HRM_backup_YYYYMMDD_HHMMSS.bak
```

Example: `SLBFE_HRM_backup_20260127_143022.bak`

## Important Notes

- Backup files are automatically created when you run `./backup-database.sh`
- Old backups are automatically cleaned up (keeping the last 5 backups)
- Each backup is a full database backup including all tables, data, and schema
- Backup files can be large depending on your database size

## Security

⚠️ **IMPORTANT**: These backup files contain sensitive data including:
- Employee personal information
- User credentials (passwords are hashed)
- Medical records
- Financial information

**Best Practices:**
1. Do NOT commit backup files to Git (already in .gitignore)
2. Store backups in a secure location
3. Consider encrypting backup files if storing on cloud storage
4. Regularly test your backups by restoring them

## Backup Schedule Recommendations

For production systems, consider setting up automated backups:
- **Daily**: Full backup at night
- **Weekly**: Keep weekly backups for 1 month
- **Monthly**: Keep monthly backups for 1 year

## Storage Locations

Consider backing up to multiple locations:
1. Local machine (this directory)
2. External hard drive
3. Cloud storage (encrypted)
4. Network attached storage (NAS)

## Restore Process

To restore a backup:
```bash
./restore-database.sh
```

The script will show you available backups and guide you through the restore process.
