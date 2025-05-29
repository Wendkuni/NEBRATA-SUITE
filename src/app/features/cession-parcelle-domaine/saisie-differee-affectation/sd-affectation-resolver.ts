import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';
import { ActionProcessusEvent } from '@sycadApp/libs/model-table';
import { TransitionResolver, ProcessusResolver } from '@sycadApp/shared/form-components/processus/transition/transition.resolver';
import { environment } from 'environments/environment';
import { TransitionService } from '@sycadApp/services/workflow/transition.service';

import { EnteteDossierService } from '@sycadApp/services/workflow/entete.service';

import { SdAffectationService } from '@sycadApp/services/workflow/sd-affectation.service';

@Injectable()
export class AffectationResolver implements Resolve<any>{

  constructor(private affectationService: SdAffectationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot) {
    const numero = route.paramMap.get("numero");
    let context: ActionProcessusEvent;
    if (this.router.getCurrentNavigation().extras.state) {
      let routeState = this.router.getCurrentNavigation().extras.state;
      if (routeState) {
        context=routeState.context;
      }
    }
    return this.affectationService.get(numero).pipe(
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
export class AffectationTransitionResolver extends TransitionResolver  {

  constructor( public transitionService: TransitionService,   public router: Router) {
    super(transitionService,router)
  }
  getUrl(): string {
    return environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_AFFECTATION;
  }

}

@Injectable()
export class AffectationProcessusResolver extends ProcessusResolver  {

  getUrl(): string {
    return environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_AFFECTATION;
  }
  constructor( public enteteDossierService: EnteteDossierService,   public router: Router) {
    super(enteteDossierService,router,"WRKFProcessSaisieDiffereeAffectation")
  }

}
