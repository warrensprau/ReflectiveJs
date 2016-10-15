using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ReflectiveJs.Server.Model.Common
{
    public abstract class BaseEntity : IValidatableObject
    {
        public virtual IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            return null;
        }
    }
}