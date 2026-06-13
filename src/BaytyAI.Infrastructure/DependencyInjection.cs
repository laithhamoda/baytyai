using BaytyAI.Application.Common.Interfaces;
using BaytyAI.Domain.Interfaces;
using BaytyAI.Infrastructure.Data;
using BaytyAI.Infrastructure.Repositories;
using BaytyAI.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BaytyAI.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlite(config.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddSingleton<Microsoft.AspNetCore.Http.IHttpContextAccessor,
            Microsoft.AspNetCore.Http.HttpContextAccessor>();

        return services;
    }
}
