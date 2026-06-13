using BaytyAI.Application.Common.Models;
using BaytyAI.Application.DTOs;
using BaytyAI.Domain.Entities;
using BaytyAI.Domain.Interfaces;
using MediatR;

namespace BaytyAI.Application.Features.Projects.Commands;

public record SaveStepCommand(Guid ProjectId, Guid UserId, SaveStepDto Dto) : IRequest<Result>;

public class SaveStepCommandHandler(IUnitOfWork uow) : IRequestHandler<SaveStepCommand, Result>
{
    public async Task<Result> Handle(SaveStepCommand request, CancellationToken ct)
    {
        var project = await uow.Repository<Project>().GetByIdAsync(request.ProjectId, ct);
        if (project is null) return Result.Failure("Project not found.");
        if (project.CreatedByUserId != request.UserId) return Result.Failure("Access denied.");

        var steps = await uow.Repository<ProjectStep>()
            .FindAsync(s => s.ProjectId == request.ProjectId, ct);

        var existing = steps.FirstOrDefault(s => s.StepNumber == request.Dto.StepNumber);
        if (existing is not null)
        {
            existing.DataJson = request.Dto.DataJson;
            existing.IsCompleted = true;
            existing.CompletedAt = DateTime.UtcNow;
            existing.UpdatedAt = DateTime.UtcNow;
            uow.Repository<ProjectStep>().Update(existing);
        }
        else
        {
            var step = new ProjectStep
            {
                ProjectId = request.ProjectId,
                StepNumber = request.Dto.StepNumber,
                DataJson = request.Dto.DataJson,
                IsCompleted = true,
                CompletedAt = DateTime.UtcNow
            };
            await uow.Repository<ProjectStep>().AddAsync(step, ct);
        }

        project.CurrentStep = Math.Max(project.CurrentStep, request.Dto.StepNumber + 1);
        project.UpdatedAt = DateTime.UtcNow;
        uow.Repository<Project>().Update(project);

        await uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
