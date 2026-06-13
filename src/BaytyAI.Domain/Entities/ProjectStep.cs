using BaytyAI.Domain.Common;

namespace BaytyAI.Domain.Entities;

public class ProjectStep : BaseEntity
{
    public Guid ProjectId { get; set; }
    public int StepNumber { get; set; }
    public string DataJson { get; set; } = "{}";
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAt { get; set; }

    public Project Project { get; set; } = null!;
}
