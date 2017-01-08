using System.Collections.Generic;
using ReflectiveJs.Server.Model.Common;

namespace ReflectiveJs.Server.Model.UI
{
    public class UiModel : BaseEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<UiField> UiFields { get; set; }
        public virtual ICollection<UiView> Views { get; set; }

        public UiModel()
        {
            UiFields = new List<UiField>();
            Views = new List<UiView>();
        }
    }
}