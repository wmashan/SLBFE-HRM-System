using System.ComponentModel.DataAnnotations;

namespace SLBFE.HRM.API.Core.Entities
{
    /// <summary>
    /// Employee Type entity (Permanent, Contract, Casual, etc.)
    /// </summary>
    public class EmployeeType
    {
        [Key]
        public int EmployeeTypeId { get; set; }

        [Required]
        [MaxLength(50)]
        public string TypeName { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? Description { get; set; }
    }
}
