import { Component, OnInit } from '@angular/core';
import { Komentar } from '../models/Comment.model';
import { Services } from '../models/Services.model';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  services : Services[];
  comment : Komentar;
  comments : Komentar[];
  optSearch: string = '';
  selectOptionsU: string = '';

  selectedService : string;
  selectService : any;

  NewComment : Komentar = new Komentar('a','a','a');

  constructor(private commentService: CommentService) { }

  ngOnInit() {
    this.comments = [];
    this.callGetServices();
  }

  GetCommentByServiceId(){
    this.selectService = document.getElementsByName("Services")[0];
    this.selectedService = this.selectService.value;
    
   
        this.commentService.getCommentsByServiceId(this.selectedService)
        .subscribe(
          data => {
            this.comments = data;
          },
          error => {
            console.log(error);
          }
        )
      
  }

  selectSearch(event: any) {
    this.optSearch = event.target.value;
    this.GetCommentByServiceId();
  }

  doSomething(event: any) {
    this.selectOptionsU = event;
  }

  isInRole(r: string){
    if(localStorage.getItem('role') == r){
      return true;
    }

    return false;
  }

  callGetServices(){
    this.commentService.getListOfServers()
    .subscribe(
      data => {
        this.services = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  CommentService() {
    this.NewComment.ServiceName = this.optSearch;
    this.NewComment.UserEmail = localStorage.email;
    this.NewComment.Text = this.selectOptionsU;

    this.commentService.postComments(this.NewComment)
    .subscribe(
      data => {
        alert("You succesfully added comment.");
        this.selectOptionsU = "";
        this.GetCommentByServiceId();
      },
      error =>{
        console.log(error);
      }
    )

  }
}
