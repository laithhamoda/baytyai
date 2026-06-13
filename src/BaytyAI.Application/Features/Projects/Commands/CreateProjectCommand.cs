using BaytyAI.Application.Common.Models;
using BaytyAI.Application.DTOs;
using BaytyAI.Domain.Entities;
using BaytyAI.Domain.Interfaces;
using MediatR;

namespace BaytyAI.Application.Features.Projects.Commands;

public record CreateProjectCommand(Guid OrganizationId, Guid UserId, CreateProjectDto Dto) : IRequest<Result<ProjectDto>>;

public class CreateProjectCommandHandler(IUnitOfWork uow) : IRequestHandler<CreateProjectCommand, Result<ProjectDto>>
{
    public async Task<Result<ProjectDto>> Handle(CreateProjectCommand request, CancellationToken ct)
    {
        var project = new Project
        {
            OrganizationId = request.OrganizationId,
            CreatedByUserId = request.UserId,
            Title = request.Dto.Title,
            ProjectType = request.Dto.ProjectType,
            Location = request.Dto.Location,
            BudgetAed = request.Dto.BudgetAed,
            Description = request.Dto.Description,
            CurrentStep = 1
        };

        await uow.Repository<Project>().AddAsync(project, ct);
        await uow.SaveChangesAsync(ct);

        return Result<ProjectDto>.Success(MapToDto(project));
    }

    private static ProjectDto MapToDto(Project p) => new(
        p.Id, p.Title, p.ProjectType, p.Location, p.BudgetAed,
        p.Status, p.CurrentStep, p.CreatedAt, p.SubmittedAt, []);
}
