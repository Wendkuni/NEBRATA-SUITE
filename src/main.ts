
import { enableProdMode, LOCALE_ID } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule,{
  providers: [{provide: LOCALE_ID, useValue: 'fr-BF' }]
}).then(()=>{
  document.querySelector("#loading-html-basic").remove();
  document.querySelector("#loading-html-basic-css").remove();
})
  .catch(err => console.error(err));
