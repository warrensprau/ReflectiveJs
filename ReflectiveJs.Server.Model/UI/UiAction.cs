using ReflectiveJs.Server.Model.Common;

namespace ReflectiveJs.Server.Model.UI
{
    public class UiAction : BaseEntity
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Route { get; set; } //the method to call when it's activated
        public string Command { get; set; }
        public string ActionModel { get; set; }
        public string EntityType { get; set; }
        public bool IsCustom { get; set; }
        public bool IsStandard { get; set; }
    }
}