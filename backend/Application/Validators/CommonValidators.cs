using FluentValidation;
using SLBFE.HRM.API.Application.DTOs.Request;

namespace SLBFE.HRM.API.Application.Validators
{
    /// <summary>
    /// Validator for login requests
    /// </summary>
    public class LoginRequestValidator : AbstractValidator<LoginRequestDto>
    {
        public LoginRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format")
                .MaximumLength(100).WithMessage("Email must not exceed 100 characters");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters");
        }
    }

    /// <summary>
    /// Validator for pagination requests
    /// </summary>
    public class PaginationRequestValidator : AbstractValidator<PaginationRequestDto>
    {
        public PaginationRequestValidator()
        {
            RuleFor(x => x.PageNumber)
                .GreaterThan(0).WithMessage("Page number must be greater than 0");

            RuleFor(x => x.PageSize)
                .GreaterThan(0).WithMessage("Page size must be greater than 0")
                .LessThanOrEqualTo(100).WithMessage("Page size must not exceed 100");
        }
    }
}
