using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;
using RentApp.Hubs;
using RentApp.Models.Entities;
using RentApp.Persistance;
using RentApp.Persistance.Repository;
using RentApp.Persistance.UnitOfWork;
using RentApp.Providers;
using System;
using System.Data.Entity;
using Unity;
using Unity.AspNet.Mvc;
using Unity.Injection;

namespace RentApp
{
    /// <summary>
    /// Specifies the Unity configuration for the main container.
    /// </summary>
    public static class UnityConfig
    {
        #region Unity Container
        private static Lazy<IUnityContainer> container =
          new Lazy<IUnityContainer>(() =>
          {
              var container = new UnityContainer();
              RegisterTypes(container);
              return container;
          });

        /// <summary>
        /// Configured Unity Container.
        /// </summary>
        public static IUnityContainer Container => container.Value;
        #endregion

        /// <summary>
        /// Registers the type mappings with the Unity container.
        /// </summary>
        /// <param name="container">The unity container to configure.</param>
        /// <remarks>
        /// There is no need to register concrete types such as controllers or
        /// API controllers (unless you want to change the defaults), as Unity
        /// allows resolving a concrete type even if it was not previously
        /// registered.
        /// </remarks>
        public static void RegisterTypes(IUnityContainer container)
        {
            // NOTE: To load from web.config uncomment the line below.
            // Make sure to add a Unity.Configuration to the using statements.
            // container.LoadConfiguration();

            // TODO: Register your type's mappings here.
            // container.RegisterType<IProductRepository, ProductRepository>();
            container.RegisterType<IAppUserRepository, AppUserRepository>();
            container.RegisterType<IBranchRepository, BranchRepository>();
            container.RegisterType<IRentRepository, RentRepository>();
            container.RegisterType<IServicesRepository, ServicesRepository>();
            container.RegisterType<ITypeOfVehicleRepository, TypeOfVehicleRepository>();
            container.RegisterType<IVehicleRepository, VehicleRepository>();
            container.RegisterType<ICommentRepository, CommentRepository>();
            container.RegisterType<ITransactionRepository, TransactionRepository>();
            container.RegisterType<IUnitOfWork, RADBUnitOfWork>();

            container.RegisterType<DbContext, RADBContext>(new PerRequestLifetimeManager());
            container.RegisterType<ApplicationUserManager>();
            container.RegisterType<ISecureDataFormat<AuthenticationTicket>, CustomJwtFormat>(new InjectionConstructor("http://localhost:51680"));
            container.RegisterType<IUserStore<RAIdentityUser>, UserStore<RAIdentityUser>>(
            new InjectionConstructor(typeof(DbContext)));
            container.RegisterType<NotificationsHub>();
        }
    }
}