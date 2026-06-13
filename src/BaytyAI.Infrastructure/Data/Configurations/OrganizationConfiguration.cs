using BaytyAI.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BaytyAI.Infrastructure.Data.Configurations;

public class OrganizationConfiguration : IEntityTypeConfiguration<Organization>
{
    public void Configure(EntityTypeBuilder<Organization> builder)
    {
        builder.HasKey(o => o.Id);
        builder.HasIndex(o => o.Slug).IsUnique();
        builder.Property(o => o.Name).HasMaxLength(200).IsRequired();
        builder.Property(o => o.Slug).HasMaxLength(200).IsRequired();
        builder.Property(o => o.Plan).HasMaxLength(50).HasDefaultValue("free");

        builder.HasOne(o => o.Owner)
               .WithMany()
               .HasForeignKey(o => o.OwnerId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(o => o.Members)
               .WithOne(m => m.Organization)
               .HasForeignKey(m => m.OrganizationId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(o => o.Projects)
               .WithOne(p => p.Organization)
               .HasForeignKey(p => p.OrganizationId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(o => o.Invitations)
               .WithOne(i => i.Organization)
               .HasForeignKey(i => i.OrganizationId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
