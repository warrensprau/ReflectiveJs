using System.ComponentModel.DataAnnotations.Schema;
using ReflectiveJs.Server.Model.Common;

namespace ReflectiveJs.Server.Model.UI
{
    public class UiViewField : BaseEntity
    {
        public int Id { get; set; }

        [ForeignKey("UiView")]
        public int UiViewId { get; set; }
        public virtual UiView UiView { get; set; }

        [ForeignKey("UiField")]
        public int UiFieldId { get; set; }
        public virtual UiField UiField { get; set; }

        public string Label { get; set; }
        public int DisplayOrder { get; set; }
        public string DefaultValue { get; set; }

        public string CollectionDetailRoute { get; set; }
        public string CollectionAddAction { get; set; }
        public string CollectionOptionConstraint { get; set; }

        public string ShownIf { get; set; }
        public bool ShowAsTextEditor { get; set; }

        public bool IsExpanded { get; set; }
        public bool IsHidden { get; set; }
        public bool IsReadOnly { get; set; }
    }
}