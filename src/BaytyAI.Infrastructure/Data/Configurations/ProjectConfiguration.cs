using BaytyAI.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BaytyAI.Infrastructure.Data.Configurations;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Title).HasMaxLength(300).IsRequired();
        builder.Property(p => p.ProjectType).HasMaxLength(100).IsRequired();
        builder.Property(p => p.Location).HasMaxLength(300).IsRequired();
        builder.Property(p => p.BudgetAed).HasColumnType("decimal(18,2)");

        builder.HasOne(p => p.CreatedBy)
               .WithMany()
               .HasForeignKey(p => p.CreatedByUserId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.Documents)
               .WithOne(d => d.Project)
               .HasForeignKey(d => d.ProjectId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Steps)
               .WithOne(s => s.Project)
               .HasForeignKey(s => s.ProjectId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
