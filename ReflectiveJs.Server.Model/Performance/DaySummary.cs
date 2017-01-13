using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReflectiveJs.Server.Model.Performance
{
    public class DaySummaryMetric
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        [ForeignKey("GoalType")]
        public string GoalTypeId { get; set; }

        public virtual GoalType GoalType { get; set; }

        public int Total { get; set; }
    }
}