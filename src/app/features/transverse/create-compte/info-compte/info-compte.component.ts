import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-info-compte',
  templateUrl: './info-compte.component.html',
  styleUrls: ['./info-compte.component.scss']
})
export class InfoCompteComponent implements OnInit {
public email: string;
  constructor(public route: ActivatedRoute, public router: Router,) {

    
   }

  ngOnInit(): void {
   this.email= decodeURIComponent(this.route.snapshot.paramMap.get('email')) 
  }

  return (){
    this.router.navigate([`${environment.FRONTEND_ROUTES.SITE_EXTERNE}`]);
  }
}
