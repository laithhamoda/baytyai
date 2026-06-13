using BaytyAI.Application.Common.Models;
using BaytyAI.Application.DTOs;
using BaytyAI.Domain.Entities;
using BaytyAI.Domain.Interfaces;
using MediatR;

namespace BaytyAI.Application.Features.Leads.Commands;

public record SubmitLeadCommand(SubmitLeadDto Dto) : IRequest<Result>;

public class SubmitLeadCommandHandler(IUnitOfWork uow) : IRequestHandler<SubmitLeadCommand, Result>
{
    public async Task<Result> Handle(SubmitLeadCommand request, CancellationToken ct)
    {
        var lead = new Lead
        {
            Name = request.Dto.Name,
            Email = request.Dto.Email.ToLower(),
            Phone = request.Dto.Phone,
            Company = request.Dto.Company,
            Message = request.Dto.Message,
            Source = request.Dto.Source,
            Role = request.Dto.Role,
            ConsentGiven = request.Dto.ConsentGiven
        };

        await uow.Repository<Lead>().AddAsync(lead, ct);
        await uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
