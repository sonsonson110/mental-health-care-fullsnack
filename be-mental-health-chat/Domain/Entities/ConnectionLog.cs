using System.ComponentModel.DataAnnotations;
using Domain.Common;

namespace Domain.Entities;

public class ConnectionLog: TimestampMarkedEntityBase
{
    [MaxLength(300)]
    public string? UserAgent { get; set; }
    [MaxLength(50)]
    public required string ConnectionId { get; set; }
    public bool IsConnected { get; set; }
    [MaxLength(19)]
    public string? IpAddress { get; set; }
    public Guid UserId { get; set; }

    #region navigation properties

    public User User { get; set; } = null!;

    #endregion
}