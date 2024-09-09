using API.Dtos;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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
            var result = await _userManger.CreateAsync(user, registerDto.PassWord);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }
            if (registerDto.Roles is null) {
                await _userManger.AddToRoleAsync(user, "User");
            }
            else {
                foreach (var role in registerDto.Roles)
                {
                    await _userManger.AddToRoleAsync(user,role);
                }
            }
            return Ok(new AuthResponeDto {
                IsSuccess =true,
                Message= "Account create Successfully"
            });
        }
    }
}