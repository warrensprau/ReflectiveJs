using ReflectiveJs.Server.Model.Common;

namespace ReflectiveJs.Server.Model.Performance
{
    public class GoalType : EnumType
    {
        public const string Chargeback = "Chargeback";
        public const string Order = "Order";
        public const string Return = "Return";
        public const string Revenue = "Revenue";
        public const string Rma = "Rma";
        public const string Subscription = "Subscription";
        public const string SubscriptionCancellation = "SubscriptionCancellation";
    }

    public class BreakdownType : EnumType
    {
        public const string Campaign = "Campaign";
        public const string Currency = "BreakdownType_Currency";
        public const string Market = "BreakdownType_Market";
        public const string Product = "BreakdownType_Product";
        public const string ProductLine = "BreakdownType_ProductLine";
        public const string SalesOutlet = "BreakdownType_SalesOutlet";
        public const string Service = "BreakdownType_Service";
        public const string Unit = "BreakdownType_Unit";
    }

    public class GoalMetricType : EnumType
    {
        public const string Quantity = "GoalMetricType_Quantity";
        public const string PercentageOfActual = "GoalMetricType_PercentageOfActual";
    }

    public class GoalTimePeriodType : EnumType
    {
        public const string Daily = "GoalTimePeriod_Daily";
        public const string Weekly = "GoalTimePeriod_Weekly";
        public const string Monthly = "GoalTimePeriod_Monthly";
        public const string Yearly = "GoalTimePeriod_Yearly";
    }
}