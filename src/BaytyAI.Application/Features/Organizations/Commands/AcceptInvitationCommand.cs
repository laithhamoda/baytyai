using BaytyAI.Application.Common.Models;
using BaytyAI.Application.DTOs;
using BaytyAI.Domain.Entities;
using BaytyAI.Domain.Enums;
using BaytyAI.Domain.Interfaces;
using MediatR;

namespace BaytyAI.Application.Features.Organizations.Commands;

public record AcceptInvitationCommand(Guid UserId, AcceptInvitationDto Dto) : IRequest<Result>;

public class AcceptInvitationCommandHandler(IUnitOfWork uow) : IRequestHandler<AcceptInvitationCommand, Result>
{
    public async Task<Result> Handle(AcceptInvitationCommand request, CancellationToken ct)
    {
        var invitation = await uow.Repository<Invitation>()
            .FirstOrDefaultAsync(i => i.Token == request.Dto.Token && i.Status == InvitationStatus.Pending, ct);

        if (invitation is null) return Result.Failure("Invalid or expired invitation.");
        if (invitation.ExpiresAt < DateTime.UtcNow)
        {
            invitation.Status = InvitationStatus.Expired;
            uow.Repository<Invitation>().Update(invitation);
            await uow.SaveChangesAsync(ct);
            return Result.Failure("Invitation has expired.");
        }

        var member = new OrganizationMember
        {
            OrganizationId = invitation.OrganizationId,
            UserId = request.UserId,
            Role = invitation.Role
        };
        await uow.Repository<OrganizationMember>().AddAsync(member, ct);

        invitation.Status = InvitationStatus.Accepted;
        invitation.UpdatedAt = DateTime.UtcNow;
        uow.Repository<Invitation>().Update(invitation);

        await uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
