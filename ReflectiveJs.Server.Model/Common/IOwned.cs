using ReflectiveJs.Server.Model.Organizational;

namespace ReflectiveJs.Server.Model.Common
{
    public interface IOwned
    {
        int OwnerId { get; set; }

        Org Owner { get; set; }
    }
}