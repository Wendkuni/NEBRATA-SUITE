
import { Component} from '@angular/core';
import { AppSettingsService } from 'app/config/app.settings.service';
import { Settings } from '@sycadSetting/app.settings.model';

import { Router, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'sycad-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SYCAD Application';
  public settings: Settings;

  constructor(public appSettings:AppSettingsService,private titleService: Title, private router:Router){
      this.settings = this.appSettings.settings;
  }

 ngOnInit() {

  this.titleService.setTitle(this.settings.name);
  this.router.events.subscribe(event => {

    if(event instanceof NavigationStart) {
     //// console.log(" NavigationStart "+event.url)
      setTimeout(() => {
        this.settings.progressBar = true;
      });
    }else if(event instanceof NavigationEnd) {
     //console.log(" NavigationEnd "+event.url)
     setTimeout(() => {
      this.settings.progressBar = false;
    });
    }else if(event instanceof NavigationCancel) {
     //// console.log(" NavigationCancel "+event.url)
     setTimeout(() => {
      this.settings.progressBar = false;
    });
    }else {
      //console.log(" outer.events ",event)
    }




    // NavigationEnd
    // NavigationCancel
    // NavigationError
    // RoutesRecognized
  });


 }



}
