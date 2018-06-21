import { Component, OnInit } from '@angular/core';
import { HomeRegularService } from '../services/home-regular.service';
import { Branch } from '../models/Branch.model';

import { MapInfo } from '../models/map-info.model';
import { Marker } from '../models/marker.model';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {

  braches: Branch[];

  mapInfo: MapInfo;
  public lat: number = -1;
  public lgt: number = -1;

  private markers: Marker[] = [];
  private marker: Marker = new Marker(0,0);
  private Tempmarker: Marker = new Marker(0,0);

  constructor(private homeRegularService: HomeRegularService) {
    this.mapInfo = new MapInfo(45.25800424228705, 19.833547029022156, 
      "assets/ftn.png",
      "Novi Sad" , "" , "");
   }

  ngOnInit() {
    this.callGetBranch();
  }

  selectMarker(markerr: Marker){
    this.braches.forEach(obj => {
      if(obj.Latitude == markerr.Lat && obj.Longitude == markerr.Lgt){
        debugger
      }
    })
  }
  
  callGetBranch(){
    this.homeRegularService.getAllBranches()
    .subscribe(
      data => {
        this.braches = data;
        this.braches.forEach(obj => {
          this.marker = new Marker(obj.Latitude, obj.Longitude);
          this.markers.push(this.marker);
        })
      },
      error => {
        console.log(error);
      }
    )


    
    this.braches.forEach(obj => {
      this.marker = new Marker(obj.Latitude, obj.Longitude);
      this.markers.push(this.marker);
    })
  }

  deleteBranch(del) {
    console.log(del);
    this.homeRegularService.deleteBranch(del)
    .subscribe(
      data=> {
        alert("You have been successfully delete branch!");
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
