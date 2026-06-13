using BaytyAI.Application.Common.Models;
using BaytyAI.Domain.Entities;
using BaytyAI.Domain.Enums;
using BaytyAI.Domain.Interfaces;
using MediatR;

namespace BaytyAI.Application.Features.Projects.Commands;

public record SubmitProjectCommand(Guid ProjectId, Guid UserId) : IRequest<Result>;

public class SubmitProjectCommandHandler(IUnitOfWork uow) : IRequestHandler<SubmitProjectCommand, Result>
{
    public async Task<Result> Handle(SubmitProjectCommand request, CancellationToken ct)
    {
        var project = await uow.Repository<Project>().GetByIdAsync(request.ProjectId, ct);
        if (project is null) return Result.Failure("Project not found.");
        if (project.CreatedByUserId != request.UserId) return Result.Failure("Access denied.");
        if (project.Status != ProjectStatus.Draft) return Result.Failure("Project is not in draft state.");

        project.Status = ProjectStatus.Submitted;
        project.SubmittedAt = DateTime.UtcNow;
        project.UpdatedAt = DateTime.UtcNow;
        uow.Repository<Project>().Update(project);

        await uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
