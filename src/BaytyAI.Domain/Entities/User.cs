using BaytyAI.Domain.Common;

namespace BaytyAI.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public bool EmailConfirmed { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiry { get; set; }

    public ICollection<OrganizationMember> OrganizationMemberships { get; set; } = [];
    public ICollection<Invitation> SentInvitations { get; set; } = [];
    public KycVerification? KycVerification { get; set; }
}
