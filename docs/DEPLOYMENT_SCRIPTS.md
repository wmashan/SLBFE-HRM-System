# SLBFE HRM System - Deployment Scripts

## PowerShell Deployment Scripts for Windows IIS

### 1. Backend API Deployment Script

**File: deploy-backend.ps1**

```powershell
# SLBFE HRM Backend API Deployment Script
# Run this script with Administrator privileges

param(
    [string]$Configuration = "Release",
    [string]$TargetPath = "C:\inetpub\wwwroot\SLBFE-HRM-API",
    [string]$AppPoolName = "SLBFE_HRM_Pool",
    [string]$SiteName = "SLBFE-HRM-API",
    [int]$Port = 5000,
    [int]$HttpsPort = 5001
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SLBFE HRM Backend API Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    exit 1
}

# Import IIS module
Import-Module WebAdministration -ErrorAction Stop

# Step 1: Build and Publish
Write-Host "Step 1: Building and publishing backend API..." -ForegroundColor Yellow
$ProjectPath = "$PSScriptRoot\backend\SLBFE.HRM.API"
$PublishPath = "$PSScriptRoot\backend\SLBFE.HRM.API\publish"

if (Test-Path $PublishPath) {
    Remove-Item $PublishPath -Recurse -Force
}

dotnet publish $ProjectPath -c $Configuration -o $PublishPath
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Build completed successfully" -ForegroundColor Green

# Step 2: Stop Application Pool if exists
Write-Host "`nStep 2: Stopping application pool..." -ForegroundColor Yellow
if (Test-Path "IIS:\AppPools\$AppPoolName") {
    Stop-WebAppPool -Name $AppPoolName
    Start-Sleep -Seconds 5
    Write-Host "✓ Application pool stopped" -ForegroundColor Green
} else {
    Write-Host "! Application pool does not exist, will create new one" -ForegroundColor Yellow
}

# Step 3: Backup existing deployment
Write-Host "`nStep 3: Backing up existing deployment..." -ForegroundColor Yellow
if (Test-Path $TargetPath) {
    $BackupPath = "$TargetPath.backup.$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    Copy-Item -Path $TargetPath -Destination $BackupPath -Recurse
    Write-Host "✓ Backup created at: $BackupPath" -ForegroundColor Green
}

# Step 4: Deploy files
Write-Host "`nStep 4: Deploying files..." -ForegroundColor Yellow
if (Test-Path $TargetPath) {
    Remove-Item $TargetPath -Recurse -Force
}
New-Item -ItemType Directory -Path $TargetPath -Force | Out-Null
Copy-Item -Path "$PublishPath\*" -Destination $TargetPath -Recurse -Force

# Create logs directory
$LogsPath = "$TargetPath\Logs"
if (-not (Test-Path $LogsPath)) {
    New-Item -ItemType Directory -Path $LogsPath -Force | Out-Null
}

# Create keys directory for data protection
$KeysPath = "$TargetPath\Keys"
if (-not (Test-Path $KeysPath)) {
    New-Item -ItemType Directory -Path $KeysPath -Force | Out-Null
}

Write-Host "✓ Files deployed successfully" -ForegroundColor Green

# Step 5: Set permissions
Write-Host "`nStep 5: Setting permissions..." -ForegroundColor Yellow
$acl = Get-Acl $TargetPath
$permission = "IIS_IUSRS", "Read,ExecuteFile", "ContainerInherit,ObjectInherit", "None", "Allow"
$accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule $permission
$acl.SetAccessRule($accessRule)

# Grant write permissions to logs folder
$logsAcl = Get-Acl $LogsPath
$logsPermission = "IIS_IUSRS", "Modify", "ContainerInherit,ObjectInherit", "None", "Allow"
$logsAccessRule = New-Object System.Security.AccessControl.FileSystemAccessRule $logsPermission
$logsAcl.SetAccessRule($logsAccessRule)
Set-Acl -Path $LogsPath -AclObject $logsAcl

# Grant write permissions to keys folder
$keysAcl = Get-Acl $KeysPath
Set-Acl -Path $KeysPath -AclObject $keysAcl

