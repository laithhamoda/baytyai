using BaytyAI.Application.Common.Interfaces;
using BaytyAI.Application.DTOs;
using BaytyAI.Application.Features.Projects.Commands;
using BaytyAI.Application.Features.Projects.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BaytyAI.API.Controllers;

[ApiController]
[Route("api/organizations/{orgId}/projects")]
[Authorize]
public class ProjectsController(IMediator mediator, ICurrentUserService currentUser) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(Guid orgId, CancellationToken ct)
    {
        var result = await mediator.Send(new GetProjectsQuery(orgId), ct);
        return result.Succeeded ? Ok(result.Value) : BadRequest(result.Errors);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Guid orgId, [FromBody] CreateProjectDto dto, CancellationToken ct)
    {
        if (currentUser.UserId is null) return Unauthorized();
        var result = await mediator.Send(new CreateProjectCommand(orgId, currentUser.UserId.Value, dto), ct);
        return result.Succeeded ? CreatedAtAction(nameof(GetAll), new { orgId }, result.Value) : BadRequest(result.Errors);
    }

    [HttpPut("{projectId}/steps")]
    public async Task<IActionResult> SaveStep(Guid orgId, Guid projectId, [FromBody] SaveStepDto dto, CancellationToken ct)
    {
        if (currentUser.UserId is null) return Unauthorized();
        var result = await mediator.Send(new SaveStepCommand(projectId, currentUser.UserId.Value, dto), ct);
        return result.Succeeded ? NoContent() : BadRequest(result.Errors);
    }

    [HttpPost("{projectId}/submit")]
    public async Task<IActionResult> Submit(Guid orgId, Guid projectId, CancellationToken ct)
    {
        if (currentUser.UserId is null) return Unauthorized();
        var result = await mediator.Send(new SubmitProjectCommand(projectId, currentUser.UserId.Value), ct);
        return result.Succeeded ? NoContent() : BadRequest(result.Errors);
    }
}
