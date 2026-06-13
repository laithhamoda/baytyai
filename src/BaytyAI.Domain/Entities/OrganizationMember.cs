using BaytyAI.Domain.Common;
using BaytyAI.Domain.Enums;

namespace BaytyAI.Domain.Entities;

public class OrganizationMember : BaseEntity
{
    public Guid OrganizationId { get; set; }
    public Guid UserId { get; set; }
    public MemberRole Role { get; set; } = MemberRole.Member;

    public Organization Organization { get; set; } = null!;
    public User User { get; set; } = null!;
}
