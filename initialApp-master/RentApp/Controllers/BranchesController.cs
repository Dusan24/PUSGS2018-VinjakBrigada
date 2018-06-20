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
using RentApp.Models;
using System.Threading.Tasks;

namespace RentApp.Controllers
{
    public class BranchesController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;

        public BranchesController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public IEnumerable<Branch> GetBranches()
        {
            return unitOfWork.Branches.GetAll();
        }

        [AllowAnonymous]
        [Route("api/Branches/ReturnBranchesByServer")]
        [HttpGet]
        public List<Branch> ReturnBranchesByServer(int model)
        {
            var service = unitOfWork.Services.Get(model);
            List<Branch> lista = new List<Branch>();

            foreach (var item in service.Branches)
            {
                lista.Add(item);
            }

            return lista;
        }

        [ResponseType(typeof(Branch))]
        public IHttpActionResult GetBranch(int id)
        {
            Branch branch = unitOfWork.Branches.Get(id);
            if (branch == null)
            {
                return NotFound();
            }

            return Ok(branch);
        }

        [ResponseType(typeof(void))]
        public IHttpActionResult PutBranch(int id, Branch branch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != branch.Id)
            {
                return BadRequest();
            }

            try
            {
                unitOfWork.Branches.Update(branch);
                unitOfWork.Complete();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BranchExists(id))
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

        [ResponseType(typeof(Branch))]
        public IHttpActionResult PostBranch(BranchBindingModel branch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Branch bra = new Branch() { Address = branch.Adress, Latitude = branch.Latitude, Logo = branch.Logo, Longitude = branch.Longitude };
            var services = unitOfWork.Services.GetAll();
            Service service = new Service();

            foreach (var item in services)
            {
                if (item.Name == branch.ServerName)
                {
                    service = item;
                    break;
                }
            }

            service.Branches.Add(bra);

            unitOfWork.Branches.Add(bra);
            unitOfWork.Services.Update(service);
            unitOfWork.Complete();

            return CreatedAtRoute("DefaultApi", new { id = bra.Id }, branch);
        }

        [ResponseType(typeof(Branch))]
        public IHttpActionResult DeleteBranch(int id)
        {
            var bra = unitOfWork.Branches.Get(id);

            if (bra == null)
            {
                return NotFound();
            }

            var listOfUsers = unitOfWork.AppUsers.GetAll();
            var listOfRents = unitOfWork.Rents.GetAll();

            List<Rent> listRentsDelete = new List<Rent>();

            foreach (var r in listOfRents)
            {
                if (r.Branch.Id == bra.Id)
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

            unitOfWork.Branches.Remove(bra);
            unitOfWork.Complete();

            return Ok(bra);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BranchExists(int id)
        {
            return unitOfWork.Branches.Get(id) != null;
        }
    }
}