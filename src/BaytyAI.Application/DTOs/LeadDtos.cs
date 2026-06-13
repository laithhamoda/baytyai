namespace BaytyAI.Application.DTOs;

public record SubmitLeadDto(
    string Name,
    string Email,
    string? Phone,
    string? Company,
    string? Message,
    string? Source,
    string? Role,
    bool ConsentGiven);
