import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Settings } from '@sycadApp/config/app.settings.model';
import { AppSettingsService } from '@sycadApp/config/app.settings.service';
import { MenuService } from '@sycadLayout/menu/menu.service';

@Component({
  selector: 'app-vertical-menu',
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VerticalMenuComponent implements OnInit {
  @Input('menuItems') menuItems;
  @Input('menuParentId') menuParentId;
  @Output() onClickMenuItem:EventEmitter<any> = new EventEmitter<any>();
  private static initCurrentRoute : Boolean = false;
 

  parentMenu:Array<any>;
  public settings: Settings;
  constructor(public appSettings:AppSettingsService, public menuService:MenuService, public router:Router) { 
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {     
    this.parentMenu = this.menuItems.filter(item => item.parentId == this.menuParentId);  
   //// console.log("this.menuItems",this.menuItems)

  }

  isLinkActive(url): boolean {
    const queryParamsIndex = this.router.url.indexOf('?');
    const baseUrl = queryParamsIndex === -1 ? this.router.url : 
    this.router.url.slice(0, queryParamsIndex);
   // return baseUrl === url;

   return (baseUrl.startsWith(url) && url!=="/") || baseUrl === url;
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

   if(!VerticalMenuComponent.initCurrentRoute) {      
    let lastItem=this.menuItems[this.menuItems.length-1];
    let menuItem = document.getElementById('menu-item-'+lastItem.id);
    if(menuItem){
      VerticalMenuComponent.initCurrentRoute= this.menuService.expandActiveSubMenu(this.menuItems);
    }
    }
  }  

  onClick(menuId){
    this.menuService.toggleMenuItem(menuId);
    this.menuService.closeOtherSubMenus(this.menuItems, menuId);
    this.onClickMenuItem.emit(menuId);     
  }

}
