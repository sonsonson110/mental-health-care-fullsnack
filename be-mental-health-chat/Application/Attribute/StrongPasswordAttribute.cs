using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace Application.Attribute;

public class StrongPasswordAttribute : ValidationAttribute
{
    private const int MinLength = 8;

    public StrongPasswordAttribute()
    {
        ErrorMessage = "Password must be at least 8 characters and contain at least one uppercase letter, one number, and one special character.";
    }

    public override bool IsValid(object? value)
    {
        if (value == null)
            return false;

        string password = value.ToString()!;

        // Check minimum length
        if (password.Length < MinLength)
            return false;

        // Check for at least one uppercase letter
        if (!Regex.IsMatch(password, @"[A-Z]"))
            return false;

        // Check for at least one number
        if (!Regex.IsMatch(password, @"[0-9]"))
            return false;

        // Check for at least one special character
        if (!Regex.IsMatch(password, @"[!@#$%^&*(),.?:{}|<>]"))
            return false;

        return true;
    }
}