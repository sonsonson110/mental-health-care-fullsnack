namespace Application;

public class BadRequestException : Exception
{
    public Dictionary<string, string[]>? Errors { get; set; } = null;
    public BadRequestException(string message, IDictionary<string, string[]>? errors) : base(message)
    {
        if (errors != null)
            Errors = new Dictionary<string, string[]>(errors);
    }
}