Set-Acl -Path $TargetPath -AclObject $acl
Write-Host "✓ Permissions set successfully" -ForegroundColor Green

# Step 6: Create/Update Application Pool
Write-Host "`nStep 6: Configuring application pool..." -ForegroundColor Yellow
if (-not (Test-Path "IIS:\AppPools\$AppPoolName")) {
    New-WebAppPool -Name $AppPoolName
}

Set-ItemProperty "IIS:\AppPools\$AppPoolName" -Name "managedRuntimeVersion" -Value ""
Set-ItemProperty "IIS:\AppPools\$AppPoolName" -Name "processModel.identityType" -Value "ApplicationPoolIdentity"
Set-ItemProperty "IIS:\AppPools\$AppPoolName" -Name "processModel.idleTimeout" -Value "00:20:00"
Set-ItemProperty "IIS:\AppPools\$AppPoolName" -Name "recycling.periodicRestart.time" -Value "00:00:00"

Write-Host "✓ Application pool configured" -ForegroundColor Green

# Step 7: Create/Update Website
Write-Host "`nStep 7: Configuring IIS website..." -ForegroundColor Yellow
if (Get-Website -Name $SiteName -ErrorAction SilentlyContinue) {
    Remove-Website -Name $SiteName
}

New-Website -Name $SiteName `
    -PhysicalPath $TargetPath `
    -ApplicationPool $AppPoolName `
    -Port $Port `
    -Force

# Add HTTPS binding if certificate exists
$cert = Get-ChildItem -Path Cert:\LocalMachine\My | Where-Object { $_.Subject -like "*slbfe.lk*" } | Select-Object -First 1
if ($cert) {
    New-WebBinding -Name $SiteName -Protocol https -Port $HttpsPort -SslFlags 0
    $binding = Get-WebBinding -Name $SiteName -Protocol https
    $binding.AddSslCertificate($cert.Thumbprint, "My")
    Write-Host "✓ HTTPS binding configured with certificate" -ForegroundColor Green
} else {
    Write-Host "! No SSL certificate found for slbfe.lk" -ForegroundColor Yellow
}

Write-Host "✓ IIS website configured" -ForegroundColor Green

# Step 8: Start Application Pool
Write-Host "`nStep 8: Starting application pool..." -ForegroundColor Yellow
Start-WebAppPool -Name $AppPoolName
Start-Sleep -Seconds 3
Write-Host "✓ Application pool started" -ForegroundColor Green

# Step 9: Verify deployment
Write-Host "`nStep 9: Verifying deployment..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

try {
    $response = Invoke-WebRequest -Uri "http://localhost:$Port/" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ API is responding successfully" -ForegroundColor Green
    }
} catch {
    Write-Host "! Warning: Could not verify API response. Please check manually." -ForegroundColor Yellow
    Write-Host "  URL: http://localhost:$Port/" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "API URLs:" -ForegroundColor Cyan
Write-Host "  HTTP:  http://localhost:$Port" -ForegroundColor White
Write-Host "  HTTPS: https://localhost:$HttpsPort" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Update appsettings.Production.json with production values" -ForegroundColor White
Write-Host "  2. Run database migrations" -ForegroundColor White
Write-Host "  3. Test API endpoints" -ForegroundColor White
Write-Host ""
```

### 2. Frontend Deployment Script

**File: deploy-frontend.ps1**

```powershell
# SLBFE HRM Frontend Deployment Script
# Run this script with Administrator privileges

param(
    [string]$TargetPath = "C:\inetpub\wwwroot\SLBFE-HRM-Frontend",
    [string]$AppPoolName = "SLBFE_HRM_Frontend_Pool",
    [string]$SiteName = "SLBFE-HRM-Frontend",
    [int]$Port = 80,
    [int]$HttpsPort = 443
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SLBFE HRM Frontend Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    exit 1
}

# Import IIS module
Import-Module WebAdministration -ErrorAction Stop

# Step 1: Build React App
Write-Host "Step 1: Building React application..." -ForegroundColor Yellow
$FrontendPath = "$PSScriptRoot\frontend"
$DistPath = "$FrontendPath\dist"

Set-Location $FrontendPath

# Check if node_modules exists
if (-not (Test-Path "$FrontendPath\node_modules")) {
    Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: npm install failed!" -ForegroundColor Red
        exit 1
    }
}

