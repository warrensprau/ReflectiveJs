using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ReflectiveJs.Server.Model.Common;
using ReflectiveJs.Server.Utility;

namespace ReflectiveJs.Server.Model.Organizational
{
    public class MemberCancel : BaseActionEntity
    {
        [Display(ResourceType = typeof(CommonText), Name = "FieldName_Comment", Order = 10)]
        public string Comment { get; set; }

        [Display(ResourceType = typeof(CommonText), Name = "FieldName_Member", Order = 10)]
        [ForeignKey("Member")]
        public int MemberId { get; set; }
        public virtual Member Member { get; set; }
    }
}