
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {catchError, map} from 'rxjs/operators';

import {of} from 'rxjs';

import { ActionProcessusEvent } from '@sycadApp/libs/model-table';
import { TransitionResolver, ProcessusResolver } from '@sycadApp/shared/form-components/processus/transition/transition.resolver';
import { environment } from 'environments/environment';
import { TransitionService } from '@sycadApp/services/workflow/transition.service';

import { EnteteDossierService } from '@sycadApp/services/workflow/entete.service';

import { AmenagementService } from '@sycadApp/services/workflow/common/amenagement.service';

@Injectable()
export class PlanCadastralAmenagementResolver implements Resolve<any>{

  constructor(private planCadastralService: AmenagementService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot) {
    const numero = route.paramMap.get("numero");
    let context: ActionProcessusEvent;
    if (this.router.getCurrentNavigation().extras.state) {
      let routeState = this.router.getCurrentNavigation().extras.state;
      if (routeState) {
        context=routeState.context;
      }
    }
    return this.planCadastralService.get(numero).pipe(
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
export class PlanCadastralAmenagementTransitionResolver extends TransitionResolver  {

  constructor( public transitionService: TransitionService,   public router: Router) {
    super(transitionService,router)
  }
  getUrl(): string {
    return environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_FUSION;
  }

}

@Injectable()
export class PlanCadastralAmenagementProcessusResolver extends ProcessusResolver  {

  getUrl(): string {
    return  environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_AMENAGEMENT;;
  }
  constructor( public enteteDossierService: EnteteDossierService,   public router: Router) {
    super(enteteDossierService,router,"WRKFProcessAmenagementCadastral")
  }

}
