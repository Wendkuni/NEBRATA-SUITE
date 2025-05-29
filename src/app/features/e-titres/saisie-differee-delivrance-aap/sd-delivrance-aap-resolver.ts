import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';
import { ActionProcessusEvent } from '@sycadApp/libs/model-table';
import { TransitionResolver, ProcessusResolver } from '@sycadApp/shared/form-components/processus/transition/transition.resolver';
import { environment } from 'environments/environment';
import { TransitionService } from '@sycadApp/services/workflow/transition.service';

import { EnteteDossierService } from '@sycadApp/services/workflow/entete.service';
import { SdDelivranceAapService } from '@sycadApp/services/workflow/sd-delivrance-aap.service';

@Injectable()
export class SdDelivranceAapResolver implements Resolve<any>{

  constructor(private sdDelivranceAapService: SdDelivranceAapService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot) {
    const numero = route.paramMap.get("numero");
    let context: ActionProcessusEvent;
    if (this.router.getCurrentNavigation().extras.state) {
      let routeState = this.router.getCurrentNavigation().extras.state;
      if (routeState) {
        context=routeState.context;
      }
    }
    return this.sdDelivranceAapService.get(numero).pipe(
      map(res => {
          return res;
      }),
      catchError(error => {
        return of(null)
      })
    );

  }

}



@Injectable()
export class SdDelivranceAapTransitionResolver extends TransitionResolver  {

  constructor( public transitionService: TransitionService,   public router: Router) {
    super(transitionService,router)
  }
  getUrl(): string {
    return environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DELIVRANCE_AAP;
  }

}

@Injectable()
export class SdDelivranceAapProcessusResolver extends ProcessusResolver  {

  getUrl(): string {
    return environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DELIVRANCE_AAP;
  }
  constructor( public enteteDossierService: EnteteDossierService,   public router: Router) {
    super(enteteDossierService,router,"WRKFProcessDelivranceAttestationAttributionParcelle")
  }

}
