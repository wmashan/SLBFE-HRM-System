#!/usr/bin/env pwsh
# ============================================
# JWT Secret Key Generator
# ============================================
# Generates a cryptographically secure random
# secret key for JWT token signing
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  JWT Secret Key Generator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Generate a 32-character random string
Write-Host "Generating 32-character secret key..." -ForegroundColor Yellow
$key32 = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Generate a 64-character random string
Write-Host "Generating 64-character secret key..." -ForegroundColor Yellow
$key64 = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})

# Generate a Base64 encoded 32-byte key
Write-Host "Generating Base64 encoded 32-byte key..." -ForegroundColor Yellow
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$keyBase64 = [System.Convert]::ToBase64String($bytes)

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Generated Keys" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Option 1: 32-Character Key (Minimum Recommended)" -ForegroundColor Cyan
Write-Host $key32 -ForegroundColor White
Write-Host ""

Write-Host "Option 2: 64-Character Key (Extra Secure)" -ForegroundColor Cyan
Write-Host $key64 -ForegroundColor White
Write-Host ""

Write-Host "Option 3: Base64 Encoded 32-Byte Key (Most Secure)" -ForegroundColor Cyan
Write-Host $keyBase64 -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "  SQL Update Commands" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Execute one of these SQL commands:" -ForegroundColor Yellow
Write-Host ""

Write-Host "-- Using 32-character key:" -ForegroundColor Gray
Write-Host "UPDATE [dbo].[SystemSettings]" -ForegroundColor White
Write-Host "SET [SettingValue] = '$key32'" -ForegroundColor White
Write-Host "WHERE [SettingKey] = 'JWT_Secret_Key';" -ForegroundColor White
Write-Host ""

Write-Host "-- Using 64-character key:" -ForegroundColor Gray
Write-Host "UPDATE [dbo].[SystemSettings]" -ForegroundColor White
Write-Host "SET [SettingValue] = '$key64'" -ForegroundColor White
Write-Host "WHERE [SettingKey] = 'JWT_Secret_Key';" -ForegroundColor White
Write-Host ""

Write-Host "-- Using Base64 encoded key (RECOMMENDED):" -ForegroundColor Gray
Write-Host "UPDATE [dbo].[SystemSettings]" -ForegroundColor White
Write-Host "SET [SettingValue] = '$keyBase64'" -ForegroundColor White
Write-Host "WHERE [SettingKey] = 'JWT_Secret_Key';" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "  Security Reminders" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Save this key in a secure location" -ForegroundColor Green
Write-Host "✅ Update your database immediately" -ForegroundColor Green
Write-Host "✅ Never commit this key to source control" -ForegroundColor Green
Write-Host "✅ Use Azure Key Vault for production" -ForegroundColor Green
Write-Host "✅ Change the key if compromised" -ForegroundColor Green
Write-Host "⚠️  Changing the key invalidates all existing tokens" -ForegroundColor Yellow
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Next Steps" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Copy one of the keys above" -ForegroundColor White
Write-Host "2. Run the corresponding SQL UPDATE command" -ForegroundColor White
Write-Host "3. Verify with: SELECT * FROM SystemSettings WHERE SettingKey = 'JWT_Secret_Key'" -ForegroundColor White
Write-Host "4. Test your login endpoint" -ForegroundColor White
Write-Host ""

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
