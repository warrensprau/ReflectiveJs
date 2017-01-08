using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ReflectiveJs.Server.Model.Common
{
    public abstract class BaseEntity : IValidatableObject
    {
        public bool IsActive { get; set; }

        protected BaseEntity()
        {
            IsActive = true;
        }

        public virtual IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            return null;
        }
    }
}