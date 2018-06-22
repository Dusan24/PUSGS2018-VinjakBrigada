import { Component, OnInit } from '@angular/core';
import { Services } from '../models/Services.model';
import { HomeRegularService } from '../services/home-regular.service';

import {Router} from '@angular/router';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  services: Services[];
  selected: number;

  constructor(private homeRegularService: HomeRegularService , private router: Router) { }

  ngOnInit() {
    this.callGetServices();
  }

  selectChangeHandler(event: any) {
    this.selected = event.target.value;
  }

  gradeService(id){
    this.homeRegularService.gradeService(id, this.selected, localStorage.email)
     .subscribe(
        data => {
          alert("You have succesfully graded service");
          this.callGetServices();
          //window.location.reload();
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
    this.router.navigateByUrl('/addrent/' + id);
  }
  
  deleteService(del) {
    console.log(del);
    this.homeRegularService.deleteService(del)
    .subscribe(
      data=> {
        alert("You have been successfully delete service!");
      },
    error=>{
      console.log(error);
      alert("Fail !");
    })
  }

  isInRole(r: string){
    if(localStorage.getItem('role') == r){
      return true;
    }

    return false;
  }
}
