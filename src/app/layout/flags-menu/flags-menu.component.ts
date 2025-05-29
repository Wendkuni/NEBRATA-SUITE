import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppSettingsService } from '../../config/app.settings.service';
import { Settings } from '../../config/app.settings.model';

@Component({
  selector: 'app-flags-menu',
  templateUrl: './flags-menu.component.html',
  styleUrls: ['./flags-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FlagsMenuComponent implements OnInit {

  public settings: Settings;
  constructor(public appSettings:AppSettingsService){
      this.settings = this.appSettings.settings; 
  }

  ngOnInit() {
  }

}
