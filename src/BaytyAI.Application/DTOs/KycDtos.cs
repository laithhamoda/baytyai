using BaytyAI.Domain.Enums;

namespace BaytyAI.Application.DTOs;

public record SubmitKycDto(string FullLegalName, string NationalId);

public record KycStatusDto(KycStatus Status, DateTime? SubmittedAt, string? RejectionReason);
