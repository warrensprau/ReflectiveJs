using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ReflectiveJs.Test.Server.Api
{
    [TestClass]
    public abstract class BaseDbContextTest
    {
        protected ICaller _caller;

        [TestInitialize()]
        public void Initialize()
        {
            AutoMapperConfig.RegisterMappings();

            Database.SetInitializer(new TestDbInitializer(new TestDbSeeder()));

            _caller = TestHelper.ResolveCaller("admin@rustycog.com");
        }

        [TestCleanup()]
        public void Cleanup()
        {
        }
    }
}
