using Domain.Common;
using Domain.Enums;

namespace Domain.Entities;

public class PublicSessionFollower : TimestampMarkedEntityBase
{
    public PublicSessionFollowType Type { get; set; }

    public Guid PublicSessionId { get; set; }
    public Guid UserId { get; set; }

    #region navigation properties

    public PublicSession PublicSession { get; set; } = null!;
    public User User { get; set; } = null!;

    #endregion
}