using BaytyAI.Domain.Common;
using BaytyAI.Domain.Interfaces;
using BaytyAI.Infrastructure.Data;

namespace BaytyAI.Infrastructure.Repositories;

public class UnitOfWork(ApplicationDbContext context) : IUnitOfWork
{
    private readonly Dictionary<Type, object> _repos = [];

    public IRepository<T> Repository<T>() where T : BaseEntity
    {
        if (!_repos.TryGetValue(typeof(T), out var repo))
        {
            repo = new GenericRepository<T>(context);
            _repos[typeof(T)] = repo;
        }
        return (IRepository<T>)repo;
    }

    public Task<int> SaveChangesAsync(CancellationToken ct = default)
        => context.SaveChangesAsync(ct);

    public void Dispose() => context.Dispose();
}
