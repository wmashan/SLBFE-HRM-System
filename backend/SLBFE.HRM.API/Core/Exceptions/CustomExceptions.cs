namespace SLBFE.HRM.API.Core.Exceptions
{
    /// <summary>
    /// Exception thrown when a requested resource is not found
    /// </summary>
    public class NotFoundException : Exception
    {
        public NotFoundException(string message) : base(message)
        {
        }

        public NotFoundException(string name, object key)
            : base($"Entity \"{name}\" ({key}) was not found.")
        {
        }
    }

    /// <summary>
    /// Exception thrown when a business rule is violated
    /// </summary>
    public class BusinessRuleViolationException : Exception
    {
        public BusinessRuleViolationException(string message) : base(message)
        {
        }
    }

    /// <summary>
    /// Exception thrown when validation fails
    /// </summary>
    public class ValidationException : Exception
    {
        public IDictionary<string, string[]> Errors { get; }

        public ValidationException()
            : base("One or more validation failures have occurred.")
        {
            Errors = new Dictionary<string, string[]>();
        }

        public ValidationException(IDictionary<string, string[]> errors)
            : this()
        {
            Errors = errors;
        }
    }

    /// <summary>
    /// Exception thrown when an operation is forbidden
    /// </summary>
    public class ForbiddenAccessException : Exception
    {
        public ForbiddenAccessException(string message = "Access forbidden")
            : base(message)
        {
        }
    }
}
