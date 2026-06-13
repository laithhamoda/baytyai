using BaytyAI.Domain.Common;
using BaytyAI.Domain.Enums;

namespace BaytyAI.Domain.Entities;

public class KycVerification : BaseEntity
{
    public Guid UserId { get; set; }
    public KycStatus Status { get; set; } = KycStatus.NotStarted;
    public string? FullLegalName { get; set; }
    public string? NationalId { get; set; }
    public string? DocumentPath { get; set; }
    public string? SelfieImagePath { get; set; }
    public string? RejectionReason { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }

    public User User { get; set; } = null!;
}
