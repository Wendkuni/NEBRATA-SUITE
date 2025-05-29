
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {catchError, map} from 'rxjs/operators';

import {of} from 'rxjs';

import { ActionProcessusEvent } from '@sycadApp/libs/model-table';
import { PlanCadastralFusionnementService } from '@sycadApp/services/workflow/common/fusionnement.service';
import { environment } from 'environments/environment';
import { TransitionService } from '@sycadApp/services/workflow/transition.service';
import {
  ProcessusResolver,
  TransitionResolver
} from '@sycadApp/shared/form-components/processus/transition/transition.resolver';
import {EnteteDossierService} from "@sycadApp/services/workflow/entete.service";


@Injectable()
export class PlanCadastralFusionnementResolver implements Resolve<any> {

    constructor( private planCadastralService: PlanCadastralFusionnementService,   private router: Router) {}

    resolve(route: ActivatedRouteSnapshot) {
      const numero = route.paramMap.get('numero');
      let context: ActionProcessusEvent;
      if (this.router.getCurrentNavigation().extras.state) {
        const routeState = this.router.getCurrentNavigation().extras.state;
        if (routeState) {
          context = routeState.context;
        }
      }
      return this.planCadastralService.get(numero).pipe(
        map(res => {
          if (res?.numero) {
            return res;
          }
        }),
        catchError(error => {
          return of(null);
        })
      );
    }
}


@Injectable()
export class PlanCadastralFusionnementTransitionResolver extends TransitionResolver  {

  constructor( public transitionService: TransitionService,   public router: Router) {
    super(transitionService,router)
  }
  getUrl(): string {
    return environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_FUSION;
  }

}

@Injectable()
export class DomaineFusionProcessusResolver extends ProcessusResolver{
  getUrl(): string {
    return  environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_FUSION;
  }
  constructor( public enteteDossierService: EnteteDossierService,   public router: Router) {
    super(enteteDossierService, router, 'WRKFProcessFusionCadastral')
  }
}


