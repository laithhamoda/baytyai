using BaytyAI.Application.Common.Interfaces;
using BaytyAI.Application.DTOs;
using BaytyAI.Application.Features.KYC.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BaytyAI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class KycController(IMediator mediator, ICurrentUserService currentUser) : ControllerBase
{
    [HttpPost("submit")]
    public async Task<IActionResult> Submit([FromBody] SubmitKycDto dto, CancellationToken ct)
    {
        if (currentUser.UserId is null) return Unauthorized();
        var result = await mediator.Send(new SubmitKycCommand(currentUser.UserId.Value, dto), ct);
        return result.Succeeded ? NoContent() : BadRequest(result.Errors);
    }
}
