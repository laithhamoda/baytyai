using BaytyAI.Application.Common.Models;
using BaytyAI.Application.DTOs;
using BaytyAI.Domain.Entities;
using BaytyAI.Domain.Enums;
using BaytyAI.Domain.Interfaces;
using MediatR;

namespace BaytyAI.Application.Features.Organizations.Commands;

public record CreateOrganizationCommand(Guid UserId, CreateOrganizationDto Dto) : IRequest<Result<OrganizationDto>>;

public class CreateOrganizationCommandHandler(IUnitOfWork uow)
    : IRequestHandler<CreateOrganizationCommand, Result<OrganizationDto>>
{
    public async Task<Result<OrganizationDto>> Handle(CreateOrganizationCommand request, CancellationToken ct)
    {
        var slug = request.Dto.Name.ToLower().Replace(" ", "-");
        var existing = await uow.Repository<Organization>()
            .FirstOrDefaultAsync(o => o.Slug == slug, ct);
        if (existing is not null) slug = $"{slug}-{Guid.NewGuid().ToString("N")[..6]}";

        var org = new Organization
        {
            Name = request.Dto.Name,
            Slug = slug,
            OwnerId = request.UserId
        };

        await uow.Repository<Organization>().AddAsync(org, ct);

        var member = new OrganizationMember
        {
            OrganizationId = org.Id,
            UserId = request.UserId,
            Role = MemberRole.Owner
        };
        await uow.Repository<OrganizationMember>().AddAsync(member, ct);
        await uow.SaveChangesAsync(ct);

        return Result<OrganizationDto>.Success(new OrganizationDto(org.Id, org.Name, org.Slug, org.Plan, org.CreatedAt));
    }
}
