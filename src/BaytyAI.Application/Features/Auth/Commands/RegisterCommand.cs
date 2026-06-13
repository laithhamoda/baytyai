using BaytyAI.Application.Common.Interfaces;
using BaytyAI.Application.Common.Models;
using BaytyAI.Application.DTOs;
using BaytyAI.Domain.Entities;
using BaytyAI.Domain.Interfaces;
using MediatR;

namespace BaytyAI.Application.Features.Auth.Commands;

public record RegisterCommand(RegisterDto Dto) : IRequest<Result<AuthResponseDto>>;

public class RegisterCommandHandler(IUnitOfWork uow, ITokenService tokenService, IEmailService emailService)
    : IRequestHandler<RegisterCommand, Result<AuthResponseDto>>
{
    public async Task<Result<AuthResponseDto>> Handle(RegisterCommand request, CancellationToken ct)
    {
        var existing = await uow.Repository<User>()
            .FirstOrDefaultAsync(u => u.Email == request.Dto.Email.ToLower(), ct);

        if (existing is not null)
            return Result<AuthResponseDto>.Failure("Email already registered.");

        var user = new User
        {
            Email = request.Dto.Email.ToLower(),
            FirstName = request.Dto.FirstName,
            LastName = request.Dto.LastName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Dto.Password),
            EmailConfirmed = true,
            RefreshToken = tokenService.GenerateRefreshToken(),
            RefreshTokenExpiry = DateTime.UtcNow.AddDays(30)
        };

        await uow.Repository<User>().AddAsync(user, ct);
        await uow.SaveChangesAsync(ct);

        await emailService.SendWelcomeEmailAsync(user.Email, user.FirstName, ct);

        var accessToken = tokenService.GenerateAccessToken(user, []);
        return Result<AuthResponseDto>.Success(new AuthResponseDto(
            accessToken,
            user.RefreshToken!,
            new UserDto(user.Id, user.Email, user.FirstName, user.LastName, user.AvatarUrl)));
    }
}
