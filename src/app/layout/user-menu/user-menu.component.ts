import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';

import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserMenuComponent implements OnInit {
  public userConnected$ : Observable<AuthentificatedUser>;

  
  @Output("openSettingsEvent") clickSettings = new EventEmitter();
  constructor(public authService : AuthenticationService) { 


  } 
  
  ngOnInit() {

    this.authService.getMe().subscribe(ob => {
      if(ob){
        this.userConnected$=of(ob);
      }
   
    });

  }

  public openSettings = ()=> {
    this.clickSettings.emit();
  }

  public logout(){
    this.authService.logout();
  }

}
