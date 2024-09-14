using API.Dtos;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<AppUser> _userManager;
        public RolesController(RoleManager<IdentityRole> roleManager, UserManager<AppUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        [HttpPost("CreateRole")]
        public async Task<IActionResult> CreateRole([FromBody] CreateRoleDto createRoleDto)
        {
            if (string.IsNullOrEmpty(createRoleDto.RoleName))
            {
                return BadRequest("RoleName is required");
            }
            var roleExist = await _roleManager.RoleExistsAsync(createRoleDto.RoleName);
            if (roleExist)
            {
                return BadRequest("Role is exist");
            }
            var roleResult = await _roleManager.CreateAsync(new IdentityRole(createRoleDto.RoleName));

            if (roleResult.Succeeded)
            {
                return Ok(new { message = "Role created successfuly" });
            }
            return BadRequest("Role creation failed");
        }
        [HttpGet("GetRole")]
        public async Task<ActionResult<IEnumerable<RoleResponseDto>>> GetRole()
        {
            var roles = await _roleManager.Roles.Select(r => new RoleResponseDto
            {
                Id = r.Id,
                Name = r.Name,
                TotalUsers = _userManager.GetUsersInRoleAsync(r.Name!).Result.Count
            }).ToListAsync();

            return Ok(roles);
        }
        
        [AllowAnonymous]
        [HttpGet("GetRoleListName")]
        public async Task<ActionResult<IEnumerable<string>>> GetRoleListName()
        {
            var roleNames = await _roleManager.Roles
                .Select(r => r.Name)
                .ToListAsync();
            return Ok(roleNames);
        }
        [HttpDelete("DeleteRole/{id}")]
        public async Task<IActionResult> DeleteRole(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role is null)
            {
                return NotFound("Role is not found");
            }

            var result = await _roleManager.DeleteAsync(role);
            if (result.Succeeded)
            {
                return Ok(new { message = "Role deleted succesfully" });
            }
            return BadRequest("Role deletion failed");
        }

        [HttpPost("assign")]
        public async Task<IActionResult> AssignRole(AssignRoleDto assignRoleDto)
        {
            var user = await _userManager.FindByIdAsync(assignRoleDto.UserId);
            if (user is null)
            {
                return NotFound("User not found");
            }
            var role = await _roleManager.FindByIdAsync(assignRoleDto.RoleId);
            if (role is null)
            {
                return NotFound("Role not found");
            }
            var result = await _userManager.AddToRoleAsync(user, role.Name!);
            if (result.Succeeded)
            {
                return Ok(new { mesage = "Role assigned successfully" });
            }
            var error = result.Errors.FirstOrDefault();
            return BadRequest(error?.Description);
        }
    }
}