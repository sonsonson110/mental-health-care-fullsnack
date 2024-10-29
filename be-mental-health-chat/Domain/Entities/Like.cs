using Domain.Common;

namespace Domain.Entities;

public class Like: EntityBase
{
    public Guid UserId { get; set; }
    public Guid PostId { get; set; }

    #region navigation properties

    public User User { get; set; } = null!;
    public Post Post { get; set; } = null!;

    #endregion
}