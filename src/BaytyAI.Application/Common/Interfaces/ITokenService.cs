using BaytyAI.Domain.Entities;

namespace BaytyAI.Application.Common.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user, IList<string> roles);
    string GenerateRefreshToken();
}
