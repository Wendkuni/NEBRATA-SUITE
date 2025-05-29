import { Component, OnInit } from '@angular/core';
import { Settings } from '@sycadApp/config/app.settings.model';
import { AppSettingsService } from '@sycadApp/config/app.settings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})  
export class NotFoundComponent {

  public settings: Settings;
  constructor(public appSettings:AppSettingsService, public router:Router) {
    this.settings = this.appSettings.settings; 
  }

  searchResult(): void {
    this.router.navigate(['/search']);
  }

  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }


}
