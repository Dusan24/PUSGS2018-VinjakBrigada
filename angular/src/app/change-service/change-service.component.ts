import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router'
import { Services } from '../models/Services.model';
import { AddServiceService } from 'src/app/services/add-service.service';
import { FileUploader } from 'ng2-file-upload';

const URL = 'http://localhost:51680/api/Upload/user/PostUserImage';

@Component({
  selector: 'app-change-service',
  templateUrl: './change-service.component.html',
  styleUrls: ['./change-service.component.css']
})
export class ChangeServiceComponent implements OnInit {

  public idServe: any;
  public service: Services;
  nesto:string;

  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'photo'});
  url: string;

  constructor(private addServiceService : AddServiceService , private route: ActivatedRoute, private router: Router) { 
    this.route.params.subscribe(params => this.idServe = params);
    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false;};
    this.uploader.onCompleteItem = (item: any, response: any,status: any, headers: any) => {
        this.url=JSON.parse(response);        
    };
  }

  uploadFile: any;

  handleUpload(data): void{
    if(data && data.response){
      data = JSON.parse(data.response);
      this.uploadFile = data;
    }
  }

  ngOnInit() {
    this.addServiceService.getServiceById(this.idServe)
    .subscribe(
      data =>{
        this.service = data;
      },
        error => {
          //this.service = new Services("ajde","ajde","ajde","ajde","ajde",false);
          //this.nesto = (<HTMLInputElement>document.getElementById('Description')).value = this.service.Description;
          alert(error);
        }
    )
  }

  onSubmit(changedsService: Services){
    debugger
    changedsService.Name = this.service.Name;
    changedsService.Logo=this.url;
    changedsService.Id = +this.idServe.id;
    if(changedsService.Description==""){
      changedsService.Description = this.nesto;
    }
    debugger
    this.addServiceService.ChangeServiceData(changedsService)
    .subscribe(
      data=> {
        alert("You have been successfully change data!");
        this.router.navigate(['/services']);
      },
    error=>{
      console.log(error);
      alert("Fail !");
    })
  }

}
