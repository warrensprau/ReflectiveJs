using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using ReflectiveJs.Server.Model.Common;

namespace ReflectiveJs.Server.Model.Organizational
{
    public class Member : OrgEntity
    {
        public Member()
        {
            OrgMembers = new List<OrgMember>();
        }

        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; }

        public virtual User User { get; set; }


        [ForeignKey("Profile")]
        public int? ProfileId { get; set; }
        public virtual Profile Profile { get; set; }

        public virtual ICollection<OrgMember> OrgMembers { get; set; }
    }
}