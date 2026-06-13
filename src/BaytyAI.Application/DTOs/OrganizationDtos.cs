using BaytyAI.Domain.Enums;

namespace BaytyAI.Application.DTOs;

public record CreateOrganizationDto(string Name);

public record OrganizationDto(Guid Id, string Name, string Slug, string Plan, DateTime CreatedAt);

public record MemberDto(Guid UserId, string Email, string FirstName, string LastName, MemberRole Role, DateTime JoinedAt);

public record InviteMemberDto(string Email, MemberRole Role);

public record InvitationDto(Guid Id, string InvitedEmail, MemberRole Role, InvitationStatus Status, DateTime ExpiresAt);

public record AcceptInvitationDto(string Token);
