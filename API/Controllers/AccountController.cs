using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Dtos;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManger;
        private readonly RoleManager<IdentityRole> _roleManger;
        private readonly IConfiguration _configuration;

        public AccountController(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            _userManger = userManager;
            _roleManger = roleManager;
            _configuration = configuration;
        }
        [HttpPost("register")]
        public async Task<ActionResult<string>> Regsiter(RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = new AppUser
            {
                Email = registerDto.Email,
                FullName = registerDto.FullName,
                UserName = registerDto.Email
            };
            var result = await _userManger.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }
            if (registerDto.Roles is null)
            {
                await _userManger.AddToRoleAsync(user, "User");
            }
            else
            {
                foreach (var role in registerDto.Roles)
                {
                    await _userManger.AddToRoleAsync(user, role);
                }
            }
            return Ok(new AuthResponeDto
            {
                IsSuccess = true,
                Message = "Account create Successfully"
            });
        }
        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManger.FindByEmailAsync(loginDto.Email);

            if (user is null)
            {
                return Unauthorized(new AuthResponeDto
                {
                    IsSuccess = false,
                    Message = "User not found with this email"
                });
            }
            var result = await _userManger.CheckPasswordAsync(user, loginDto.Password);
            if (!result)
            {
                return Unauthorized(new AuthResponeDto
                {
                    IsSuccess = false,
                    Message = "Invalid Password"
                });
            }

            var token = GenerateToken(user);
            return Ok(new AuthResponeDto
            {
                Token = token,
                IsSuccess = true,
                Message = "Login success"
            });

        }

        private string GenerateToken(AppUser user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8
            .GetBytes(_configuration.GetSection("JWTSetting").GetSection("securityKey").Value!);
            var roles = _userManger.GetRolesAsync(user).Result;

            List<Claim> claims =
            [
                new (JwtRegisteredClaimNames.Email, user.Email??""),
                new (JwtRegisteredClaimNames.Name, user.FullName??""),
                new (JwtRegisteredClaimNames.NameId, user.Id??""),
                new (JwtRegisteredClaimNames.NameId, user.Id??""),
                new (JwtRegisteredClaimNames.Aud,
                _configuration.GetSection("JWTSetting").GetSection("ValidAudience").Value!),
                new (JwtRegisteredClaimNames.Iss,
                _configuration.GetSection("JWTSetting").GetSection("ValidIssuer").Value!)
            ];
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256
                )
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        [Authorize]
        [HttpGet("user-detail")]
        public async Task<ActionResult<UserDetailDto>> GetUserDetail()
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManger.FindByIdAsync(currentUserId!);
            if (user is null)
            {
                return NotFound(new AuthResponeDto
                {
                    IsSuccess = false,
                    Message = "User not found"
                });
            }
            return Ok(new UserDetailDto
            {
                Id = user.Id,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Roles = [.. await _userManger.GetRolesAsync(user)],
                FullName = user.FullName,
                PhoneNumberComfirmed = user.PhoneNumberConfirmed,
                TowFacotrEnable = user.TwoFactorEnabled,
                AccessFailedCount = user.AccessFailedCount,
            });
        }
    }
}