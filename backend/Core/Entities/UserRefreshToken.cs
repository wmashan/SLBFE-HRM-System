using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SLBFE.HRM.API.Core.Entities
{
    /// <summary>
    /// User refresh token entity for JWT token refresh functionality
    /// </summary>
    [Table("UserRefreshTokens")]
    public class UserRefreshToken
    {
        /// <summary>
        /// Refresh token ID - Primary Key
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// User ID - Foreign Key to Users table
        /// </summary>
        [Required]
        public int UserId { get; set; }

        /// <summary>
        /// Refresh token value (securely generated random string)
        /// </summary>
        [Required]
        public string Token { get; set; } = string.Empty;

        /// <summary>
        /// Token expiration timestamp
        /// </summary>
        [Required]
        public DateTime ExpiresAt { get; set; }

        /// <summary>
        /// Token creation timestamp
        /// </summary>
        [Required]
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Token revocation timestamp (null if not revoked)
        /// </summary>
        public DateTime? RevokedAt { get; set; }

        /// <summary>
        /// Navigation property to User
        /// </summary>
        [ForeignKey(nameof(UserId))]
        public virtual User? User { get; set; }

        /// <summary>
        /// Checks if the refresh token is active (not expired and not revoked)
        /// </summary>
        public bool IsActive => RevokedAt == null && ExpiresAt > DateTime.UtcNow;

        /// <summary>
        /// Checks if the refresh token has expired
        /// </summary>
        public bool IsExpired => DateTime.UtcNow >= ExpiresAt;

        /// <summary>
        /// Checks if the refresh token has been revoked
        /// </summary>
        public bool IsRevoked => RevokedAt != null;
    }
}
