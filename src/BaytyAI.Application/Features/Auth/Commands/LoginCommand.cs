using BaytyAI.Application.Common.Interfaces;
using BaytyAI.Application.Common.Models;
using BaytyAI.Application.DTOs;
using BaytyAI.Domain.Entities;
using BaytyAI.Domain.Interfaces;
using MediatR;

namespace BaytyAI.Application.Features.Auth.Commands;

public record LoginCommand(LoginDto Dto) : IRequest<Result<AuthResponseDto>>;

public class LoginCommandHandler(IUnitOfWork uow, ITokenService tokenService)
    : IRequestHandler<LoginCommand, Result<AuthResponseDto>>
{
    public async Task<Result<AuthResponseDto>> Handle(LoginCommand request, CancellationToken ct)
    {
        var user = await uow.Repository<User>()
            .FirstOrDefaultAsync(u => u.Email == request.Dto.Email.ToLower(), ct);

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Dto.Password, user.PasswordHash))
            return Result<AuthResponseDto>.Failure("Invalid email or password.");

        user.RefreshToken = tokenService.GenerateRefreshToken();
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(30);
        user.UpdatedAt = DateTime.UtcNow;
        uow.Repository<User>().Update(user);
        await uow.SaveChangesAsync(ct);

        var accessToken = tokenService.GenerateAccessToken(user, []);
        return Result<AuthResponseDto>.Success(new AuthResponseDto(
            accessToken,
            user.RefreshToken!,
            new UserDto(user.Id, user.Email, user.FirstName, user.LastName, user.AvatarUrl)));
    }
}