# Build for production
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Build completed successfully" -ForegroundColor Green

# Step 2: Backup existing deployment
Write-Host "`nStep 2: Backing up existing deployment..." -ForegroundColor Yellow
if (Test-Path $TargetPath) {
    $BackupPath = "$TargetPath.backup.$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    Copy-Item -Path $TargetPath -Destination $BackupPath -Recurse
    Write-Host "✓ Backup created at: $BackupPath" -ForegroundColor Green
}

# Step 3: Deploy files
Write-Host "`nStep 3: Deploying files..." -ForegroundColor Yellow
if (Test-Path $TargetPath) {
    Remove-Item $TargetPath -Recurse -Force
}
New-Item -ItemType Directory -Path $TargetPath -Force | Out-Null
Copy-Item -Path "$DistPath\*" -Destination $TargetPath -Recurse -Force

Write-Host "✓ Files deployed successfully" -ForegroundColor Green

# Step 4: Create/Update Application Pool
Write-Host "`nStep 4: Configuring application pool..." -ForegroundColor Yellow
if (-not (Test-Path "IIS:\AppPools\$AppPoolName")) {
    New-WebAppPool -Name $AppPoolName
}

Set-ItemProperty "IIS:\AppPools\$AppPoolName" -Name "managedRuntimeVersion" -Value ""
Write-Host "✓ Application pool configured" -ForegroundColor Green

# Step 5: Create/Update Website
Write-Host "`nStep 5: Configuring IIS website..." -ForegroundColor Yellow

# Remove default binding if using port 80
if ($Port -eq 80 -and (Get-Website -Name "Default Web Site" -ErrorAction SilentlyContinue)) {
    Stop-Website -Name "Default Web Site"
}

if (Get-Website -Name $SiteName -ErrorAction SilentlyContinue) {
    Remove-Website -Name $SiteName
}

New-Website -Name $SiteName `
    -PhysicalPath $TargetPath `
    -ApplicationPool $AppPoolName `
    -Port $Port `
    -Force

# Add HTTPS binding if certificate exists
$cert = Get-ChildItem -Path Cert:\LocalMachine\My | Where-Object { $_.Subject -like "*slbfe.lk*" } | Select-Object -First 1
if ($cert) {
    New-WebBinding -Name $SiteName -Protocol https -Port $HttpsPort -SslFlags 0
    $binding = Get-WebBinding -Name $SiteName -Protocol https
    $binding.AddSslCertificate($cert.Thumbprint, "My")
    Write-Host "✓ HTTPS binding configured with certificate" -ForegroundColor Green
} else {
    Write-Host "! No SSL certificate found for slbfe.lk" -ForegroundColor Yellow
}

Write-Host "✓ IIS website configured" -ForegroundColor Green

# Step 6: Set permissions
Write-Host "`nStep 6: Setting permissions..." -ForegroundColor Yellow
$acl = Get-Acl $TargetPath
$permission = "IIS_IUSRS", "Read,ExecuteFile", "ContainerInherit,ObjectInherit", "None", "Allow"
$accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule $permission
$acl.SetAccessRule($accessRule)
Set-Acl -Path $TargetPath -AclObject $acl
Write-Host "✓ Permissions set successfully" -ForegroundColor Green

# Step 7: Verify deployment
Write-Host "`nStep 7: Verifying deployment..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

try {
    $response = Invoke-WebRequest -Uri "http://localhost:$Port/" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Frontend is responding successfully" -ForegroundColor Green
    }
} catch {
    Write-Host "! Warning: Could not verify frontend response. Please check manually." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend URLs:" -ForegroundColor Cyan
Write-Host "  HTTP:  http://localhost:$Port" -ForegroundColor White
Write-Host "  HTTPS: https://localhost:$HttpsPort" -ForegroundColor White
Write-Host ""
```

### 3. Database Setup Script

**File: setup-database.ps1**

```powershell
# SLBFE HRM Database Setup Script

param(
    [string]$ServerName = "localhost",
    [string]$DatabaseName = "SLBFE_HRM_DB",
    [string]$AdminUsername = "sa",
    [string]$AdminPassword,
    [string]$AppUsername = "hrm_user",
    [string]$AppPassword
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SLBFE HRM Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not $AdminPassword) {
    $SecureAdminPassword = Read-Host "Enter SQL Server admin password" -AsSecureString
    $AdminPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureAdminPassword))
}

