import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map, tap,share } from 'rxjs/operators';

import { Menu } from '@sycadLayout/menu/menu.model';

import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { HelperService } from '@sycadApp/services/data-references/system/helper.service';

@Injectable(
  {
    providedIn:"root"
  }
)
export class MenuService extends HelperService{
  private datas :Array<Menu>;
  private observable:Observable<Menu[]>;
  public loading: boolean=true;
  private  API_MENU = environment.APPLICATION.MENU_USER_API;
  constructor(private location:Location,
              private router:Router,private http: HttpClient){
                super();
               } 

   public getAppMenu() : Observable<Menu[]> {

    if(this.datas &&  this.datas.length>0) {
      return of(this.datas);
    }else if(!this.observable) {
      this.observable=this.http.get<Menu[]>(this.API_MENU,{ withCredentials:true }).pipe(
         tap(list => { 
           this.loading=false;
            this.datas=list
        }) ,share(),
          catchError(err => { 
            this.loading=false;
            this.handleError<Menu[]>('getAppMenu', []);
            this.router.navigate(['/error']);
            return of(null)
          }),
         
        );  
       
    }      
     return this.observable;
  }    
    
  private getPathName(url: string):string {
    if(url==null) return null;
     let tab = url.split("?");
   return tab[0];
  }


  public expandActiveSubMenu(menu:Array<Menu>) : Boolean{

    let expanded = false;
      let url = this.location.path();

      let routerLink = this.getPathName(url); // url.substring(1, url.length);
    
      let activeMenuItem = menu.filter(item => {
        return ((routerLink.startsWith(item.routerLink) && item.routerLink!=="/") || (item.routerLink === routerLink));
      });

   
   
      if(activeMenuItem[0]){
        let menuItem = activeMenuItem[0];
        while (menuItem.parentId != 0){  
          let filtered=menu.filter(item => item.id == menuItem.parentId);
          let parentMenuItem = filtered[0];
          menuItem = parentMenuItem;
          expanded= this.toggleMenuItem(menuItem.id);
         
        }
      }
     
      return expanded;
  }

  public toggleMenuItem(menuId):any{
    let menuItem = document.getElementById('menu-item-'+menuId);
    let subMenu = document.getElementById('sub-menu-'+menuId);  



    if(subMenu){
      if(subMenu.classList.contains('show')){
        subMenu.classList.remove('show');
        menuItem.classList.remove('expanded');
      }
      else{
        subMenu.classList.add('show');
        menuItem.classList.add('expanded');
      }    
      return true;  
    }
  }

  public closeOtherSubMenus(menu:Array<Menu>, menuId){
    let currentMenuItem = menu.filter(item => item.id == menuId)[0]; 
    if(currentMenuItem.parentId == 0 && !currentMenuItem.target){
      menu.forEach(item => {
        if(item.id != menuId){
          let subMenu = document.getElementById('sub-menu-'+item.id);
          let menuItem = document.getElementById('menu-item-'+item.id);
          if(subMenu){
            if(subMenu.classList.contains('show')){
              subMenu.classList.remove('show');
              menuItem.classList.remove('expanded');
            }              
          } 
        }
      });
    }
  }
  

}
