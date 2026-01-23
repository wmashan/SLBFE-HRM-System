using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace SLBFE.HRM.API.Presentation.Filters
{
    /// <summary>
    /// Validates model state and returns 400 Bad Request if invalid
    /// </summary>
    public class ValidateModelStateAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                var errors = context.ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage).ToArray() ?? Array.Empty<string>()
                    );

                var response = new
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors,
                    Timestamp = DateTime.UtcNow
                };

                context.Result = new BadRequestObjectResult(response);
            }

            base.OnActionExecuting(context);
        }
    }
}
