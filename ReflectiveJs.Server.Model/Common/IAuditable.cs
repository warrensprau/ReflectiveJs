using System;

namespace ReflectiveJs.Server.Model.Common
{
    public interface IAuditable
    {
        string CreatedById { get; set; }
        string LastUpdatedById { get; set; }

        DateTime? Created { get; set; }
        DateTime? LastUpdated { get; set; }

        ApplicationUser CreatedBy { get; set; }
        ApplicationUser LastUpdatedBy { get; set; }
    }
}