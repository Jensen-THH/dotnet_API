namespace API.Dtos
{
    public class AuthResponeDto
    {
        public string Token { get; set; } = string.Empty;
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
    }
}