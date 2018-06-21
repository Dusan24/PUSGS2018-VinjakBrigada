namespace RentApp.Migrations
{
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using RentApp.Models.Entities;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Data.Entity.Validation;
    using System.Linq;
    using System.Text;

    internal sealed class Configuration : DbMigrationsConfiguration<RentApp.Persistance.RADBContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

       
        protected override void Seed(RentApp.Persistance.RADBContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //
            if (!context.Roles.Any(r => r.Name == "Admin"))
            {
                var store = new RoleStore<IdentityRole>(context);
                var manager = new RoleManager<IdentityRole>(store);
                var role = new IdentityRole { Name = "Admin" };

                manager.Create(role);
            }

            if (!context.Roles.Any(r => r.Name == "Manager"))
            {
                var store = new RoleStore<IdentityRole>(context);
                var manager = new RoleManager<IdentityRole>(store);
                var role = new IdentityRole { Name = "Manager" };

                manager.Create(role);
            }

            if (!context.Roles.Any(r => r.Name == "AppUser"))
            {
                var store = new RoleStore<IdentityRole>(context);
                var manager = new RoleManager<IdentityRole>(store);
                var role = new IdentityRole { Name = "AppUser" };

                manager.Create(role);
            }

            context.AppUsers.AddOrUpdate(

                  u => u.FullName,

                  new AppUser() { FullName = "Admin Adminovic" }

            );

            context.AppUsers.AddOrUpdate(

                p => p.FullName,

                new AppUser() { FullName = "AppUser AppUserovic", Activated = false, Birthday = DateTime.Today,Email = "gmail",Rents = new System.Collections.Generic.List<Rent>()}
               
            );
  



            //TypeOfVehicle t1 = new TypeOfVehicle();
            //t1.Name = "Karavan";
            //TypeOfVehicle t2 = new TypeOfVehicle();
            //t2.Name = "Kabrio";

            //Vehicle v1 = new Vehicle()
            //{
            //    Manufactor = "Opel",
            //    Model = "Astra",
            //    Type = t1,
            //    Description = "Fin autic",
            //    PricePerHour = 5,
            //    Year = 1998,
            //    Unavailable = false,
            //    Images = new System.Collections.Generic.List<string>()
            //};
            //Vehicle v2 = new Vehicle()
            //{
            //    Manufactor = "Mercedes",
            //    Model = "c220",
            //    Type = t2,
            //    Description = "Solidan autic",
            //    PricePerHour = 8,
            //    Year = 2001,
            //    Unavailable = false,
            //    Images = new System.Collections.Generic.List<string>()
            //};
            //Branch b1 = new Branch()
            //{
            //    Name = "Prva filijala",
            //    Address = "Koste Trifkovica 23",
            //    Latitude = 150.50,
            //    Longitude = 50.50,
            //    Logo = "Logo"
            //};
            //Service s1 = new Service()
            //{
            //    Name = "Prvi Servis",
            //    Description = "Solidan servis za izdavanje",
            //    Email = "prvi@gmail.com",
            //    Logo = "a",
            //    Branches = new System.Collections.Generic.List<Branch>() { b1 },
            //    Vehicles = new System.Collections.Generic.List<Vehicle>()
            //};

            //Service s2 = new Service()
            //{
            //    Name = "Drugi Servis",
            //    Description = "Los servis za izdavanje",
            //    Email = "drugi@gmail.com",
            //    Logo = "b",
            //    Branches = new System.Collections.Generic.List<Branch>() {  },
            //    Vehicles = new System.Collections.Generic.List<Vehicle>()
            //};

            //context.Services.Add(s1);
            //context.TypesOfVehicle.Add(t1);
            //context.TypesOfVehicle.Add(t2);

            //SaveChanges(context);


            var userStore = new UserStore<RAIdentityUser>(context);
            var userManager = new UserManager<RAIdentityUser>(userStore);

            if (!context.Users.Any(u => u.UserName == "admin"))
            {
                var _appUser = context.AppUsers.FirstOrDefault(a => a.FullName == "Admin Adminovic");
                var user = new RAIdentityUser() { Id = "admin", UserName = "admin", Email = "admin@yahoo.com", PasswordHash = RAIdentityUser.HashPassword("Admin-1"), AppUserId = _appUser.Id };
                userManager.Create(user);
                userManager.AddToRole(user.Id, "Admin");
            }

            if (!context.Users.Any(u => u.UserName == "appu"))

            {

                var _appUser = context.AppUsers.FirstOrDefault(a => a.FullName == "AppUser AppUserovic");
                var user = new RAIdentityUser() { Id = "appu", UserName = "appu", Email = "appu@yahoo.com", PasswordHash = RAIdentityUser.HashPassword("appu"), AppUserId = _appUser.Id };
                userManager.Create(user);
                userManager.AddToRole(user.Id, "AppUser");

            }
        }
        private static void SaveChanges(DbContext context)
        {
            try
            {
                context.SaveChanges();
            }
            catch (DbEntityValidationException ex)
            {
                var sb = new StringBuilder();
                foreach (var failure in ex.EntityValidationErrors)
                {
                    sb.AppendFormat("{0} failed validation\n", failure.Entry.Entity.GetType());
                    foreach (var error in failure.ValidationErrors)
                    {
                        sb.AppendFormat("- {0} : {1}", error.PropertyName, error.ErrorMessage);
                        sb.AppendLine();
                    }
                }
                throw new DbEntityValidationException(
                    "Entity Validation Failed - errors follow:\n" +
                    sb.ToString(), ex
                );
            }
        }
    }
}
