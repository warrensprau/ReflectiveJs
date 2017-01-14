using ReflectiveJs.Server.Logic.Common.Execution;
using ReflectiveJs.Server.Model.Organizational;

namespace ReflectiveJs.Server.Logic.Domain
{
    public class CancelMember : BaseSyncModelLogic
    {
        private Member _member;
        public int MemberId { get; set; }
        public string Comment { get; set; }
        public bool SendNotifications { get; set; }

        protected override bool BasicValidate()
        {
            _member = DbContext.Members.Find(MemberId);

            if (_member == null)
            {
                AddNonlocalizedError("Member not found.");
                return false;
            }

            return base.BasicValidate();
        }

        protected override void BasicExecute()
        {
            if (SendNotifications)
            {
                //var notifyAccountMembers = new NotifySubscriptionAccountMembers()
                //{
                //    SubscriptionId = SubscriptionId,
                //    MessageTypeId = MessageType.SubscriptionCancelled,
                //    PrimaryOnly = true,
                //    DbContext = DbContext,
                //    Caller = Caller
                //};

                //if (!notifyAccountMembers.Execute())
                //{
                //    AddErrors(notifyAccountMembers.Errors);
                //}
            }

            _member.IsActive = false;
        }
    }
}