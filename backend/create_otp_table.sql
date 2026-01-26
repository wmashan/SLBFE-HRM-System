-- Create OtpRecords table for OTP verification
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'OtpRecords')
BEGIN
    CREATE TABLE [dbo].[OtpRecords] (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [Email] NVARCHAR(100) NOT NULL,
        [Otp] NVARCHAR(6) NOT NULL,
        [CreatedAt] DATETIME2 NOT NULL,
        [ExpiresAt] DATETIME2 NOT NULL,
        [IsUsed] BIT NOT NULL DEFAULT 0,
        [Purpose] NVARCHAR(50) NOT NULL,
        CONSTRAINT [PK_OtpRecords] PRIMARY KEY CLUSTERED ([Id] ASC)
    );
    
    -- Add index for faster lookups
    CREATE INDEX [IX_OtpRecords_Email_Otp] ON [dbo].[OtpRecords] ([Email], [Otp]);
    CREATE INDEX [IX_OtpRecords_ExpiresAt] ON [dbo].[OtpRecords] ([ExpiresAt]);
    
    PRINT 'OtpRecords table created successfully';
END
ELSE
BEGIN
    PRINT 'OtpRecords table already exists';
END
