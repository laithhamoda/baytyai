namespace BaytyAI.Application.DTOs;

public record RegisterDto(string FirstName, string LastName, string Email, string Password);

public record LoginDto(string Email, string Password);

public record AuthResponseDto(string AccessToken, string RefreshToken, UserDto User);

public record UserDto(Guid Id, string Email, string FirstName, string LastName, string? AvatarUrl);

public record RefreshTokenDto(string RefreshToken);
