using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Text;
using SLBFE.HRM.API.Infrastructure.Data.Context;
using SLBFE.HRM.API.Infrastructure.Configuration;
using SLBFE.HRM.API.Presentation.Extensions;
using SLBFE.HRM.API.Presentation.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File(
        path: "Logs/log-.txt",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,
        fileSizeLimitBytes: 10485760, // 10MB
        rollOnFileSizeLimit: true)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// Database Configuration
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    // Use SQL Server (configured for Docker on macOS)
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null);
            sqlOptions.CommandTimeout(60);
        });
});

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey is not configured"));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(secretKey),
        ClockSkew = TimeSpan.FromMinutes(5)
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Log.Error("Authentication failed: {Error}", context.Exception.Message);
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Log.Information("Token validated for user: {User}", context.Principal?.Identity?.Name);
            return Task.CompletedTask;
        }
    };
});

// Authorization Policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("admin"));
    options.AddPolicy("HRManagerOnly", policy => policy.RequireRole("hr", "senior_hr_manager", "admin"));
    options.AddPolicy("SeniorHROnly", policy => policy.RequireRole("senior_hr_manager", "admin"));
    options.AddPolicy("EmployeeOnly", policy => policy.RequireRole("employee", "hr", "senior_hr_manager", "admin"));
});

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("ProductionCORS", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Response Caching
builder.Services.AddResponseCaching();
builder.Services.AddMemoryCache();

// Response Compression
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<Microsoft.AspNetCore.ResponseCompression.BrotliCompressionProvider>();
    options.Providers.Add<Microsoft.AspNetCore.ResponseCompression.GzipCompressionProvider>();
});

builder.Services.Configure<Microsoft.AspNetCore.ResponseCompression.BrotliCompressionProviderOptions>(options =>
{
    options.Level = System.IO.Compression.CompressionLevel.Fastest;
});

// Health Checks
builder.Services.AddHealthChecks();

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SLBFE HRM API",
        Version = "v1",
        Description = "Sri Lanka Bureau of Foreign Employment - HR Management System API",
        Contact = new OpenApiContact
        {
            Name = "SLBFE IT Department",
            Email = "it@slbfe.lk"
        }
    });

    // JWT Authentication in Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Register Application Services
// TODO: Add service registrations here
builder.Services.AddScoped<SLBFE.HRM.API.Application.Services.Interfaces.IAuthService, SLBFE.HRM.API.Application.Services.Implementations.AuthService>();
builder.Services.AddScoped<SLBFE.HRM.API.Application.Services.Interfaces.IEmployeeService, SLBFE.HRM.API.Application.Services.Implementations.EmployeeService>();
builder.Services.AddScoped<SLBFE.HRM.API.Application.Services.Interfaces.IUserService, SLBFE.HRM.API.Application.Services.Implementations.UserService>();
builder.Services.AddScoped<SLBFE.HRM.API.Application.Services.Interfaces.ITitleService, SLBFE.HRM.API.Application.Services.Implementations.TitleService>();
builder.Services.AddScoped<SLBFE.HRM.API.Application.Services.Interfaces.IDivisionService, SLBFE.HRM.API.Application.Services.Implementations.DivisionService>();
builder.Services.AddScoped<SLBFE.HRM.API.Application.Services.Interfaces.IGradeService, SLBFE.HRM.API.Application.Services.Implementations.GradeService>();
// etc.

// Register Infrastructure Services
builder.Services.AddInfrastructure();

// Data Protection
builder.Services.AddDataProtection();

// HTTP Client
builder.Services.AddHttpClient();

// AutoMapper (if using)
builder.Services.AddAutoMapper(typeof(Program));

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SLBFE HRM API v1");
    c.RoutePrefix = "swagger";
});

if (!app.Environment.IsDevelopment())
{
    // Production error handling
    app.UseExceptionHandler("/error");
    app.UseHsts();
}

// Custom Middleware
app.UseCustomMiddleware();

// Security Headers
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "SAMEORIGIN");
    context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    await next();
});

app.UseHttpsRedirection();
app.UseResponseCompression();
app.UseResponseCaching();
app.UseStaticFiles();

app.UseRouting();

app.UseCors("ProductionCORS");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Health Check Endpoint
app.MapHealthChecks("/health");

// Root endpoint
app.MapGet("/", () => new
{
    Application = "SLBFE HRM System API",
    Version = "1.0.0",
    Status = "Running",
    Timestamp = DateTime.UtcNow
});

// Error handling endpoint
app.MapGet("/error", () => Results.Problem("An error occurred processing your request."))
    .ExcludeFromDescription();

try
{
    Log.Information("Starting SLBFE HRM API");
    
    // Database migrations are handled separately via dotnet ef migrations
    // No need to ensure database creation here since we use migrations
    
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
