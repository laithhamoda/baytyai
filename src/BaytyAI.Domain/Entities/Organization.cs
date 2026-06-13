using BaytyAI.Domain.Common;

namespace BaytyAI.Domain.Entities;

public class Organization : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public Guid OwnerId { get; set; }
    public string Plan { get; set; } = "free";
    public string? LogoUrl { get; set; }

    public User Owner { get; set; } = null!;
    public ICollection<OrganizationMember> Members { get; set; } = [];
    public ICollection<Project> Projects { get; set; } = [];
    public ICollection<Invitation> Invitations { get; set; } = [];
}
