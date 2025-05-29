import { Component, OnInit, ViewChild, ViewChildren, QueryList, HostListener} from '@angular/core';
import { Settings } from '@sycadSetting/app.settings.model';
import { AppSettingsService } from '@sycadSetting/app.settings.service';
import { Router, NavigationEnd } from '@angular/router';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { MenuButtonAnimation } from '@sycadApp/themes/utils/app-animation';
import { MenuService } from '@sycadLayout/menu/menu.service';
import { AuthenticationService } from '@sycadApp/features/transverse/login/authentication.service';
import { RemoteDataServiceService } from '@sycadApp/features/dashboard-domaine/global-info/live-users/remote-data-service.service';
import { BehaviorSubject } from 'rxjs';
import { ProfileService } from '../profileShowInDash.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-pages',
  templateUrl: './sketch-page.component.html',
  styleUrls: ['./sketch-page.component.scss'],
  providers: [  ],
  animations: [
    MenuButtonAnimation
   
  ],

})
export class SketchPageComponent implements OnInit {
  @ViewChild('sidenav') public sidenav:any;
  @ViewChild('options') sidenavsetting:any;
  @ViewChild('backToTop') backToTop:any;
  @ViewChildren(PerfectScrollbarDirective) pss: QueryList<PerfectScrollbarDirective>;
  public settings:Settings;
  public menus = ['vertical', 'horizontal'];
  public menuOption:string;
  public menuStyles = ['normal', 'compact', 'mini'];
  public menuTypeOption:string;
  public isStickyMenu:boolean = false;
  public lastScrollTop:number = 0;
  public showBackToTop:boolean = false;
  public isVerticalMenuOpened:boolean = true;
  public isHorizontalMenuOpened: boolean = true;
  public toggleSearchBar:boolean = false;
  private defaultMenu:string; //declared for return default menu when window resized


  constructor(public appSettings:AppSettingsService, public router:Router, private menuService: MenuService,private authenticationService: AuthenticationService,public remoteDataService: RemoteDataServiceService, private profileService: ProfileService){
    this.settings = this.appSettings.settings;
  }


  ngOnInit() {


    if(window.innerWidth <= 768){
      this.settings.preference.menu = 'vertical';
      this.settings.preference.sidenavIsOpened = false;
      this.settings.preference.sidenavIsPinned = false;
    }
    this.menuOption = this.settings.preference.menu;
    this.menuTypeOption = this.settings.preference.menuType;
    this.defaultMenu = this.settings.preference.menu;


  }
  ngAfterViewInit(){
    //setTimeout(() => { this.settings.loadingSpinner = false }, 150);


    this.backToTop.nativeElement.style.display = 'none';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if(!this.settings.preference.sidenavIsPinned){
          this.sidenav.close();
        }
        if(window.innerWidth <= 768){
          this.sidenav.close();
        }
      }
    });
    if(!this.appSettings.isSettingProvidedByRemote) {
      this.appSettings.getPreference().subscribe(preferenceRemote => {
        this.settings.preference=preferenceRemote;
        this.appSettings.updateBehavior();
       })
    }
  }


  public updatePreference(){
   this.appSettings.updatePreference(this.settings.preference).subscribe(preferenceSaved => {
    this.settings.preference=preferenceSaved;
   })
  }
  private showProfileSource = new BehaviorSubject<boolean>(false);
  showProfile$ = this.showProfileSource.asObservable();

  toggleProfile() {
    this.showProfileSource.next(true);
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
 //   this.subscription.unsubscribe();
}
  public chooseMenu(){
    this.settings.preference.menu = this.menuOption;
    this.defaultMenu = this.menuOption;
    this.router.navigate(['/']);
    this.updatePreference();
  }

  public chooseMenuType(){
    this.settings.preference.menuType = this.menuTypeOption;
    this.updatePreference();
  }

  public changeTheme(theme){
    this.settings.preference.theme = theme;
    this.updatePreference();
    this.appSettings.updateBehavior();
  }

  public toggleSidenav(){
    this.sidenav.toggle();
    this.isVerticalMenuOpened=!this.isVerticalMenuOpened;
  }

  onToggleProfile() {
    this.profileService.toggleProfile();
  }

 
  public onPsScrollY(event){
    (event.target.scrollTop > 300) ? this.backToTop.nativeElement.style.display = 'flex' : this.backToTop.nativeElement.style.display = 'none';
    if(this.settings.preference.menu == 'horizontal'){
      if(this.settings.preference.fixedHeader){
        var currentScrollTop = (event.target.scrollTop > 56) ? event.target.scrollTop : 0;
        (currentScrollTop > this.lastScrollTop) ? this.isStickyMenu = true : this.isStickyMenu = false;
        this.lastScrollTop = currentScrollTop;
      }
      else{
        (event.target.scrollTop > 56) ? this.isStickyMenu = true : this.isStickyMenu = false;
      }
    }
  }

  public scrollToTop() {
    this.pss.forEach(ps => {
      if(ps.elementRef.nativeElement.id == 'main' || ps.elementRef.nativeElement.id == 'main-content'){
        ps.scrollToTop(0,250);
      }
    });
  }


  @HostListener('window:resize')
  public onWindowResize():void {
    if(window.innerWidth <= 768){
      this.settings.preference.sidenavIsOpened = false;
      this.settings.preference.sidenavIsPinned = false;
      this.settings.preference.menu = 'vertical'
    }
    else{
      (this.defaultMenu == 'horizontal') ? this.settings.preference.menu = 'horizontal' : this.settings.preference.menu = 'vertical'
      this.settings.preference.sidenavIsOpened = true;
      this.settings.preference.sidenavIsPinned = true;
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
