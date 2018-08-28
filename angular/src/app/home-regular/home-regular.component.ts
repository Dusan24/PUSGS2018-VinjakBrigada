import { Component, OnInit } from '@angular/core';
import { Services } from '../models/Services.model'
import { Branch } from '../models/Branch.model'
import { Vehicle } from '../models/Vehicle.model'
import { HomeRegularService } from 'src/app/services/home-regular.service';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-regular',
  templateUrl: './home-regular.component.html',
  styleUrls: ['./home-regular.component.css'],
  providers: [HomeRegularService]
})
export class HomeRegularComponent implements OnInit {

  services: Services[];
  braches: Branch[];
  vehicles: Vehicle[];

  constructor(private homeRegularService: HomeRegularService, private router :Router) { }

  ngOnInit() {
  }

  Service(){
    this.router.navigate(['/services']);
  }

  Branches(){
    this.router.navigate(['/branch']);
  }

  Vehicles(){
    this.router.navigate(['/vehicle']);
  }
  

}
