using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ReflectiveJs.Server.Utility;

namespace ReflectiveJs.Server.Model.Common
{
    public abstract class AuditedEntity : BaseEntity, IAuditable
    {
        [Display(ResourceType = typeof(CommonText), Name = "FieldName_Created", Order = 10)]
        public DateTime? Created { get; set; }

        [Display(ResourceType = typeof(CommonText), Name = "FieldName_LastUpdated", Order = 10)]
        public DateTime? LastUpdated { get; set; }

        [Display(ResourceType = typeof(CommonText), Name = "FieldName_CreatedBy", Order = 10)]
        [ForeignKey("CreatedBy")]
        public string CreatedById { get; set; }

        public virtual ApplicationUser CreatedBy { get; set; }

        [Display(ResourceType = typeof(CommonText), Name = "FieldName_LastUpdatedBy", Order = 10)]
        [ForeignKey("LastUpdatedBy")]
        public string LastUpdatedById { get; set; }

        public virtual ApplicationUser LastUpdatedBy { get; set; }
    }
}