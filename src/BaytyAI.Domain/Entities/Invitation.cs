using BaytyAI.Domain.Common;
using BaytyAI.Domain.Enums;

namespace BaytyAI.Domain.Entities;

public class Invitation : BaseEntity
{
    public Guid OrganizationId { get; set; }
    public Guid InvitedByUserId { get; set; }
    public string InvitedEmail { get; set; } = string.Empty;
    public string Token { get; set; } = Guid.NewGuid().ToString("N");
    public MemberRole Role { get; set; } = MemberRole.Member;
    public InvitationStatus Status { get; set; } = InvitationStatus.Pending;
    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddDays(7);

    public Organization Organization { get; set; } = null!;
    public User InvitedBy { get; set; } = null!;
}
