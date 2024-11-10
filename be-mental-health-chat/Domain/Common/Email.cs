namespace Domain.Common;

public class Email
{
    public string To { get; private set; }
    public string Subject { get; private set; }
    public string Body { get; private set; }

    private Email() { }

    public Email(string to, string subject, string body)
    {
        if (string.IsNullOrWhiteSpace(to))
            throw new ArgumentException("Email recipient is required");
            
        To = to;
        Subject = subject;
        Body = body;
    }
}