using BaytyAI.Domain.Common;
using BaytyAI.Domain.Enums;

namespace BaytyAI.Domain.Entities;

public class Project : BaseEntity
{
    public Guid OrganizationId { get; set; }
    public Guid CreatedByUserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ProjectType { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal? BudgetAed { get; set; }
    public ProjectStatus Status { get; set; } = ProjectStatus.Draft;
    public int CurrentStep { get; set; } = 1;
    public DateTime? SubmittedAt { get; set; }

    public Organization Organization { get; set; } = null!;
    public User CreatedBy { get; set; } = null!;
    public ICollection<ProjectDocument> Documents { get; set; } = [];
    public ICollection<ProjectStep> Steps { get; set; } = [];
}
