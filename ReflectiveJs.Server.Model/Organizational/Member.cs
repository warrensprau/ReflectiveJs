using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReflectiveJs.Server.Model.Organizational
{
    public class Member
    {
        public Member()
        {
            OrgMembers = new List<OrgMember>();
        }

        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string LoginId { get; set; }

        [ForeignKey("Profile")]
        public int? ProfileId { get; set; }
        public virtual Profile Profile { get; set; }

        public virtual ICollection<OrgMember> OrgMembers { get; set; }
    }
}