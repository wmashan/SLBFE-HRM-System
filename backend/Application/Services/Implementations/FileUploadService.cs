using Microsoft.AspNetCore.Http;
using SLBFE.HRM.API.Application.Services.Interfaces;

namespace SLBFE.HRM.API.Application.Services.Implementations
{
    /// <summary>
    /// File upload service implementation for handling file uploads
    /// </summary>
    public class FileUploadService : IFileUploadService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogger<FileUploadService> _logger;
        private const long MaxFileSize = 5 * 1024 * 1024; // 5MB
        private static readonly string[] AllowedImageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

        public FileUploadService(IWebHostEnvironment webHostEnvironment, ILogger<FileUploadService> logger)
        {
            _webHostEnvironment = webHostEnvironment;
            _logger = logger;
        }

        /// <summary>
        /// Upload a profile picture for an employee
        /// </summary>
        public async Task<string> UploadProfilePictureAsync(IFormFile file, string? employeeId = null)
        {
            try
            {
                // Validate the file
                if (!ValidateImageFile(file, out string errorMessage))
                {
                    throw new InvalidOperationException(errorMessage);
                }

                // Generate unique filename
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                var fileName = employeeId != null 
                    ? $"{employeeId}_{Guid.NewGuid()}{extension}"
                    : $"profile_{Guid.NewGuid()}{extension}";

                // Create directory if it doesn't exist
                var uploadPath = Path.Combine(_webHostEnvironment.WebRootPath ?? "wwwroot", "uploads", "profiles");
                Directory.CreateDirectory(uploadPath);

                // Full file path
                var filePath = Path.Combine(uploadPath, fileName);

                // Save the file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Return relative URL path
                var relativeUrl = $"/uploads/profiles/{fileName}";
                _logger.LogInformation("Profile picture uploaded successfully: {FileName}", fileName);
                
                return relativeUrl;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading profile picture");
                throw;
            }
        }

        /// <summary>
        /// Delete a file from the server
        /// </summary>
        public async Task<bool> DeleteFileAsync(string fileUrl)
        {
            try
            {
                if (string.IsNullOrEmpty(fileUrl))
                {
                    return false;
                }

                // Remove leading slash and convert URL to file path
                var relativePath = fileUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
                var filePath = Path.Combine(_webHostEnvironment.WebRootPath ?? "wwwroot", relativePath);

                // Check if file exists and delete
                if (File.Exists(filePath))
                {
                    await Task.Run(() => File.Delete(filePath));
                    _logger.LogInformation("File deleted successfully: {FilePath}", filePath);
                    return true;
                }

                _logger.LogWarning("File not found for deletion: {FilePath}", filePath);
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file: {FileUrl}", fileUrl);
                return false;
            }
        }

        /// <summary>
        /// Validate if the uploaded file is a valid image
        /// </summary>
        public bool ValidateImageFile(IFormFile file, out string errorMessage)
        {
            errorMessage = string.Empty;

            // Check if file is null or empty
            if (file == null || file.Length == 0)
            {
                errorMessage = "No file was uploaded.";
                return false;
            }

            // Check file size
            if (file.Length > MaxFileSize)
            {
                errorMessage = $"File size exceeds the maximum allowed size of {MaxFileSize / (1024 * 1024)}MB.";
                return false;
            }

            // Check file extension
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || !AllowedImageExtensions.Contains(extension))
            {
                errorMessage = $"Invalid file type. Allowed types are: {string.Join(", ", AllowedImageExtensions)}";
                return false;
            }

            // Validate content type
            var allowedContentTypes = new[] 
            { 
                "image/jpeg", 
                "image/jpg", 
                "image/png", 
                "image/gif", 
                "image/webp" 
            };

            if (!allowedContentTypes.Contains(file.ContentType.ToLowerInvariant()))
            {
                errorMessage = "Invalid file content type.";
                return false;
            }

            return true;
        }
    }
}
