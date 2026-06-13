using BaytyAI.Domain.Common;

namespace BaytyAI.Domain.Entities;

public class Lead : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Company { get; set; }
    public string? Message { get; set; }
    public string? Source { get; set; }
    public string? Role { get; set; }
    public bool ConsentGiven { get; set; }
}
