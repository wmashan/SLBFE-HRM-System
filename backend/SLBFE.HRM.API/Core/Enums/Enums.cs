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

    /// <summary>
    /// Medical request status
    /// </summary>
    public enum MedicalRequestStatus
    {
        Pending = 1,
        UnderReview = 2,
        Approved = 3,
        Rejected = 4,
        Paid = 5
    }

    /// <summary>
    /// Medical request types
    /// </summary>
    public enum MedicalRequestType
    {
        Hospitalization = 1,
        OutpatientTreatment = 2,
        Prescription = 3,
        Surgery = 4,
        DentalTreatment = 5,
        OpticalTreatment = 6,
        Laboratory = 7,
        Imaging = 8,
        Other = 9
    }
}
