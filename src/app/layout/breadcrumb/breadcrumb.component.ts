import { Component } from '@angular/core';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, UrlSegment, NavigationEnd } from "@angular/router"; 
import { Title } from '@angular/platform-browser';
import { AppSettingsService } from '../../config/app.settings.service';
import { Settings } from '../../config/app.settings.model';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {

    public pageTitle:string;
    public isActive:boolean=true;
    public breadcrumbs: {
        name: string;
        url: string
    }[] = [];

    public settings: Settings;
    constructor(public appSettings:AppSettingsService,
                public router: Router, 
                public activatedRoute: ActivatedRoute,                
                public title:Title){

                
            this.settings = this.appSettings.settings; 
            this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.breadcrumbs = [];                
                this.parseRoute(this.router.routerState.snapshot.root); 
                this.pageTitle = "";
               
                this.breadcrumbs.forEach(breadcrumb => {
                    this.pageTitle += ' > ' + breadcrumb.name;
                })       
                this.title.setTitle(this.settings.name + this.pageTitle);
            }
        })   
    }

    private parseRoute(node: ActivatedRouteSnapshot) { 
        if (node.data['breadcrumb']) {
            if(node.url.length){
              
                let urlSegments: UrlSegment[] = [];
                node.pathFromRoot.forEach(routerState => {
                    urlSegments = urlSegments.concat(routerState.url);
                });
          
                let url = urlSegments.map(urlSegment => {
                    return urlSegment.path;
                }).join('/');
                let listSectionExxtend = node.data['breadcrumb'].split("/");
                listSectionExxtend.map(sec => {
                    this.breadcrumbs.push({
                        name: sec,
                        url: '/' + url
                    });
                })
                this.isActive=true;
            }         
        }else {
            this.isActive=false;
        }
        if (node.firstChild) {
            this.parseRoute(node.firstChild);
        }
    }

    public closeSubMenus(){
        let menu = document.querySelector(".sidenav-menu-outer");
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
