using System.ComponentModel.DataAnnotations.Schema;
using ReflectiveJs.Server.Model.Common;

namespace ReflectiveJs.Server.Model.Organizational
{
    public class OrgMember
    {
        public int Id { get; set; }

        [ForeignKey("Org")]
        public int OrgId { get; set; }

        public virtual Org Org { get; set; }

        [ForeignKey("Associate")]
        public int AssociateId { get; set; }

        public virtual Member Associate { get; set; }

        [ForeignKey("OrgAssociateType")]
        public string OrgAssociateTypeId { get; set; }

        public virtual OrgAssociateType OrgAssociateType { get; set; }
    }

    public class OrgAssociateType : EnumType
    {
        public const string Permanent = "OrgAssociateType_Permanent";
        public const string Temporary = "OrgAssociateType_Temporary";
    }
}