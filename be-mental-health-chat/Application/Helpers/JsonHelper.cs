using System.Text.Json;
using System.Text.Json.Serialization;

namespace Application.Helpers;

public static class JsonHelper
{
    /// <summary>
    /// Converts an object to its JSON string representation.
    /// </summary>
    /// <typeparam name="T">The type of the object.</typeparam>
    /// <param name="model">The object to be converted to JSON.</param>
    /// <param name="indented">Specifies whether the JSON output should be indented.</param>
    /// <returns>A JSON string representation of the object.</returns>
    public static string ConvertToJson<T>(T model, bool indented = false)
    {
        try
        {
            var options = new JsonSerializerOptions
            {
                WriteIndented = indented,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            };

            return JsonSerializer.Serialize(model, options);
        }
        catch (Exception ex)
        {
            // Handle or log the exception as needed
            throw new InvalidOperationException("Failed to convert object to JSON.", ex);
        }
    }
    
    /// <summary>
    /// Converts a JSON string back to an object of the specified type.
    /// </summary>
    /// <typeparam name="T">The type of the object to deserialize.</typeparam>
    /// <param name="jsonString">The JSON string to deserialize.</param>
    /// <returns>An object of the specified type.</returns>
    public static T ConvertFromJson<T>(string jsonString)
    {
        try
        {
            return JsonSerializer.Deserialize<T>(jsonString);
        }
        catch (Exception ex)
        {
            // Handle or log the exception as needed
            throw new InvalidOperationException("Failed to deserialize JSON string.", ex);
        }
    }
}