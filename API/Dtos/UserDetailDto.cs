using System.ComponentModel.DataAnnotations;
namespace API.Dtos
{
    public class UserDetailDto
    {
        public string? Id { get; set; }
        public string? Email { get; set; }
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string[]? Roles { get; set; }
        public bool TowFacotrEnable { get; set; }
        public bool PhoneNumberComfirmed { get; set; }
        public int AccessFailedCount { get; set; }
    }
}