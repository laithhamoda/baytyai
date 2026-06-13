using BaytyAI.Application.DTOs;
using BaytyAI.Application.Features.Leads.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BaytyAI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeadsController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] SubmitLeadDto dto, CancellationToken ct)
    {
        var result = await mediator.Send(new SubmitLeadCommand(dto), ct);
        return result.Succeeded ? Ok() : BadRequest(result.Errors);
    }
}
