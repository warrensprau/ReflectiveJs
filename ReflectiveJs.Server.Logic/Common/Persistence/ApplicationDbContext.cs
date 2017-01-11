using System;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Azure.SqlDatabase.ElasticScale.ShardManagement;
using ReflectiveJs.Server.Model.Common;
using ReflectiveJs.Server.Model.Organizational;
using ReflectiveJs.Server.Model.UI;

namespace ReflectiveJs.Server.Logic.Common.Persistence
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        // only used to satisfy signature of EFContextProvider
        public ApplicationDbContext()
        {
        }

        // C'tor to deploy schema and migrations to a new shard 
        public ApplicationDbContext(string connectionString) 
            : base(connectionString) 
        {
        }

        // C'tor for data dependent routing. This call will open a validated connection routed to the proper 
        // shard by the shard map manager. Note that the base class c'tor call will fail for an open connection 
        // if migrations need to be done and SQL credentials are used. This is the reason for the  
        // separation of c'tors into the DDR case (this c'tor) and the internal c'tor for new shards. 
        public ApplicationDbContext(ShardMap shardMap, int shardingKey, string connectionStr) 
            : base(CreateDDRConnection(shardMap, shardingKey, connectionStr), true /* contextOwnsConnection */) 
        {
            //Configuration.ProxyCreationEnabled = false;
            //Configuration.LazyLoadingEnabled = false;
        }

        // Only static methods are allowed in calls into base class c'tors 
        private static DbConnection CreateDDRConnection(ShardMap shardMap, int shardingKey, string connectionStr)
        {
            // No initialization 
            Database.SetInitializer<ApplicationDbContext>(null);

            // Ask shard map to broker a validated connection for the given key 
            SqlConnection conn = shardMap.OpenConnectionForKey<int>(shardingKey, connectionStr, ConnectionOptions.Validate);
            return conn;
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
            modelBuilder.Conventions.Remove<ManyToManyCascadeDeleteConvention>();
        }

        public override int SaveChanges()
        {
            var addedAuditedEntities = ChangeTracker.Entries<IAuditable>()
              .Where(p => p.State == EntityState.Added)
              .Select(p => p.Entity);

            var modifiedAuditedEntities = ChangeTracker.Entries<IAuditable>()
              .Where(p => p.State == EntityState.Modified)
              .Select(p => p.Entity);

            var now = DateTime.UtcNow;

            foreach (var added in addedAuditedEntities)
            {
                added.Created = now;
                added.LastUpdated = now;
            }

            foreach (var modified in modifiedAuditedEntities)
            {
                modified.LastUpdated = now;
            }

            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync()
        {
            var addedAuditedEntities = ChangeTracker.Entries<IAuditable>()
              .Where(p => p.State == EntityState.Added)
              .Select(p => p.Entity);

            var modifiedAuditedEntities = ChangeTracker.Entries<IAuditable>()
              .Where(p => p.State == EntityState.Modified)
              .Select(p => p.Entity);

            var now = DateTime.UtcNow;

            foreach (var added in addedAuditedEntities)
            {
                added.Created = now;
                added.LastUpdated = now;
            }

            foreach (var modified in modifiedAuditedEntities)
            {
                modified.LastUpdated = now;
            }

            return base.SaveChangesAsync();
        }

        public DbSet<Member> Members { get; set; }
        public DbSet<Org> Orgs { get; set; }
        public DbSet<OrgMember> OrgMembers { get; set; }

        // UI

        // Meta

        public DbSet<UiAction> UiActions { get; set; }
        public DbSet<UiField> UiFields { get; set; }
        public DbSet<UiModel> UiModels { get; set; }
        public DbSet<UiView> UiViews { get; set; }
        public DbSet<UiViewAction> UiViewActions { get; set; }
        public DbSet<UiViewField> UiViewFields { get; set; }

        public IDbSet<TEntity> SetOwnable<TEntity>(string currentUserId) where TEntity : OrgEntity
        {
            var visibleOrgs = ModelVisibilityManager.VisibleOrgs(currentUserId, this);
            return new FilteredDbSet<TEntity>(this, entity => visibleOrgs.Contains(entity.OwnerId), null);
        }
    }
}