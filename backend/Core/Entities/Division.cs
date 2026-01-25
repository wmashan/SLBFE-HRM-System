using System.ComponentModel.DataAnnotations;

namespace SLBFE.HRM.API.Core.Entities
{
    /// <summary>
    /// Division entity
    /// </summary>
    public class Division
    {
        [Key]
        public int DivisionId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Description { get; set; } = string.Empty;
    }
}
