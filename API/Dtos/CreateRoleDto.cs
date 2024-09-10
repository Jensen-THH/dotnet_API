using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class CreateRoleDto
    {
        [Required(ErrorMessage ="Role is required")]
        public string RoleName { get; set; } = null;
    }
}