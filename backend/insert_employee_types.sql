-- Insert sample employee types into EmployeeType table
-- Run this SQL script on your SLBFE HRM database

-- Check if table exists and is empty
IF NOT EXISTS (SELECT 1 FROM EmployeeType)
BEGIN
    -- Insert common employment types
    INSERT INTO EmployeeType (TypeName, Description) VALUES
    ('Permanent', 'Permanent full-time employee'),
    ('Contract', 'Contract-based employee'),
    ('Casual', 'Casual worker'),
    ('Probation', 'Employee on probation period'),
    ('Intern', 'Intern or trainee');
    
    PRINT 'Sample employee types inserted successfully.';
END
ELSE
BEGIN
    PRINT 'EmployeeType table already has data.';
    SELECT * FROM EmployeeType;
END

-- Display all employee types
SELECT * FROM EmployeeType;
