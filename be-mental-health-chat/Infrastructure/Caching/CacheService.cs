using Application.Caching;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Infrastructure.Caching;

public class CacheService : ICacheService
{
    private readonly IDistributedCache _distributedCache;

    public CacheService(IDistributedCache distributedCache)
    {
        _distributedCache = distributedCache;
    }

    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default) where T : class
    {
        string? cachedValue = await _distributedCache.GetStringAsync(key, cancellationToken);

        if (cachedValue == null)
        {
            return null;
        }

        T? value = JsonSerializer.Deserialize<T>(cachedValue);

        return value;
    }

    public async Task<T> GetAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiration = null,
        CancellationToken cancellationToken = default) where T : class
    {
        T? cachedValue = await GetAsync<T>(key, cancellationToken);

        if (cachedValue is not null)
        {
            return cachedValue;
        }

        cachedValue = await factory();

        await SetAsync(key, cachedValue, expiration, cancellationToken);

        return cachedValue;
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null,
        CancellationToken cancellationToken = default) where T : class
    {
        string cacheValue = JsonConvert.SerializeObject(value);

        var options = new DistributedCacheEntryOptions()
        {
            AbsoluteExpirationRelativeToNow = expiration ?? TimeSpan.FromMinutes(2),
        };

        await _distributedCache.SetStringAsync(key, cacheValue, options, cancellationToken);
    }

    public async Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        await _distributedCache.RemoveAsync(key, cancellationToken);
    }
}