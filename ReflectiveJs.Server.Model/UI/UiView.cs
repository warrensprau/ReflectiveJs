using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using ReflectiveJs.Server.Model.Common;

namespace ReflectiveJs.Server.Model.UI
{
    public class UiView : BaseEntity
    {
        public int Id { get; set; }

        public string Directive { get; set; }
        public bool IsDefault { get; set; }

        [ForeignKey("UiModel")]
        public int UiModelId { get; set; }
        public virtual UiModel UiModel { get; set; }

        [ForeignKey("UiViewMode")]
        public string UiViewModeId { get; set; }
        public virtual UiViewMode UiViewMode { get; set; }

        public virtual ICollection<UiViewField> UiViewFields { get; set; }
        public virtual ICollection<UiViewAction> UiViewActions { get; set; }

        public UiView()
        {
            UiViewFields = new List<UiViewField>();
            UiViewActions = new List<UiViewAction>();
        }
    }

    public class UiViewMode : EnumType
    {
        public const string Create = "UiViewMode_Create";
        public const string Read = "UiViewMode_Read";
        public const string Update = "UiViewMode_Update";
    }
}