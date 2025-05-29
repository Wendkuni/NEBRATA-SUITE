import { Injectable, Inject } from '@angular/core';
import { Settings, Preference } from './app.settings.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable,BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn:"root"
})
export class AppSettingsService {
  public isSettingProvidedByRemote=false;
  public settings: Settings= new Settings();
    public currentTheme=new BehaviorSubject<{ theme: string }>({theme:sessionStorage.getItem("theme")})

  constructor(public http:HttpClient, @Inject('window') window: Window) {
  let DATA;

  try {
    DATA = JSON.parse(window["sycadInitialData"]);
    this.isSettingProvidedByRemote=true;
   } catch(e) {
    DATA = false;
   }
  if(DATA) {
    Object.assign(this.settings,DATA);
  }else {

    let preference = new Preference();
    preference.fixedHeader=true;
    preference.langue="FR";
    preference.menu="vertical";
    preference.menuType="normal";
    preference.rtl=false;
    preference.sidenavIsOpened=true;
    preference.sidenavIsPinned=true;
    preference.theme='green-light';
    this.settings.preference=preference;
  }

  };

    updatePreference(preference : Preference):Observable<Preference> {
    return this.http.patch<Preference>(environment.AUTH.PREFERENCE_API, preference);
    }
    getPreference():Observable<Preference> {
      return this.http.get<Preference>(environment.AUTH.PREFERENCE_API);
      }
      getCurrentTheme() {
        this.currentTheme.next({theme:this.settings.preference.theme});
        return this.currentTheme.asObservable();
      }

      updateBehavior(){
        sessionStorage.setItem("theme",this.settings.preference.theme)
        this.currentTheme.next({theme:this.settings.preference.theme});
      }
  }
