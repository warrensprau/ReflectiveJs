using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ReflectiveJs.Server.Model.Common;

namespace ReflectiveJs.Server.Model.Organizational
{
    public class Profile : OrgEntity
    {
        [Key, ForeignKey("Member")]
        public int Id { get; set; }

        public virtual Member Member { get; set; }

        public string SearchSet { get; set; }

        public string DefaultTimeZone { get; set; }

        public Profile()
        {
            SearchSet = "org,member";
        }
    }
}