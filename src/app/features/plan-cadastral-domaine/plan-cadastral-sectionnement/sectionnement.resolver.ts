
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {catchError, map} from 'rxjs/operators';

import {of} from 'rxjs';

import { ActionProcessusEvent } from '@sycadApp/libs/model-table';
import { PlanCadastralSectionnementService } from '@sycadApp/services/workflow/common/sectionnement-services';
import { TransitionResolver, ProcessusResolver } from '@sycadApp/shared/form-components/processus/transition/transition.resolver';
import { environment } from 'environments/environment';
import { TransitionService } from '@sycadApp/services/workflow/transition.service';

import { EnteteDossierService } from '@sycadApp/services/workflow/entete.service';



@Injectable()
export class PlanCadastralSectionnementResolver implements Resolve<any>{

  constructor( private planCadastralService: PlanCadastralSectionnementService,   private router: Router) {}

  resolve(route: ActivatedRouteSnapshot) {
    const numero = route.paramMap.get("numero");
    let context: ActionProcessusEvent;
   /* if (this.router.getCurrentNavigation().extras.state) {
      let routeState = this.router.getCurrentNavigation().extras.state;
      if (routeState) {
        context=routeState.context;
       }
      } */
    return this.planCadastralService.get(numero).pipe(
      map(res => {
         // // console.log("res",res)
        if(res?.numero) {
            return res;
        }
        location.href = environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_SECTIONNEMENT;
      }),
      catchError(error => {
        //// console.log("error",error)
        location.href = environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_SECTIONNEMENT;
        return of(null)
      })
    );

  }

}




@Injectable()
export class PlanCadastralSectionnementTransitionResolver extends TransitionResolver  {

  getUrl(): string {
    return environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_SECTIONNEMENT;
  }
  constructor( public transitionService: TransitionService,   public router: Router) {
    super(transitionService,router)
  }

}


@Injectable()
export class PlanCadastralSectionnementProcessusResolver extends ProcessusResolver  {

  getUrl(): string {
    return environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_SECTIONNEMENT;
  }
  constructor( public enteteDossierService: EnteteDossierService,   public router: Router) {
    super(enteteDossierService,router,"WRKFProcessSectionnementCadastral")
  }

}  