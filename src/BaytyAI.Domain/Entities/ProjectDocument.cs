using BaytyAI.Domain.Common;

namespace BaytyAI.Domain.Entities;

public class ProjectDocument : BaseEntity
{
    public Guid ProjectId { get; set; }
    public Guid UploadedByUserId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public string DocumentType { get; set; } = string.Empty;

    public Project Project { get; set; } = null!;
    public User UploadedBy { get; set; } = null!;
}
