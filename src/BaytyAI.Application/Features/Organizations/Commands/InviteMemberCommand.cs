using BaytyAI.Application.Common.Interfaces;
using BaytyAI.Application.Common.Models;
using BaytyAI.Application.DTOs;
using BaytyAI.Domain.Entities;
using BaytyAI.Domain.Interfaces;
using MediatR;

namespace BaytyAI.Application.Features.Organizations.Commands;

public record InviteMemberCommand(Guid OrganizationId, Guid InvitedByUserId, InviteMemberDto Dto)
    : IRequest<Result<InvitationDto>>;

public class InviteMemberCommandHandler(IUnitOfWork uow, IEmailService emailService)
    : IRequestHandler<InviteMemberCommand, Result<InvitationDto>>
{
    public async Task<Result<InvitationDto>> Handle(InviteMemberCommand request, CancellationToken ct)
    {
        var org = await uow.Repository<Organization>().GetByIdAsync(request.OrganizationId, ct);
        if (org is null) return Result<InvitationDto>.Failure("Organization not found.");

        var invitation = new Invitation
        {
            OrganizationId = request.OrganizationId,
            InvitedByUserId = request.InvitedByUserId,
            InvitedEmail = request.Dto.Email.ToLower(),
            Role = request.Dto.Role
        };

        await uow.Repository<Invitation>().AddAsync(invitation, ct);
        await uow.SaveChangesAsync(ct);

        var inviteUrl = $"https://baytyai.com/invite/{invitation.Token}";
        await emailService.SendInvitationEmailAsync(invitation.InvitedEmail, org.Name, inviteUrl, ct);

        return Result<InvitationDto>.Success(new InvitationDto(
            invitation.Id, invitation.InvitedEmail, invitation.Role, invitation.Status, invitation.ExpiresAt));
    }
}
