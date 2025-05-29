import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';
import { ActionProcessusEvent } from '@sycadApp/libs/model-table';
import { TransitionResolver, ProcessusResolver } from '@sycadApp/shared/form-components/processus/transition/transition.resolver';
import { environment } from 'environments/environment';
import { TransitionService } from '@sycadApp/services/workflow/transition.service';

import { EnteteDossierService } from '@sycadApp/services/workflow/entete.service';

import { SdAttributionService } from '@sycadApp/services/workflow/sd-attribution.service';
import { SaisieDiffereeAttributionContexteService } from '@sycadApp/services/workflow/saisie-differee-attribution-contexte.service';

@Injectable()
export class AttributionResolver implements Resolve<any>{

  constructor(private attributionService: SdAttributionService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot) {
    const numero = route.paramMap.get("numero");
    let context: ActionProcessusEvent;
    if (this.router.getCurrentNavigation().extras.state) {
      let routeState = this.router.getCurrentNavigation().extras.state;
      if (routeState) {
        context=routeState.context;
      }
    }
    return this.attributionService.get(numero).pipe(
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
export class AttributionTransitionResolver extends TransitionResolver  {

  constructor( public transitionService: TransitionService,   public router: Router) {
    super(transitionService,router)
  }
  getUrl(): string {
    return environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_ATTRIBUTION;
  }

}

@Injectable()
export class AttributionProcessusResolver extends ProcessusResolver  {

  getUrl(): string {
    return environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_ATTRIBUTION;
  }
  constructor( public enteteDossierService: EnteteDossierService,   public router: Router) {
    super(enteteDossierService,router,"WRKFProcessSaisieDiffereeAttribution")
  }

}



@Injectable()
export class AttributionContexteResolver implements Resolve<any>{

  constructor( public saisieDiffereeAttributionContexteService:SaisieDiffereeAttributionContexteService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot) {

    return this.saisieDiffereeAttributionContexteService.recuperer().pipe(
      map(res => {
        //console.log("res",res)
        return res;
      }),
      catchError(error => {
        return of(null)
      })
    );

  }

}
