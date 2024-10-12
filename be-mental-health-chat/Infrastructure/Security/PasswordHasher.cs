using System.Security.Cryptography;
using Domain.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Infrastructure;

public class PasswordHasher: IPasswordHasher
{
    // Configuration for PBKDF2
    private readonly int _saltSize;
    private readonly int _keySize;
    private readonly int _iterations;
    
    public PasswordHasher(IConfiguration configuration)
    {
        _saltSize = configuration.GetValue<int>("PasswordHasher:SaltSize", 16);
        _keySize = configuration.GetValue<int>("PasswordHasher:KeySize", 32);
        _iterations = configuration.GetValue<int>("PasswordHasher:Iterations", 10000);
    }
    
    public string HashPassword(string password)
    {
        // Generate a salt
        using var rng = new RNGCryptoServiceProvider();
        byte[] salt = new byte[_saltSize];
        rng.GetBytes(salt);

        // Hash the password using PBKDF2
        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, _iterations, HashAlgorithmName.SHA256);
        byte[] hash = pbkdf2.GetBytes(_keySize);

        // Combine salt and hash and return as base64 string
        byte[] hashBytes = new byte[_saltSize + _keySize];
        Array.Copy(salt, 0, hashBytes, 0, _saltSize);
        Array.Copy(hash, 0, hashBytes, _saltSize, _keySize);

        return Convert.ToBase64String(hashBytes);
    }

    public bool VerifyPassword(string password, string hashedPassword)
    {
        // Extract salt and hash from stored hash
        byte[] hashBytes = Convert.FromBase64String(hashedPassword);
        byte[] salt = new byte[_saltSize];
        Array.Copy(hashBytes, 0, salt, 0, _saltSize);

        // Hash the provided password with the stored salt
        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, _iterations, HashAlgorithmName.SHA256);
        byte[] hash = pbkdf2.GetBytes(_keySize);

        // Compare the computed hash with the stored hash
        for (int i = 0; i < _keySize; i++)
        {
            if (hashBytes[i + _saltSize] != hash[i])
            {
                return false; // Password does not match
            }
        }

        return true; // Password matches
    }
}