using System.ComponentModel.DataAnnotations.Schema;
using ReflectiveJs.Server.Model.Organizational;

namespace ReflectiveJs.Server.Model.Common
{
    public abstract class OrgEntity : AuditedEntity
    {
        [ForeignKey("Org")]
        public int OrgId { get; set; }

        public virtual Org Org { get; set; }
    }
}