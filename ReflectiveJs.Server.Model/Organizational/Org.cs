using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ReflectiveJs.Server.Model.Common;
using ReflectiveJs.Server.Utility;

namespace ReflectiveJs.Server.Model.Organizational
{
    public class Org : AuditedEntity
    {
        public Org()
        {
            Children = new List<Org>();
        }

        public int Id { get; set; }

        [Display(ResourceType = typeof(OrganizationalText), Name = "FieldName_OrgName", Order = 40)]
        public string Name { get; set; }

        [Display(ResourceType = typeof(OrganizationalText), Name = "FieldName_OrgParent", Order = 40)]
        [ForeignKey("Parent")]
        public int? ParentId { get; set; }

        public virtual Org Parent { get; set; }

        [Display(ResourceType = typeof(OrganizationalText), Name = "FieldName_OrgMembers", Order = 40)]
        public virtual ICollection<OrgMember> OrgMembers { get; set; }

        [Display(ResourceType = typeof(OrganizationalText), Name = "FieldName_OrgChildren", Order = 40)]
        public virtual ICollection<Org> Children { get; set; }
    }
}