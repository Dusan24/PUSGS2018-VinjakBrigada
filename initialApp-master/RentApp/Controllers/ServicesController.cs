﻿using System;
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
using System.Web;
using System.IO;

namespace RentApp.Controllers
{
    public class ServicesController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;

        public ServicesController()
        {

        }

        public ServicesController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public IEnumerable<Service> GetServices()
        {
            return unitOfWork.Services.GetAll();
        }

        // GET: api/Services/5
        [ResponseType(typeof(Service))]
        public IHttpActionResult GetService(int id)
        {
            Service service = unitOfWork.Services.Get(id);
            if (service == null)
            {
                return NotFound();
            }

            return Ok(service);
        }

        // PUT: api/Services/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutService(int id, Service service)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != service.Id)
            {
                return BadRequest();
            }

            try
            {
                unitOfWork.Services.Update(service);
                unitOfWork.Complete();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceExists(id))
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

        // POST: api/Services
        [ResponseType(typeof(Service))]
        public IHttpActionResult PostService(Service service)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.Services.Add(service);
            unitOfWork.Complete();

            return CreatedAtRoute("DefaultApi", new { id = service.Id }, service);
        }

           [AllowAnonymous]
           [Route("api/Services/Grade")]
           [HttpGet]
           public void Grade(int id, int grade)
            {
                var service = unitOfWork.Services.Get(id);

                double ocena = service.Grade;

                ocena += grade;

                if (service.Grade == 0)
                    ocena = grade;
                else
                    ocena /= 2;

                service.Grade = ocena;

                unitOfWork.Services.Update(service);
                unitOfWork.Complete();
            }


        [HttpPost]
        [Route("UploadImage")]
        public HttpResponseMessage UploadImage()
        {
            string imageName = null;
            var httpRequest = HttpContext.Current.Request;
            var postedFile = httpRequest.Files["Image"];

            imageName = new string(Path.GetFileNameWithoutExtension(postedFile.FileName).Take(10).ToArray()).Replace(" ", "-");
            imageName = imageName + DateTime.Now.ToString("yymmssfff");

            var filePath = HttpContext.Current.Server.MapPath("~/Images/" + imageName);

            postedFile.SaveAs(filePath);

            Service ser = new Service() { Name = httpRequest["Name"], Email = httpRequest["Email"], Logo = imageName, Description = httpRequest["Description"], Branches = new List<Branch>(), Vehicles = new List<Vehicle>() };

            unitOfWork.Services.Add(ser);
            unitOfWork.Complete();

            return Request.CreateResponse(HttpStatusCode.Created);
        }

        // DELETE: api/Services/5
        [ResponseType(typeof(Service))]
        public IHttpActionResult DeleteService(int id)
        {
            var ser = unitOfWork.Services.Get(id);

            if (ser == null)
            {
                return NotFound();
            }

            var listOfUsers = unitOfWork.AppUsers.GetAll();
            var listOfRents = unitOfWork.Rents.GetAll();
            var listOfBranches = ser.Branches;
            int brojBranches = listOfBranches.Count();
            var listOfVehicles = ser.Vehicles;
            int brojVehicles = listOfVehicles.Count();

            List<Rent> listRentsDelete = new List<Rent>();

            foreach (var b in listOfBranches)
            {
                foreach (var r in listOfRents)
                {
                    if (r.Branch.Id == b.Id)
                    {
                        if (r.Start <= DateTime.Now && r.End >= DateTime.Now)
                            return BadRequest("Service is in use!");

                        listRentsDelete.Add(r);
                    }
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

            for (int i = 0; i < brojBranches; i++)
            {
                unitOfWork.Branches.Remove(listOfBranches[0]);
            }

            for (int i = 0; i < brojVehicles; i++)
            {
                unitOfWork.Vehicles.Remove(listOfVehicles[0]);
            }

            unitOfWork.Services.Remove(ser);
            unitOfWork.Complete();

            return Ok(ser);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ServiceExists(int id)
        {
            return unitOfWork.Services.Get(id) != null;
        }
    }
}