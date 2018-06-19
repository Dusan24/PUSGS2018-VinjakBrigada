using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using RentApp.Models.Entities;
using RentApp.Persistance;
using RentApp.Persistance.UnitOfWork;
using RentApp.Models;

namespace RentApp.Controllers
{
    public class VehiclesController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;

        public VehiclesController()
        {

        }

        public VehiclesController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public IEnumerable<Vehicle> GetServices()
        {
            return unitOfWork.Vehicles.GetAll();
        }

        // GET: api/Vehicles/5
        [ResponseType(typeof(Vehicle))]
        public IHttpActionResult GetVehicle(int id)
        {
            Vehicle vehicle = unitOfWork.Vehicles.Get(id);
            if (vehicle == null)
            {
                return NotFound();
            }

            return Ok(vehicle);
        }

        // PUT: api/Vehicles/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutVehicle(int id, Vehicle vehicle)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != vehicle.Id)
            {
                return BadRequest();
            }
            
            try
            {
                unitOfWork.Vehicles.Update(vehicle);
                unitOfWork.Complete();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VehicleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Vehicles
        [ResponseType(typeof(Vehicle))]
        public IHttpActionResult PostVehicle(VehicleBindingModel vehicle)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var typeOfVehicles = unitOfWork.TypeOfVehicles.GetAll();
            TypeOfVehicle toV = new TypeOfVehicle();

            foreach (var item in typeOfVehicles)
            {
                if (item.Name == vehicle.TypeOfVehicle)
                {
                    toV = item;
                    break;
                }
            }

            Vehicle vehi = new Vehicle() { Description = vehicle.Description, Images = new List<string>(), Manufactor = vehicle.Manufactor, Model = vehicle.Model, PricePerHour = vehicle.PricePerHour, Unavailable = false, Year = vehicle.Year, Type = toV };

            if (vehicle.Image != "")
                vehi.Images.Add(vehicle.Image);

            toV.Vehicles.Add(vehi);

            var services = unitOfWork.Services.GetAll();
            Service ser = new Service();

            foreach (var item in services)
            {
                if (item.Name == vehicle.ServerName)
                {
                    ser = item;
                    break;
                }
            }

            ser.Vehicles.Add(vehi);

            unitOfWork.Vehicles.Add(vehi);
            unitOfWork.TypeOfVehicles.Update(toV);
            unitOfWork.Services.Update(ser);
            unitOfWork.Complete();

            return CreatedAtRoute("DefaultApi", new { id = vehi.Id }, vehicle);
        }

        // DELETE: api/Vehicles/5
        [ResponseType(typeof(Vehicle))]
        public IHttpActionResult DeleteVehicle(int id)
        {
            var veh = unitOfWork.Vehicles.Get(id);

            if (veh == null)
            {
                return NotFound();
            }

            var listOfUsers = unitOfWork.AppUsers.GetAll();
            var listOfRents = unitOfWork.Rents.GetAll();

            List<Rent> listRentsDelete = new List<Rent>();

            foreach (var r in listOfRents)
            {
                if (r.Branch.Id == veh.Id)
                {
                    if (r.Start <= DateTime.Now && r.End >= DateTime.Now)
                        return BadRequest("Service is in use!");

                    listRentsDelete.Add(r);
                }
            }

            int brojRent = listRentsDelete.Count;

            foreach (var item in listRentsDelete)
            {
                foreach (var item2 in listOfUsers)
                {
                    if (item2.Rents.Contains(item))
                        item2.Rents.Remove(item);
                }
            }

            for (int i = 0; i < brojRent; i++)
            {
                unitOfWork.Rents.Remove(listRentsDelete[i]);
            }

            unitOfWork.Vehicles.Remove(veh);
            unitOfWork.Complete();

            return Ok(veh);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool VehicleExists(int id)
        {
            return unitOfWork.Vehicles.Get(id) != null;
        }
    }
}