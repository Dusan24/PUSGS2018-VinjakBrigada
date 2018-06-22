import { Component, OnInit } from '@angular/core';
import { HomeRegularService } from '../services/home-regular.service';
import { Vehicle } from '../models/Vehicle.model';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  vehicles: Vehicle[];
  public word : string;

  constructor(private homeRegularService: HomeRegularService) { }

  ngOnInit() {
    this.callGetVehicle();
  }

  callGetVehicle(){
    this.homeRegularService.getAllVehicles()
    .subscribe(
      data => {
        this.vehicles = data;
      },
      error => {
        console.log(error);
      }
    )

    
  }


  deleteVehicle(del) {
    console.log(del);
    this.homeRegularService.deleteVehicle(del)
    .subscribe(
      data=> {
        alert("You have been successfully delete vehicle!");
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
