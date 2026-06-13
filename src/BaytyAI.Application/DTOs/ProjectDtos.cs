using BaytyAI.Domain.Enums;

namespace BaytyAI.Application.DTOs;

public record CreateProjectDto(string Title, string ProjectType, string Location, decimal? BudgetAed, string? Description);

public record SaveStepDto(int StepNumber, string DataJson);

public record ProjectDto(
    Guid Id,
    string Title,
    string ProjectType,
    string Location,
    decimal? BudgetAed,
    ProjectStatus Status,
    int CurrentStep,
    DateTime CreatedAt,
    DateTime? SubmittedAt,
    List<ProjectDocumentDto> Documents);

public record ProjectDocumentDto(Guid Id, string FileName, string DocumentType, long FileSizeBytes, DateTime CreatedAt);

public record ProjectStepDto(int StepNumber, string DataJson, bool IsCompleted);
