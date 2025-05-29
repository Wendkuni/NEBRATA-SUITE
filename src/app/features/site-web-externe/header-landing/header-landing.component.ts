import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-header-landing',
  templateUrl: './header-landing.component.html',
  styleUrls: ['./header-landing.component.scss']
})
export class HeaderLandingComponent implements OnInit {
  login_lien= environment.FRONTEND_ROUTES.SYSTEM_LOGIN;
  constructor() { }

  ngOnInit(): void {
  }



}
