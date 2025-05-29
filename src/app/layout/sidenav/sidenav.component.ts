import { Component, OnInit, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { Settings } from '@sycadApp/config/app.settings.model';
import { AppSettingsService } from '@sycadApp/config/app.settings.service';
import { MenuService } from '@sycadLayout/menu/menu.service';
import { Menu } from '@sycadLayout/menu/menu.model';
import { Router } from '@angular/router';
import { ProfileService } from '../profileShowInDash.service';
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';
import { Observable, of } from 'rxjs';
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CompteElement } from '@sycadApp/models/data-references/contribuables/compte.model';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('slideProfile', [
      state('hidden', style({ transform: 'translateX(100%)', opacity: 5 })),
      state('visible', style({ transform: 'translateX(0)', opacity: 1 })),
      transition('hidden => visible', [
        animate('0.5s ease-in', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition('visible => hidden', [
        animate('0.5s 1s ease-out', style({ transform: 'translateX(100%)', opacity: 0 }))
      ]),
    ]),
  ],
})
export class SidenavComponent implements OnInit  {
  
  public userConnected$ : Observable<AuthentificatedUser>;
  public userImage= '../assets/img/users/user.jpg';
  public menuItems:Array<Menu>;
  public settings: Settings;
  logoUrl="";
  isProfileVisible= false;



  
  constructor(public appSettings:AppSettingsService, public menuService:MenuService,private router:Router,private profileService: ProfileService, public authService : AuthenticationService){
      this.settings = this.appSettings.settings
  }

  ngOnInit() {

    this.authService.getMe().subscribe((user) => {
      this.userConnected$ = of(user);
    });
  
     this.profileService.isProfileVisible$.subscribe((visible) => {
      this.isProfileVisible = visible;
    });

    this.menuService.getAppMenu().subscribe(list => this.menuItems=list);
    this.getLogoUrl();
  }

  public logout(){
    this.authService.logout();
  }

 

  getLogoUrl(){
    this.appSettings.getCurrentTheme().subscribe((response) => {


      switch (response.theme) {
        case "green-light":
          this.logoUrl = "assets/img/logo/Plan de travail 4-100.jpg";
          break;

        case "orange-light":
          this.logoUrl = "assets/img/logo/logowbg.png";
          break;

        case "blue-dark":
          this.logoUrl = "assets/img/logo/logowbg.png";
          break;


      }
    });

  }

  home(){
    this.router.navigateByUrl("")
}


  public closeSubMenus(){
    let menu = document.getElementById("vertical-menu");
    if(menu){
      for (let i = 0; i < menu.children[0].children.length; i++) {
        let child = menu.children[0].children[i];
        if(child){
          if(child.children[0].classList.contains('expanded')){
              child.children[0].classList.remove('expanded');
              child.children[1].classList.remove('show');

          }
        }
      }
    }
  }

}
