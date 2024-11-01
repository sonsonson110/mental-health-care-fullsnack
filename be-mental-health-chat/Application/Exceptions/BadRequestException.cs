namespace Application;

public class BadRequestException : Exception
{
    public Dictionary<string, string[]>? Errors { get; }
    public BadRequestException(string message, IDictionary<string, string[]> errors) : base(message)
    {
            Errors = new Dictionary<string, string[]>(errors);
    }
    
    public BadRequestException(string message) : base(message) {}
}