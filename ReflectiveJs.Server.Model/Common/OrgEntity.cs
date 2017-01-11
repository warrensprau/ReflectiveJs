using System.ComponentModel.DataAnnotations.Schema;
using ReflectiveJs.Server.Model.Organizational;

namespace ReflectiveJs.Server.Model.Common
{
    public abstract class OrgEntity : AuditedEntity, IOwned
    {
        [ForeignKey("Owner")]
        public int OwnerId { get; set; }

        public virtual Org Owner { get; set; }
    }
}