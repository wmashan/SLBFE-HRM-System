using System.ComponentModel.DataAnnotations;

namespace SLBFE.HRM.API.Core.Entities
{
    /// <summary>
    /// Title entity (Mr, Mrs, Miss, Dr, etc.)
    /// </summary>
    public class Title
    {
        [Key]
        public int TitleId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Description { get; set; } = string.Empty;
    }
}
