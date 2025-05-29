import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { Settings } from '@sycadApp/config/app.settings.model';
import { AppSettingsService } from '@sycadApp/config/app.settings.service';
import { MenuService } from '@sycadLayout/menu/menu.service';
import { Observable, of } from 'rxjs';

import { Menu } from '@sycadLayout/menu/menu.model';

@Component({
  selector: 'app-horizontal-menu',
  templateUrl: './horizontal-menu.component.html',
  styleUrls: ['./horizontal-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HorizontalMenuComponent implements OnInit {
  @Input('menuParentId') menuParentId;
  public menuItems: any;
  public menuItemsSrc: Observable<Menu[]>;
  public settings: Settings;
  @ViewChild(MatMenuTrigger,{static:true}) trigger: MatMenuTrigger;
  constructor(public appSettings:AppSettingsService, public menuService:MenuService, public router:Router) { 
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.menuItemsSrc=this.menuService.getAppMenu();
   this.menuItemsSrc.subscribe(list => this.menuItems=list.filter(item => item.parentId == this.menuParentId));
  }


  ngAfterViewInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if(this.settings.preference.fixedHeader){
          let mainContent = document.getElementById('main-content');
          if(mainContent){
            mainContent.scrollTop = 0;
          }
        }
        else{
          document.getElementsByClassName('mat-drawer-content')[0].scrollTop = 0;
        }
      }                
    });
  } 

}