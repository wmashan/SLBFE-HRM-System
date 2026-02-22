namespace SLBFE.HRM.API.Core.Constants
{
    /// <summary>
    /// Application-wide constants
    /// </summary>
    public static class AppConstants
    {
        public const string SystemName = "SLBFE HRM System";
        public const string ApiVersion = "v1";
        
        public static class Roles
        {
            public const string Admin = "admin";
            public const string SeniorHRManager = "senior_hr_manager";
            public const string HRManager = "hr";
            public const string Employee = "employee";
        }

        public static class Policies
        {
            public const string AdminOnly = "AdminOnly";
            public const string HRManagerOnly = "HRManagerOnly";
            public const string SeniorHROnly = "SeniorHROnly";
            public const string EmployeeOnly = "EmployeeOnly";
        }

        public static class DefaultValues
        {
            public const int PageSize = 10;
            public const int MaxPageSize = 100;
            public const int PasswordMinLength = 8;
            public const int TokenExpiryMinutes = 60;
        }

        public static class ErrorMessages
        {
            public const string NotFound = "The requested resource was not found.";
            public const string Unauthorized = "You are not authorized to perform this action.";
            public const string ValidationFailed = "Validation failed. Please check your input.";
            public const string InternalServerError = "An internal server error occurred.";
        }

        public static class CacheKeys
        {
            public const string AllEmployees = "all_employees";
            public const string EmployeeById = "employee_{0}";
            public const string UserByEmail = "user_email_{0}";
        }
    }
}
