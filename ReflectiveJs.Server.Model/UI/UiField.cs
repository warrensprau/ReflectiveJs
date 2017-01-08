using System.ComponentModel.DataAnnotations.Schema;
using ReflectiveJs.Server.Model.Common;

namespace ReflectiveJs.Server.Model.UI
{
    public class UiField : BaseEntity
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string InputType { get; set; }
        public bool IsRelationship { get; set; }
        public bool IsEnum { get; set; }
        public string EnumType { get; set; }
        public bool IsCollection { get; set; }
        public bool IsUnused { get; set; }

        [ForeignKey("UiModel")]
        public int UiModelId { get; set; }
        public virtual UiModel UiModel { get; set; }

        public UiField()
        {
        }
    }
}