import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import { ActionProcessusEvent } from '@sycadApp/libs/model-table';
import { EnteteDossierService } from '@sycadApp/services/workflow/entete.service';
import { MandatsService } from '@sycadApp/services/workflow/mandats.service';
import { TransitionService } from '@sycadApp/services/workflow/transition.service';
import { TransitionResolver, ProcessusResolver } from '@sycadApp/shared/form-components/processus/transition/transition.resolver';
import { environment } from 'environments/environment';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class MandatResolver implements Resolve<any>{
    constructor(private mandatService: MandatsService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot) {
        const numero = route.paramMap.get("numero");
        let context: ActionProcessusEvent;
        if (this.router.getCurrentNavigation().extras.state) {
          let routeState = this.router.getCurrentNavigation().extras.state;
          if (routeState) {
            context=routeState.context;
          }
        }
        return this.mandatService.get(numero).pipe(
          map(res => {
            //console.log("res",res)
            if(res?.numero) {
              return res;
            }
          }),
          catchError(error => {
            return of(null)
          })
        );
    
      }
}
@Injectable()
export class MandatTransitionResolver extends TransitionResolver  {

  constructor( public transitionService: TransitionService,   public router: Router) {
    super(transitionService,router)
  }
  getUrl(): string {
    return environment.FRONTEND_ROUTES.PROCESSUS_MANDAT;
  }

}

@Injectable()
export class MandatProcessusResolver extends ProcessusResolver  {

  getUrl(): string {
    return environment.FRONTEND_ROUTES.PROCESSUS_MANDAT;
  }
  constructor( public enteteDossierService: EnteteDossierService,   public router: Router) {
    super(enteteDossierService,router,"WRKFProcessMandat")
  }

}
