import { Component, OnInit } from '@angular/core';

import { MapInfo } from '../models/map-info.model';
import { Marker } from '../models/marker.model';
import { Rent } from 'src/app/models/Rent.model';
import { AddRentService } from 'src/app/services/add-rent.service';
import { ActivatedRoute } from '@angular/router'
import { Branch } from 'src/app/models/Branch.model';
import { Vehicle } from 'src/app/models/Vehicle.model';

import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
import { debug } from 'util';

@Component({
  selector: 'app-add-rent',
  templateUrl: './add-rent.component.html',
  styleUrls: ['./add-rent.component.css']
})
export class AddRentComponent implements OnInit {

  rent : Rent;
  public idServe: any;
  braches: Branch[];
  Tempvehicle: Vehicle[];
  vehicle: Vehicle[];

  public payPalConfig?: PayPalConfig;

  someDate: Date;
  someDate2: Date;
  today: Date;

  startDay: any;
  endDay: any;
  difference: number;
  pricePH: number;
  selectedVehicle: string;
  
  mapInfo: MapInfo;
  public lat: number = -1;
  public lgt: number = -1;

  private markers: Marker[] = [];
  private marker: Marker = new Marker(0,0);
  public tempMarker: Marker = new Marker(0, 0);

  constructor(private addRentService: AddRentService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => this.idServe = params);
    this.mapInfo = new MapInfo(45.25800424228705, 19.833547029022156, 
      "assets/ftn.png",
      "Novi Sad" , "" , "");
    }

  ngOnInit() {
    this.callGetBranch();
  }

  callGetBranch(){
    this.addRentService.getAllBranches(this.idServe)
    .subscribe(
      data => {
        this.braches = data;
        if(this.braches!=undefined && this.braches.length > 0){
          this.braches.forEach(obj => {
            this.marker = new Marker(obj.Latitude, obj.Longitude);
            this.markers.push(this.marker);
          })
        }
      },
      error => {
        console.log(error);
      }
    )

    this.addRentService.getAllVehicle(this.idServe)
    .subscribe(
      data => {
        debugger
        this.vehicle = []
        this.Tempvehicle = data;
        if(this.Tempvehicle!=undefined && this.Tempvehicle.length > 0){
          this.Tempvehicle.forEach(obj => {
            if(obj.Unavailable==false){
              this.vehicle.push(obj);
            }
          })
        }
      },
      error => {
        console.log(error);
      }
    )


    
    if(this.braches!=undefined && this.braches.length > 0){
      this.braches.forEach(obj => {
        this.marker = new Marker(obj.Latitude, obj.Longitude);
        this.markers.push(this.marker);
      })
    }
  }

  payWithPayPal(){
    this.startDay = document.getElementsByName("Start")[0];
    this.endDay = document.getElementsByName("End")[0];

    this.today = new Date();
    this.someDate = new Date(this.startDay.value);
    if(this.someDate < this.today){
      alert("You cannot reserve vehicle before today!");
      return;
    }
    else{
      this.someDate = new Date(this.endDay.value);
      if(this.someDate < this.today){
        alert("Your reservation cannot be ended before today!");
        return;
      }
      else{
        this.someDate = new Date(this.startDay.value);
        this.someDate2 = new Date(this.endDay.value);
        if(this.someDate > this.someDate2){
          alert("Reservation cannot be ended before it started!");
          return;
        }
        else if(this.someDate == this.someDate2){
          alert("Reservation cannot be ended at same time when it starts!");
          return;
        }
        else{
          let diffInms : number = Date.parse(this.endDay.value) - Date.parse(this.startDay.value);
          let diffInH : number = diffInms / 1000 / 60 / 60;
          this.difference = diffInH;
      
          let aaa:any = document.getElementsByName("Vehicle")[0];
      
          let aaaa:number = parseInt(aaa.value);
      
          this.vehicle.forEach(element => {
            if(element.Id == aaaa){
              this.pricePH = element.PricePerHour;
            }
          });
      
          this.payPalConfig = new PayPalConfig(PayPalIntegrationType.ClientSideREST, PayPalEnvironment.Sandbox, {
            commit: true,
            client: {
              sandbox: 'AZSmskKm8ruIMMSoKaK-t3dUpJ0LykT7c43YHKjqlZhYu1IQywNRV3Nu2QKBQZlHofcd55cYwd_b15Ub'
            },
            button: {
              label: 'paypal',
            },
            onPaymentComplete: (data, actions) => {
              console.log('OnPaymentComplete');
            },
            onCancel: (data, actions) => {
              console.log('OnCancel');
            },
            onError: (err) => {
              console.log('OnError');
            },
            transactions: [{
              amount: {
                
                currency: 'USD',
                total: this.pricePH * this.difference
              }
            }]
          });
        }
      }
    }
   
  }

  /*callGetVehicle(){
    this.addRentService.getAllVehicle(this.idServe)
    .subscribe(
      data => {
        this.vehicle = data;
      },
      error => {
        console.log(error);
      }
    )
  }*/

  static idBranch: number;

  selectMarker(markerr: Marker){
    debugger
    this.braches.forEach(obj => {
      if(obj.Latitude == markerr.Lat && obj.Longitude == markerr.Lgt){
        this.rent = new Rent(obj.Id);
      }
    })
  }

  onSubmit(rentt:Rent){
    this.today = new Date();
    this.someDate = new Date(rentt.Start);
    if(this.someDate < this.today){
      alert("You cannot reserve vehicle before today!");
      return;
    }
    else{
      this.someDate = new Date(rentt.End);
      if(this.someDate < this.today){
        alert("Your reservation cannot be ended before today!");
        return;
      }
      else{
        this.someDate = new Date(rentt.Start);
        this.someDate2 = new Date(rentt.End);
        if(this.someDate > this.someDate2){
          alert("Reservation cannot be ended before it started!");
          return;
        }
        else if(this.someDate == this.someDate2){
          alert("Reservation cannot be ended at same time when it starts!");
          return;
        }
        else{
          debugger
          this.rent.Start = rentt.Start;
          this.rent.End = rentt.End;
          this.rent.User = localStorage.email;
          this.rent.Vehicle = rentt.Vehicle;
          
          this.addRentService.postRent(this.rent)
          .subscribe(
            data => {
              debugger
              this.vehicle = data;
            },
            error => {
              console.log(error);
            }
          )
        }
      }
    } 
  }
}
