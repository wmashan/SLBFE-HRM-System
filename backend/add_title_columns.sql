-- Add missing columns to Titles table
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Titles]') AND name = 'DisplayOrder')
BEGIN
    ALTER TABLE [Titles] ADD [DisplayOrder] int NOT NULL DEFAULT 0;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Titles]') AND name = 'IsActive')
BEGIN
    ALTER TABLE [Titles] ADD [IsActive] bit NOT NULL DEFAULT 1;
END

-- Insert seed data if table is empty
IF NOT EXISTS (SELECT 1 FROM [Titles])
BEGIN
    INSERT INTO [Titles] ([TitleId], [Description], [DisplayOrder], [IsActive]) VALUES
    ('MR', 'Mr.', 1, 1),
    ('MRS', 'Mrs.', 2, 1),
    ('MS', 'Ms.', 3, 1),
    ('MISS', 'Miss', 4, 1),
    ('DR', 'Dr.', 5, 1),
    ('PROF', 'Prof.', 6, 1),
    ('REV', 'Rev.', 7, 1);
END
