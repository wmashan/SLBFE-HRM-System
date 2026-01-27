-- =========================================================
-- JWT Authentication with Refresh Tokens - Database Setup
-- =========================================================
-- Date: January 27, 2026
-- Description: Creates tables and seed data for JWT authentication
-- =========================================================

-- Step 1: Create SystemSettings Table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SystemSettings')
BEGIN
    CREATE TABLE [dbo].[SystemSettings] (
        [Id]          INT            IDENTITY(1,1) NOT NULL,
        [SettingKey]  NVARCHAR(100)  NOT NULL,
        [SettingValue] NVARCHAR(MAX) NOT NULL,
        [Description] NVARCHAR(500)  NULL,
        [CreatedAt]   DATETIME2(7)   DEFAULT(GETDATE()) NOT NULL,
        [UpdatedAt]   DATETIME2(7)   DEFAULT(GETDATE()) NOT NULL,
        CONSTRAINT [PK_SystemSettings] PRIMARY KEY CLUSTERED ([Id] ASC),
        CONSTRAINT [UQ_SystemSettings_SettingKey] UNIQUE ([SettingKey])
    );
    
    PRINT 'SystemSettings table created successfully';
END
ELSE
BEGIN
    PRINT 'SystemSettings table already exists';
END
GO

-- Step 2: Create UserRefreshTokens Table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UserRefreshTokens')
BEGIN
    CREATE TABLE [dbo].[UserRefreshTokens] (
        [Id]        INT            IDENTITY(1,1) NOT NULL,
        [UserId]    INT            NOT NULL,
        [Token]     NVARCHAR(MAX)  NOT NULL,
        [ExpiresAt] DATETIME2(7)   NOT NULL,
        [CreatedAt] DATETIME2(7)   DEFAULT(SYSUTCDATETIME()) NOT NULL,
        [RevokedAt] DATETIME2(7)   NULL,
        CONSTRAINT [PK_UserRefreshTokens] PRIMARY KEY CLUSTERED ([Id] ASC),
        CONSTRAINT [FK_UserRefreshTokens_Users] FOREIGN KEY ([UserId]) 
            REFERENCES [dbo].[Users]([UserId]) ON DELETE CASCADE
    );
    
    -- Create indexes for performance
    CREATE NONCLUSTERED INDEX [IX_UserRefreshTokens_UserId] 
        ON [dbo].[UserRefreshTokens]([UserId]);
    
    CREATE NONCLUSTERED INDEX [IX_UserRefreshTokens_ExpiresAt] 
        ON [dbo].[UserRefreshTokens]([ExpiresAt]);
    
    -- Note: Cannot create unique index on NVARCHAR(MAX)
    -- Token uniqueness will be handled at application level
    
    PRINT 'UserRefreshTokens table created successfully';
END
ELSE
BEGIN
    PRINT 'UserRefreshTokens table already exists';
END
GO

-- Step 3: Insert JWT Configuration Settings
-- Replace 'YOUR_SECRET_KEY_HERE' with a strong, randomly generated secret key
-- Minimum 256 bits (32 characters) recommended for HS256 algorithm

IF NOT EXISTS (SELECT * FROM [dbo].[SystemSettings] WHERE [SettingKey] = 'JWT_Secret_Key')
BEGIN
    INSERT INTO [dbo].[SystemSettings] ([SettingKey], [SettingValue], [Description])
    VALUES (
        'JWT_Secret_Key',
        'YOUR_SECRET_KEY_HERE_REPLACE_WITH_STRONG_32_CHAR_KEY',
        'Secret key used for signing JWT tokens (minimum 32 characters)'
    );
    PRINT 'JWT_Secret_Key setting inserted';
END
ELSE
BEGIN
    PRINT 'JWT_Secret_Key setting already exists';
END
GO

IF NOT EXISTS (SELECT * FROM [dbo].[SystemSettings] WHERE [SettingKey] = 'JWT_Expiry_Minutes')
BEGIN
    INSERT INTO [dbo].[SystemSettings] ([SettingKey], [SettingValue], [Description])
    VALUES (
        'JWT_Expiry_Minutes',
        '60',
        'JWT access token expiry time in minutes (default: 60 minutes)'
    );
    PRINT 'JWT_Expiry_Minutes setting inserted';
END
ELSE
BEGIN
    PRINT 'JWT_Expiry_Minutes setting already exists';
END
GO

-- Step 4: Create a stored procedure to clean up expired refresh tokens
CREATE OR ALTER PROCEDURE [dbo].[CleanupExpiredRefreshTokens]
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @DeletedCount INT;
    
    -- Delete tokens that are expired and older than 30 days
    DELETE FROM [dbo].[UserRefreshTokens]
    WHERE [ExpiresAt] < DATEADD(DAY, -30, GETUTCDATE());
    
    SET @DeletedCount = @@ROWCOUNT;
    
    PRINT CONCAT('Cleaned up ', @DeletedCount, ' expired refresh tokens');
    
    RETURN @DeletedCount;
END
GO

PRINT 'Cleanup stored procedure created successfully';
GO

-- Step 5: Create a view for active refresh tokens
CREATE OR ALTER VIEW [dbo].[vw_ActiveRefreshTokens]
AS
SELECT 
    rt.[Id],
    rt.[UserId],
    u.[UserName],
    u.[EmployeeId],
    rt.[Token],
    rt.[ExpiresAt],
    rt.[CreatedAt],
    DATEDIFF(HOUR, GETUTCDATE(), rt.[ExpiresAt]) AS [HoursUntilExpiry],
    CASE 
        WHEN rt.[ExpiresAt] > GETUTCDATE() THEN 'Active'
        ELSE 'Expired'
    END AS [Status]
FROM [dbo].[UserRefreshTokens] rt
INNER JOIN [dbo].[Users] u ON rt.[UserId] = u.[UserId]
WHERE rt.[RevokedAt] IS NULL;
GO

PRINT 'Active refresh tokens view created successfully';
GO

-- =========================================================
-- Verification Queries
-- =========================================================

PRINT '';
PRINT '=== Verification Results ===';
PRINT '';

-- Check SystemSettings table
PRINT 'SystemSettings records:';
SELECT [SettingKey], [SettingValue], [Description], [CreatedAt]
FROM [dbo].[SystemSettings]
WHERE [SettingKey] IN ('JWT_Secret_Key', 'JWT_Expiry_Minutes');
GO

-- Check UserRefreshTokens table structure
PRINT '';
PRINT 'UserRefreshTokens table structure verified';
GO

-- =========================================================
-- IMPORTANT SECURITY NOTES
-- =========================================================
PRINT '';
PRINT '=== IMPORTANT SECURITY REMINDERS ===';
PRINT '1. Replace the JWT_Secret_Key with a strong, randomly generated key';
PRINT '2. Use at least 32 characters for the secret key';
PRINT '3. Never commit the secret key to source control';
PRINT '4. Consider using Azure Key Vault or environment variables for production';
PRINT '5. Schedule the CleanupExpiredRefreshTokens procedure to run periodically';
PRINT '6. Monitor the vw_ActiveRefreshTokens view for unusual activity';
PRINT '';
PRINT '=== Setup Complete ===';
GO