if (-not $AppPassword) {
    $SecureAppPassword = Read-Host "Enter application user password" -AsSecureString
    $AppPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureAppPassword))
}

# SQL Commands
$CreateDatabaseSQL = @"
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'$DatabaseName')
BEGIN
    CREATE DATABASE [$DatabaseName];
    PRINT 'Database created successfully';
END
ELSE
BEGIN
    PRINT 'Database already exists';
END
"@

$CreateLoginSQL = @"
IF NOT EXISTS (SELECT name FROM sys.server_principals WHERE name = N'$AppUsername')
BEGIN
    CREATE LOGIN [$AppUsername] WITH PASSWORD = N'$AppPassword';
    PRINT 'Login created successfully';
END
ELSE
BEGIN
    PRINT 'Login already exists';
END
"@

$CreateUserSQL = @"
USE [$DatabaseName];
IF NOT EXISTS (SELECT name FROM sys.database_principals WHERE name = N'$AppUsername')
BEGIN
    CREATE USER [$AppUsername] FOR LOGIN [$AppUsername];
    ALTER ROLE db_owner ADD MEMBER [$AppUsername];
    PRINT 'User created and added to db_owner role';
END
ELSE
BEGIN
    PRINT 'User already exists';
END
"@

Write-Host "Creating database..." -ForegroundColor Yellow
sqlcmd -S $ServerName -U $AdminUsername -P $AdminPassword -Q $CreateDatabaseSQL

Write-Host "Creating login..." -ForegroundColor Yellow
sqlcmd -S $ServerName -U $AdminUsername -P $AdminPassword -Q $CreateLoginSQL

Write-Host "Creating user and assigning permissions..." -ForegroundColor Yellow
sqlcmd -S $ServerName -U $AdminUsername -P $AdminPassword -Q $CreateUserSQL

Write-Host ""
Write-Host "Database setup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Connection String:" -ForegroundColor Cyan
Write-Host "Server=$ServerName;Database=$DatabaseName;User Id=$AppUsername;Password=****;TrustServerCertificate=True;" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Update appsettings.Production.json with the connection string" -ForegroundColor White
Write-Host "  2. Run: dotnet ef database update" -ForegroundColor White
Write-Host ""
```

### 4. Complete Deployment Script

**File: deploy-all.ps1**

```powershell
# Complete SLBFE HRM System Deployment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SLBFE HRM Complete System Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    exit 1
}

# Deploy Backend API
Write-Host "Deploying Backend API..." -ForegroundColor Yellow
& "$PSScriptRoot\deploy-backend.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Backend deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Waiting 10 seconds before frontend deployment..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Deploy Frontend
Write-Host "Deploying Frontend..." -ForegroundColor Yellow
& "$PSScriptRoot\deploy-frontend.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Complete deployment finished!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "System URLs:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost" -ForegroundColor White
Write-Host "  API:      http://localhost:5000" -ForegroundColor White
Write-Host "  Swagger:  http://localhost:5000/swagger" -ForegroundColor White
Write-Host ""
```

## Usage Instructions

### First-Time Deployment:

1. **Setup Database:**
   ```powershell
   .\setup-database.ps1 -ServerName "YOUR_SERVER" -AdminPassword "YOUR_PASSWORD" -AppPassword "SECURE_PASSWORD"
   ```

2. **Deploy Complete System:**
   ```powershell
   .\deploy-all.ps1
   ```

### Subsequent Deployments:

**Backend only:**
```powershell
.\deploy-backend.ps1
```

**Frontend only:**
```powershell
.\deploy-frontend.ps1
```

## Important Notes:

1. All scripts must be run with Administrator privileges
2. Ensure .NET 8.0 SDK and Node.js are installed
3. Update appsettings.Production.json before production deployment
4. SSL certificates should be installed for HTTPS bindings
5. Backup scripts create timestamped backups automatically
