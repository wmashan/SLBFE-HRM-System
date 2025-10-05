using Serilog;
using System.Diagnostics;

namespace SLBFE.HRM.API.Presentation.Middleware
{
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;

        public RequestLoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Skip logging for health checks and static files
            if (context.Request.Path.StartsWithSegments("/health") ||
                context.Request.Path.StartsWithSegments("/swagger"))
            {
                await _next(context);
                return;
            }

            var stopwatch = Stopwatch.StartNew();
            var requestId = Guid.NewGuid().ToString();
            
            // Add request ID to response headers
            context.Response.OnStarting(() =>
            {
                context.Response.Headers.Append("X-Request-ID", requestId);
                return Task.CompletedTask;
            });

            try
            {
                Log.Information(
                    "HTTP Request: {RequestId} {Method} {Path} {QueryString}",
                    requestId,
                    context.Request.Method,
                    context.Request.Path,
                    context.Request.QueryString);

                await _next(context);

                stopwatch.Stop();

                Log.Information(
                    "HTTP Response: {RequestId} {Method} {Path} {StatusCode} {ElapsedMs}ms",
                    requestId,
                    context.Request.Method,
                    context.Request.Path,
                    context.Response.StatusCode,
                    stopwatch.ElapsedMilliseconds);
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                
                Log.Error(ex,
                    "HTTP Error: {RequestId} {Method} {Path} {ElapsedMs}ms",
                    requestId,
                    context.Request.Method,
                    context.Request.Path,
                    stopwatch.ElapsedMilliseconds);
                
                throw;
            }
        }
    }
}
