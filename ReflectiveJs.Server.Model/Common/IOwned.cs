using ReflectiveJs.Server.Model.Organizational;

namespace ReflectiveJs.Server.Model.Common
{
    public interface IOwned
    {
        int OwningOrgId { get; set; }

        Org OwningOrg { get; set; }
    }
}