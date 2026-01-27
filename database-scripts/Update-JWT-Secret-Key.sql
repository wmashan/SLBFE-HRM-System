-- =====================================================================
-- Script: Update JWT Secret Key
-- Purpose: Update the JWT_Secret_Key in SystemSettings table
-- Date: 2026-01-27
-- =====================================================================

USE [SLBFE_HRM_DB];
GO

-- Update JWT Secret Key with proper 64-character key
UPDATE [dbo].[SystemSettings]
SET [SettingValue] = 'bwiFn6P64anYwYxFszrSaflbpBo4Pp3T12iqKC3jxQpr6EoVMEbNPsAj447rGs2N',
    [UpdatedAt] = GETUTCDATE()
WHERE [SettingKey] = 'JWT_Secret_Key';

-- Verify the update
SELECT 
    [SettingKey],
    [SettingValue],
    [Description],
    [CreatedAt],
    [UpdatedAt],
    LEN([SettingValue]) AS [KeyLength]
FROM [dbo].[SystemSettings]
WHERE [SettingKey] = 'JWT_Secret_Key';

PRINT '✅ JWT Secret Key updated successfully!';
PRINT 'Key Length: 64 characters (512 bits)';
GO
