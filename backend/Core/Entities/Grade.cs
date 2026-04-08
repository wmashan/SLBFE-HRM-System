using System.ComponentModel.DataAnnotations;

namespace SLBFE.HRM.API.Core.Entities
{
    /// <summary>
    /// Grade entity
    /// </summary>
    public class Grade
    {
        [Key]
        [MaxLength(50)]
        public string GradeId { get; set; } = string.Empty;

        [Required]
        public string Designation { get; set; } = string.Empty;
    }
}
