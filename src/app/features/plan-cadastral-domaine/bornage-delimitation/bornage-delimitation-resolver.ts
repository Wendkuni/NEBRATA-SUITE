import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { ActionProcessusEvent } from "@sycadApp/libs/model-table";
import { BornageDelimitationService } from "@sycadApp/services/bornage/bornage-delimitation.service";
import { EnteteDossierService } from "@sycadApp/services/workflow/entete.service";
import { TransitionService } from "@sycadApp/services/workflow/transition.service";
import { ProcessusResolver, TransitionResolver } from "@sycadApp/shared/form-components/processus/transition/transition.resolver";
import { environment } from "environments/environment";
import { of } from "rxjs";
import { map, catchError } from "rxjs/operators";

@Injectable()
export class BornageDelimitationResolver implements Resolve<any>{
    constructor( private bornageDelimitationService: BornageDelimitationService,   private router: Router) {}

    resolve(route: ActivatedRouteSnapshot) {
      const numero = route.paramMap.get('numero');
      let context: ActionProcessusEvent;
      if (this.router.getCurrentNavigation().extras.state) {
        const routeState = this.router.getCurrentNavigation().extras.state;
        if (routeState) {
          context = routeState.context;
        }
      }
      return this.bornageDelimitationService.get(numero).pipe(
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
export class BornageDelimitationTransitionResolver extends TransitionResolver{
    constructor( public transitionService: TransitionService,   public router: Router) {
        super(transitionService,router)
      }
      getUrl(): string {
        return environment.FRONTEND_ROUTES.PROCESSUS_BORNAGE_DELIMITATION;
      }
      
}


@Injectable()
export class BornageDelimitationProcessusResolver extends ProcessusResolver  {

  getUrl(): string {
    return  environment.FRONTEND_ROUTES.PROCESSUS_BORNAGE_DELIMITATION;;
  }
  constructor( public enteteDossierService: EnteteDossierService,   public router: Router) {
    super(enteteDossierService,router,"WRKFProcessBornageDelimitation")
  }

}
