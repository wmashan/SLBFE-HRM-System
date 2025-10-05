namespace SLBFE.HRM.API.Core.Enums
{
    /// <summary>
    /// User roles in the system
    /// </summary>
    public enum UserRole
    {
        Admin = 1,
        SeniorHRManager = 2,
        HRManager = 3,
        Employee = 4
    }

    /// <summary>
    /// Application status types
    /// </summary>
    public enum ApplicationStatus
    {
        Pending = 1,
        UnderReview = 2,
        Approved = 3,
        Rejected = 4,
        Completed = 5
    }

    /// <summary>
    /// Leave types
    /// </summary>
    public enum LeaveType
    {
        Annual = 1,
        Sick = 2,
        Casual = 3,
        Maternity = 4,
        Paternity = 5,
        NoPayLeave = 6
    }

    /// <summary>
    /// Loan status
    /// </summary>
    public enum LoanStatus
    {
        Pending = 1,
        Approved = 2,
        Rejected = 3,
        Active = 4,
        Completed = 5,
        Defaulted = 6
    }

    /// <summary>
    /// Employment status
    /// </summary>
    public enum EmploymentStatus
    {
        Active = 1,
        OnLeave = 2,
        Suspended = 3,
        Retired = 4,
        Terminated = 5
    }
}
