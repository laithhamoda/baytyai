using BaytyAI.Application.Common.Interfaces;
using BaytyAI.Application.DTOs;
using BaytyAI.Application.Features.Organizations.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BaytyAI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrganizationsController(IMediator mediator, ICurrentUserService currentUser) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrganizationDto dto, CancellationToken ct)
    {
        if (currentUser.UserId is null) return Unauthorized();
        var result = await mediator.Send(new CreateOrganizationCommand(currentUser.UserId.Value, dto), ct);
        return result.Succeeded ? Ok(result.Value) : BadRequest(result.Errors);
    }

    [HttpPost("{orgId}/members/invite")]
    public async Task<IActionResult> InviteMember(Guid orgId, [FromBody] InviteMemberDto dto, CancellationToken ct)
    {
        if (currentUser.UserId is null) return Unauthorized();
        var result = await mediator.Send(new InviteMemberCommand(orgId, currentUser.UserId.Value, dto), ct);
        return result.Succeeded ? Ok(result.Value) : BadRequest(result.Errors);
    }

    [HttpPost("invitations/accept")]
    public async Task<IActionResult> AcceptInvitation([FromBody] AcceptInvitationDto dto, CancellationToken ct)
    {
        if (currentUser.UserId is null) return Unauthorized();
        var result = await mediator.Send(new AcceptInvitationCommand(currentUser.UserId.Value, dto), ct);
        return result.Succeeded ? NoContent() : BadRequest(result.Errors);
    }
}
