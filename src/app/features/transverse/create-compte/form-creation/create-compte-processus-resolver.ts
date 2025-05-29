import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterModule, Routes } from '@angular/router';
import { AppSettingsService } from '@sycadApp/config/app.settings.service';
import { CompteService } from '@sycadApp/services/data-references/contribuables/compte.service';
import { EnteteDossierService } from '@sycadApp/services/workflow/entete.service';
import { ProcessusResolver } from '@sycadApp/shared/form-components/processus/transition/transition.resolver';
import { environment } from 'environments/environment';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { catchError, map, mergeMap, of } from 'rxjs';


@Injectable()
export class CreateCompteProcessusResolver implements Resolve<any> {

 
  constructor( public enteteDossierService: EnteteDossierService,   public router: Router,  public appSettings:AppSettingsService) {
  }
  resolve(route: ActivatedRouteSnapshot) {
     this.appSettings.settings.loadingSpinner=true;
    return this.enteteDossierService.getProcessusPublic("WRKFProcessCreationCompte").pipe(
      map(res => {
        this.appSettings.settings.loadingSpinner=false;
        if(res?.code) {
            return res;
        }

        location.href =  environment.FRONTEND_ROUTES.SITE_EXTERNE;
      }),
      catchError(error => {
        this.appSettings.settings.loadingSpinner=false;
       location.href =  environment.FRONTEND_ROUTES.SITE_EXTERNE;
        return of(null)
      })
    );

  }
}  



@Injectable()
export class SaisieCreationCompteResolver implements Resolve<any> {
  constructor(private service: CompteService,  private router: Router,public reCaptchaV3Service : ReCaptchaV3Service) {}

  resolve(route: ActivatedRouteSnapshot) {
    const numero = route.paramMap.get('numero');
    const token = route.paramMap.get('token');

   return  this.reCaptchaV3Service.execute('submitSaisieFormCreationCompteSycad')
   .pipe(mergeMap((recapchaToken) => {
   
    return this.service.checkTokenDossierSaisie(numero,token,recapchaToken).pipe(
      map(res => {
        if (res?.numero) {
          return res;
        }
       location.href =  environment.FRONTEND_ROUTES.SITE_EXTERNE;
      }),
      catchError(error => {
        location.href =  environment.FRONTEND_ROUTES.SITE_EXTERNE;
        return of(null);
      })
    );

  }));

     
  }

}