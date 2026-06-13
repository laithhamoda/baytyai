using BaytyAI.Application.Common.Models;
using BaytyAI.Application.DTOs;
using BaytyAI.Domain.Entities;
using BaytyAI.Domain.Interfaces;
using MediatR;

namespace BaytyAI.Application.Features.Projects.Queries;

public record GetProjectsQuery(Guid OrganizationId) : IRequest<Result<List<ProjectDto>>>;

public class GetProjectsQueryHandler(IUnitOfWork uow) : IRequestHandler<GetProjectsQuery, Result<List<ProjectDto>>>
{
    public async Task<Result<List<ProjectDto>>> Handle(GetProjectsQuery request, CancellationToken ct)
    {
        var projects = await uow.Repository<Project>()
            .FindAsync(p => p.OrganizationId == request.OrganizationId, ct);

        var dtos = projects.Select(p => new ProjectDto(
            p.Id, p.Title, p.ProjectType, p.Location, p.BudgetAed,
            p.Status, p.CurrentStep, p.CreatedAt, p.SubmittedAt,
            p.Documents.Select(d => new ProjectDocumentDto(d.Id, d.FileName, d.DocumentType, d.FileSizeBytes, d.CreatedAt)).ToList()
        )).ToList();

        return Result<List<ProjectDto>>.Success(dtos);
    }
}
