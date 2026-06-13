using BaytyAI.Application.DTOs;
using BaytyAI.Application.Features.Auth.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BaytyAI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IMediator mediator) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto, CancellationToken ct)
    {
        var result = await mediator.Send(new RegisterCommand(dto), ct);
        return result.Succeeded ? Ok(result.Value) : BadRequest(result.Errors);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto, CancellationToken ct)
    {
        var result = await mediator.Send(new LoginCommand(dto), ct);
        return result.Succeeded ? Ok(result.Value) : Unauthorized(result.Errors);
    }
}
