using System.ComponentModel.DataAnnotations;
using ReflectiveJs.Server.Utility;

namespace ReflectiveJs.Server.Model.Common
{
    public class EnumType
    {
        [Key]
        [Display(ResourceType = typeof(CommonText), Name = "FieldName_EnumName", Order = 10)]
        public string Name { get; set; }

        [Display(ResourceType = typeof(CommonText), Name = "FieldName_EnumDescription", Order = 10)]
        public string Description { get; set; }

        public string EnumTypeName { get; set; }
    }
}