using BaytyAI.Application.Common.Models;
using BaytyAI.Application.DTOs;
using BaytyAI.Domain.Entities;
using BaytyAI.Domain.Enums;
using BaytyAI.Domain.Interfaces;
using MediatR;

namespace BaytyAI.Application.Features.KYC.Commands;

public record SubmitKycCommand(Guid UserId, SubmitKycDto Dto) : IRequest<Result>;

public class SubmitKycCommandHandler(IUnitOfWork uow) : IRequestHandler<SubmitKycCommand, Result>
{
    public async Task<Result> Handle(SubmitKycCommand request, CancellationToken ct)
    {
        var existing = await uow.Repository<KycVerification>()
            .FirstOrDefaultAsync(k => k.UserId == request.UserId, ct);

        if (existing is not null && existing.Status == KycStatus.Approved)
            return Result.Failure("KYC already approved.");

        if (existing is not null)
        {
            existing.FullLegalName = request.Dto.FullLegalName;
            existing.NationalId = request.Dto.NationalId;
            existing.Status = KycStatus.Submitted;
            existing.SubmittedAt = DateTime.UtcNow;
            existing.UpdatedAt = DateTime.UtcNow;
            uow.Repository<KycVerification>().Update(existing);
        }
        else
        {
            var kyc = new KycVerification
            {
                UserId = request.UserId,
                FullLegalName = request.Dto.FullLegalName,
                NationalId = request.Dto.NationalId,
                Status = KycStatus.Submitted,
                SubmittedAt = DateTime.UtcNow
            };
            await uow.Repository<KycVerification>().AddAsync(kyc, ct);
        }

        await uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
