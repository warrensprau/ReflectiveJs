using System.ComponentModel.DataAnnotations.Schema;
using ReflectiveJs.Server.Model.Common;

namespace ReflectiveJs.Server.Model.Organizational
{
    public class MemberCancel : BaseActionEntity
    {
        [ForeignKey("Member")]
        public int MemberId { get; set; }

        public virtual Member Member { get; set; }

        public string Comment { get; set; }

        public bool SendNotifications { get; set; }
    }
}