import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouterModule,
  Routes,
  ActivatedRoute
} from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe();
   }

  ngOnInit() {
  }
}
