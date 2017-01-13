using System.ComponentModel.DataAnnotations.Schema;
using ReflectiveJs.Server.Model.Common;
using ReflectiveJs.Server.Model.Organizational;
using ReflectiveJs.Server.Utility;
using ReflectiveJs.Server.Utility.Common;

namespace ReflectiveJs.Server.Model.Performance
{
    public class OrgGoal : OrgEntity
    {
        public int Id { get; set; }

        [NotMapped]
        public string Name => GoalTypeId != null
            ? ResourceHelper.EnumMessage(GoalTypeId, typeof(CommonText)) + " by " +
              ResourceHelper.Message("EntityType.ClientOrg", typeof(CommonText))
            : "New Goal";

        [ForeignKey("GoalType")]
        public string GoalTypeId { get; set; }
        public virtual GoalType GoalType { get; set; }

        [ForeignKey("Org")]
        public int OrgId { get; set; }
        public virtual Org Org { get; set; }

        [ForeignKey("GoalMetricType")]
        public string GoalMetricTypeId { get; set; }
        public virtual GoalMetricType GoalMetricType { get; set; }

        [ForeignKey("GoalTimePeriodType")]
        public string GoalTimePeriodTypeId { get; set; }
        public virtual GoalTimePeriodType GoalTimePeriodType { get; set; }

        public int Target { get; set; }
    }
}