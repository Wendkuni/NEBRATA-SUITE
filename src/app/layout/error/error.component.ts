import { Component, OnInit } from '@angular/core';
import { Settings } from '@sycadApp/config/app.settings.model';
import { AppSettingsService } from '@sycadApp/config/app.settings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent  {

  public settings: Settings;
  constructor(public appSettings:AppSettingsService, public router:Router) {
    this.settings = this.appSettings.settings; 
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  ngAfterViewInit(){
    this.settings.loadingSpinner = false;  
  } 

}
