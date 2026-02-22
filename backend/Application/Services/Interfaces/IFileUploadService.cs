using Microsoft.AspNetCore.Http;

namespace SLBFE.HRM.API.Application.Services.Interfaces
{
    /// <summary>
    /// File upload service interface for handling file uploads
    /// </summary>
    public interface IFileUploadService
    {
        /// <summary>
        /// Upload a profile picture for an employee
        /// </summary>
        /// <param name="file">The image file to upload</param>
        /// <param name="employeeId">Optional employee ID for naming</param>
        /// <returns>The relative URL path to the uploaded file</returns>
        Task<string> UploadProfilePictureAsync(IFormFile file, string? employeeId = null);

        /// <summary>
        /// Delete a file from the server
        /// </summary>
        /// <param name="fileUrl">The relative URL or file path to delete</param>
        /// <returns>True if file was deleted successfully</returns>
        Task<bool> DeleteFileAsync(string fileUrl);

        /// <summary>
        /// Validate if the uploaded file is a valid image
        /// </summary>
        /// <param name="file">The file to validate</param>
        /// <param name="errorMessage">Error message if validation fails</param>
        /// <returns>True if file is valid</returns>
        bool ValidateImageFile(IFormFile file, out string errorMessage);
    }
}
