using System.Net;
using System.Text.Json;
using Serilog;

namespace SLBFE.HRM.API.Presentation.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IHostEnvironment _environment;

        public ExceptionHandlingMiddleware(RequestDelegate next, IHostEnvironment environment)
        {
            _next = next;
            _environment = environment;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "An unhandled exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            
            var response = new ErrorResponse
            {
                Success = false,
                Message = "An error occurred processing your request.",
                Timestamp = DateTime.UtcNow
            };

            // Set status code based on exception type
            context.Response.StatusCode = exception switch
            {
                UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
                ArgumentNullException => (int)HttpStatusCode.BadRequest,
                ArgumentException => (int)HttpStatusCode.BadRequest,
                KeyNotFoundException => (int)HttpStatusCode.NotFound,
                InvalidOperationException => (int)HttpStatusCode.BadRequest,
                _ => (int)HttpStatusCode.InternalServerError
            };

            // Include detailed error in development
            if (_environment.IsDevelopment())
            {
                response.Error = exception.Message;
                response.Details = exception.StackTrace;
            }
            else
            {
                response.Error = "An error occurred. Please contact support if the problem persists.";
            }

            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            return context.Response.WriteAsync(JsonSerializer.Serialize(response, jsonOptions));
        }

        private class ErrorResponse
        {
            public bool Success { get; set; }
            public string Message { get; set; } = string.Empty;
            public string? Error { get; set; }
            public string? Details { get; set; }
            public DateTime Timestamp { get; set; }
        }
    }
}
