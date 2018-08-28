import { Component, OnInit } from '@angular/core';
import { Services } from '../models/Services.model';
import { HomeRegularService } from '../services/home-regular.service';

import {Router} from '@angular/router';
import { LoginServiceService } from 'src/app/services/login-service.service';
import { error } from 'util';
import { Users } from 'src/app/models/User.model';
import { AppUsers } from 'src/app/models/AppUsers.model';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  services: Services[];
  selected: number;
  user:AppUsers;
  canPush: boolean;

  pageSize : number = 2;

  public pageNumber:number = 1;

  public br : boolean = true;

  constructor(private homeRegularService: HomeRegularService , private router: Router, private loginServiceService: LoginServiceService) { }

  ngOnInit() {
    //this.callGetServices();
    this.GetServicesPagination();
      /*this.services = [
        { Name : "service1", Logo : "aaaa", Email : "aaa@aaa.aaa", Description : "aaa", Owner : "aaa", Approved : false},
        { Name : "service2", Logo : "aaaa", Email : "aaa@aaa.aaa", Description : "aaa", Owner : "aaa", Approved : false},
        { Name : "service3", Logo : "aaaa", Email : "aaa@aaa.aaa", Description : "aaa", Owner : "aaa", Approved : false},
        { Name : "service4", Logo : "aaaa", Email : "aaa@aaa.aaa", Description : "aaa", Owner : "aaa", Approved : false}
      ];*/
  }

  GetServicesPagination(){
    this.homeRegularService.getMethodVehiclePag(this.pageNumber, this.pageSize)
    .subscribe(
      data => {
        this.services = data;
        this.canNextPage();
      },
      error => {
        debugger
        alert('fail');
      })
  }

  selectChangeHandler(event: any) {
    this.selected = event.target.value;
  }

  gradeService(id){
    this.homeRegularService.gradeService(id, this.selected, localStorage.email)
     .subscribe(
        data => {
          alert("You have succesfully graded service");
          this.GetServicesPagination();
        },
        error => {
          alert(error);
        }
     )
  }

  callGetServices(){
    this.homeRegularService.getAllServices()
    .subscribe(
      data => {
        this.services = data;
      },
      error => {
        alert(error);
      }
    )
  }

  addRent(id:number){
    this.loginServiceService.getUserData(localStorage.email)
    .subscribe(
      data => {
        this.user = data;
        if(this.user.Logo!="" && this.user.Logo!=null){
          this.router.navigateByUrl('/addrent/' + id);
        }
        else{
          alert("U must have image for rent.")
          this.router.navigateByUrl('account');
        }
      },
      error=>{
        console.log(error);
        alert("Fail !");
      });
    
      //this.router.navigateByUrl('/addrent/' + id);
  }

  changeService(id:number){
    this.router.navigateByUrl('/changeService/' + id);
  }
  
  deleteService(del) {
    console.log(del);
    this.homeRegularService.deleteService(del)
    .subscribe(
      data=> {
        alert("You have been successfully delete service!");
        this.GetServicesPagination();
      },
    error=>{
      alert("Fail !");
    })
  }

  isInRole(r: string){
    if(localStorage.getItem('role') == r){
      return true;
    }

    return false;
  }

  setPageNumber(nm:number){
    this.pageNumber = nm;
    if(this.pageNumber == 1){
      this.canPush = false;
    }
    this.ngOnInit();
  }

  incPageNumber(){
    this.canPush = true;
    this.pageNumber += 1;
    this.ngOnInit();
  }

  decPageNumber(){
    if(this.pageNumber > 1){
      this.pageNumber -= 1;
      if(this.pageNumber == 1){
        this.canPush = false;
      }
      this.br = true;
      this.ngOnInit();
    }
    else{
      this.canPush = false;
    }
  }

  canNextPage(){
    if(this.services.length==this.pageSize){
      this.br= true;
    }
    else
    {
      this.br=false;
    }
  }
}
