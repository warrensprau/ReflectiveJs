using System;

namespace ReflectiveJs.Server.Model.Common
{
    public interface IAuditable
    {
        string CreatedById { get; set; }
        string LastUpdatedById { get; set; }

        DateTime? Created { get; set; }
        DateTime? LastUpdated { get; set; }

        User CreatedBy { get; set; }
        User LastUpdatedBy { get; set; }
    }
}