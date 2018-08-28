import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientXsrfModule } from '@angular/common/http';

import { Router, RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { HashLocationStrategy, LocationStrategy, APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileSelectDirective } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { AddBranchComponent } from './AddBranch/branch.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { AddVehicleComponent } from './AddVehicle/vehicle.component';
import { ClockComponent } from './clock/clock.component';
import { SignalRService } from 'src/app/services/signalR.service';
import { HomeRegularComponent } from './home-regular/home-regular.component';
import { AddTypeOfVehicleComponent } from './add-type-of-vehicle/add-type-of-vehicle.component';
import { OptionServiceComponent } from './option-service/option-service.component';
import { AccountComponent } from './account/account.component';
import { ServiceComponent } from './service/service.component';
import { BranchComponent } from './branch/branch.component';
import { VehicleComponent } from './vehicle/vehicle.component';

import { AgmCoreModule } from '@agm/core';

import {CanActivateViaAuthGuard} from './guard/auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptor';
import { AddRentComponent } from './add-rent/add-rent.component';
import { CommentComponent } from './comment/comment.component';
import { AdminComponent } from './admin/admin.component';
import { ChangeServiceComponent } from './change-service/change-service.component';
import { ChangeBranchComponent } from './change-branch/change-branch.component';

import { NgxPayPalModule } from 'ngx-paypal';

const Routes=[
  {
    path: "",
    component: HomeRegularComponent,
    canActivate: ['CanAlwaysActivateGuard']
  },
  {
    path: "register",
    component: RegisterFormComponent,
    canActivate: ['CanAlwaysActivateGuard']
  },
  {
    path: "login",
    component: LoginFormComponent,
    canActivate: ['CanAlwaysActivateGuard']
  },  
  {
    path: "homeRegular",
    component: HomeRegularComponent,
    canActivate: ['CanAlwaysActivateGuard']
  },
  {
    path: "addService",
    component: AddServiceComponent,
    canActivate: [CanActivateViaAuthGuard]
  },
  {
    path: "addBranch",
    component: AddBranchComponent,
    canActivate: [CanActivateViaAuthGuard]
  },
  {
    path: "addTypeOfVehicle",
    component: AddTypeOfVehicleComponent,
    canActivate: [CanActivateViaAuthGuard]
  },
  {
    path: "addVehicle",
    component: AddVehicleComponent,
    canActivate: [CanActivateViaAuthGuard]
  },
  {
    path: "account",
    component: AccountComponent,
    canActivate: ['CanAppUserActivateGuard']
  },
  {
    path: "services",
    component: ServiceComponent,
    canActivate: ['CanAlwaysActivateGuard']
  } ,
  {
    path: "branch",
    component: BranchComponent,
    canActivate: ['CanAlwaysActivateGuard']
  } ,
  {
    path: "vehicle",
    component: VehicleComponent,
    canActivate: ['CanAlwaysActivateGuard']
  } ,
  {
    path: "addrent/:id",
    component: AddRentComponent,
    canActivate: ['CanAppUserActivateGuard']
  },
  {
    path: "changeService/:id",
    component: ChangeServiceComponent,
    canActivate: [CanActivateViaAuthGuard]
  },
  {
    path: "changeBranch/:id",
    component: ChangeBranchComponent,
    canActivate: [CanActivateViaAuthGuard]
  },
  {
    path: "addComment",
    component: CommentComponent,
    canActivate: ['CanAppUserActivateGuard']
  },
  {
    path: "Adminova",
    component: AdminComponent,
    canActivate: ['CanAppUserActivateGuard']
  }
]

@NgModule({
  declarations: [
    AppComponent,
    AddServiceComponent,
    AddBranchComponent,
    LoginFormComponent,
    NavbarComponent,
    RegisterFormComponent,
    AddVehicleComponent,
    ClockComponent,
    HomeRegularComponent,
    AddTypeOfVehicleComponent,
    OptionServiceComponent,
    FileSelectDirective,
    AccountComponent,
    ServiceComponent,
    BranchComponent,
    VehicleComponent,
    AddRentComponent,
    CommentComponent,
    AdminComponent,
    ChangeServiceComponent,
    ChangeBranchComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    NgxPayPalModule,
    HttpClientModule,
    HttpClientXsrfModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyDnihJyw_34z5S1KZXp90pfTGAqhFszNJk'}),
    RouterModule.forRoot(Routes),
    FormsModule 
  ],
  providers: [CanActivateViaAuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: 'CanAlwaysActivateGuard',
      useValue: () => { 
        return true;
      } 
    },
    {
      provide: 'CanAdminGuard',
      useValue: () => { if(localStorage.role == 'Admin')
        return true;
      } 
    },
    {
      provide: 'CanAppUserActivateGuard',
      useValue: () => { if(localStorage.role !=undefined)
        return true;
      } 
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
