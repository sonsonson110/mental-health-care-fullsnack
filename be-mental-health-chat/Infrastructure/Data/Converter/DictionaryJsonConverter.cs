using System.Text.Json;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.Data.Converter;

public class DictionaryJsonConverter: ValueConverter<Dictionary<string, string>, string>
{
    public static ValueComparer<Dictionary<string, string>> Comparer => 
        new ValueComparer<Dictionary<string, string>>(
            (d1, d2) => d1.SequenceEqual(d2),
            d => d.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
            d => d.ToDictionary(x => x.Key, x => x.Value)
        );

    public DictionaryJsonConverter() 
        : base(
            v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
            v => JsonSerializer.Deserialize<Dictionary<string, string>>(v, (JsonSerializerOptions)null))
    {
    }
}