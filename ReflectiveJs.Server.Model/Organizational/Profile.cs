using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReflectiveJs.Server.Model.Organizational
{
    public class Profile
    {
        [Key, ForeignKey("Member")]
        public int Id { get; set; }

        public virtual Member Member { get; set; }

        public string DefaultTimeZone { get; set; }
    }
}