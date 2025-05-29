import {
  ActivatedRouteSnapshot,
  Resolve,
  Router
} from '@angular/router';
import {PlanCadastralMorcellementService} from '@sycadApp/services/workflow/common/morcellement.service';
import {Injectable} from '@angular/core';
import {ActionProcessusEvent} from '@sycadApp/libs/model-table';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';
import {
  ProcessusResolver,
  TransitionResolver
} from '@sycadShared/form-components/processus/transition/transition.resolver';
import {TransitionService} from '@sycadApp/services/workflow/transition.service';
import {environment} from '../../../../environments/environment';
import {EnteteDossierService} from '@sycadApp/services/workflow/entete.service';
@Injectable()
export class DomaineMorcellementResolver implements Resolve<any>{
  constructor(private morcellementService: PlanCadastralMorcellementService,
              private router: Router ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const numero = route.paramMap.get('numero');
    let context: ActionProcessusEvent;
    if (this.router.getCurrentNavigation().extras.state) {
      const routeState = this.router.getCurrentNavigation().extras.state;
      if (routeState) {
        context = routeState.context;
      }
    }
    return this.morcellementService.get(numero).pipe(
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
export class DomaineMorcellementTransitionResolver extends TransitionResolver{
  constructor( public transitionService: TransitionService,   public router: Router) {
    super(transitionService, router)
  }
  getUrl(): string {
    return environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MORCELLEMENT;
  }
}

@Injectable()
export class DomaineMorcellementProcessusResolver extends ProcessusResolver{
  getUrl(): string {
    return  environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MORCELLEMENT;
  }
  constructor( public enteteDossierService: EnteteDossierService,   public router: Router) {
    super(enteteDossierService,router,"WRKFProcessMorcellementCadastral")
  }
}
