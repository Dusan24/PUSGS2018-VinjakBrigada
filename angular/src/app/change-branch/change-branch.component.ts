import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddBranchService } from '../services/add-branch.service';
import { Branch } from '../models/Branch.model';
import { MapInfo } from '../models/map-info.model';
import { Marker } from '../models/marker.model';
import { FileUploader } from 'ng2-file-upload';

const URL = 'http://localhost:51680/api/Upload/user/PostBranchImage';

@Component({
  selector: 'app-change-branch',
  templateUrl: './change-branch.component.html',
  styleUrls: ['./change-branch.component.css']
})
export class ChangeBranchComponent implements OnInit {

  public idBranch: any;
  branch : Branch;

  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'photo'});
  url: string;

  mapInfo: MapInfo;
  public lat: number = -1;
  public lgt: number = -1;

  private markers: Marker[] = [];
  private marker: Marker = new Marker(0,0);
  public tempMarker: Marker = new Marker(0, 0);

  constructor(private addBranchService : AddBranchService, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => this.idBranch = params);

    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false;};
    this.uploader.onCompleteItem = (item: any, response: any,status: any, headers: any) => {
        this.url=JSON.parse(response);  
    };

    this.mapInfo = new MapInfo(45.25800424228705, 19.833547029022156, 
      "assets/ftn.png",
      "Novi Sad" , "" , "");
   }

   uploadFile: any;

  ngOnInit() {
    debugger
    this.addBranchService.getBranchById(this.idBranch)
    .subscribe(
      data =>{
        debugger
        this.branch = data;
      },
        error => {
          //this.branch = new Branch("logo","add", 45.24930344822965, 19.833547029022156, "1", 1);
          //this.tempMarker = new Marker(this.branch.Latitude, this.branch.Longitude);
          alert(error);
        }
    )
  }

  placeMarker($event){
    this.tempMarker.Lat = $event.coords.lat;
    this.tempMarker.Lgt = $event.coords.lng;
    this.lat = $event.coords.lat;
    this.lgt = $event.coords.lng;
  }

  onSubmit(changedBranch:Branch){
    changedBranch.Logo=this.url;
    debugger
    if(changedBranch.Latitude==-1){
      changedBranch.Latitude = this.branch.Latitude;
      changedBranch.Longitude = this.branch.Longitude;
    }

    changedBranch.Id = this.branch.Id;

    this.addBranchService.changeBranchData(changedBranch)
    .subscribe(
      data=> {
        alert("You have been successfully add branch!");
        this.router.navigate(['/branch']);
      },
    error=>{
      console.log(error);
      alert("Fail !");
    })
  }

  handleUpload(data): void{
    if(data && data.response){
      data = JSON.parse(data.response);
      this.uploadFile = data;
    }
  }
}
