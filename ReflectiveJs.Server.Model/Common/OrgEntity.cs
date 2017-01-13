using System.ComponentModel.DataAnnotations.Schema;
using ReflectiveJs.Server.Model.Organizational;

namespace ReflectiveJs.Server.Model.Common
{
    public abstract class OrgEntity : AuditedEntity, IOwned
    {
        [ForeignKey("OwningOrg")]
        public int OwningOrgId { get; set; }

        public virtual Org OwningOrg { get; set; }
    }
}