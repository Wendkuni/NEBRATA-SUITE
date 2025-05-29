import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-site-web-externe',
  templateUrl: './site-web-externe.component.html',
  styleUrls: ['./site-web-externe.component.scss']
})
export class SiteWebExterneComponent implements OnInit {

  login_lien= environment.FRONTEND_ROUTES.SYSTEM_LOGIN;
  constructor() { }

  ngOnInit(): void {
  }

}
