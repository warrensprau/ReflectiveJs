using System.ComponentModel.DataAnnotations.Schema;
using ReflectiveJs.Server.Model.Common;

namespace ReflectiveJs.Server.Model.UI
{
    public class UiViewAction : BaseEntity
    {
        public int Id { get; set; }

        [ForeignKey("UiView")]
        public int UiViewId { get; set; }
        public virtual UiView UiView { get; set; }

        [ForeignKey("UiAction")]
        public int UiActionId { get; set; }
        public virtual UiAction UiAction { get; set; }

        public string Directive { get; set; }
        public string DisplayType { get; set; } //button, hyperlink, IMG
        public string Label { get; set; }
        public int DisplayOrder { get; set; }
        public string SuccessRoute { get; set; }
        public string FailureRoute { get; set; }
        public bool StayOpenOnSuccess { get; set; }
        public string ConfirmationMessage { get; set; }
    }
}