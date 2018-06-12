import { Component, OnInit } from '@angular/core';
import { SignUpServiceService } from 'src/app/services/sign-up-service.service';
import { AppUsers } from 'src/app/models/AppUsers.model';
import {NgForm} from '@angular/forms';
import { LogInService } from 'src/app/services/log-in.service';
import { LoginData } from 'src/app/models/logInData';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  providers:[LogInService]
})
export class LoginFormComponent implements OnInit {

  constructor(private logInService: LogInService) { }
  ngOnInit() {
  }

  onSubmit(loginData:LoginData) {

    this.logInService.postLogin(LoginData)
    .subscribe(
      data => {
        alert("Logged in...");
      },
      error => {
        console.log(error);
      })

  }
}
