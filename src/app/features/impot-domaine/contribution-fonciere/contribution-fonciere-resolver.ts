import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { ActionProcessusEvent } from "@sycadApp/libs/model-table";
import { ContributionFonciereService } from "@sycadApp/services/impot/contribution-fonciere.service";
import { EnteteDossierService } from "@sycadApp/services/workflow/entete.service";
import { TransitionService } from "@sycadApp/services/workflow/transition.service";
import { ProcessusResolver, TransitionResolver } from "@sycadApp/shared/form-components/processus/transition/transition.resolver";
import { environment } from "environments/environment";
import { of } from "rxjs";
import { map, catchError } from "rxjs/operators";

@Injectable()
export class ContribuationFonciereResolver implements Resolve<any>{
    constructor( private contributionFonciereService: ContributionFonciereService,   private router: Router) {}

    resolve(route: ActivatedRouteSnapshot) {
      const numero = route.paramMap.get('numero');
      let context: ActionProcessusEvent;
      if (this.router.getCurrentNavigation().extras.state) {
        const routeState = this.router.getCurrentNavigation().extras.state;
        if (routeState) {
          context = routeState.context;
        }
      }
      return this.contributionFonciereService.get(numero).pipe(
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
export class ContribuationFonciereTransitionResolver extends TransitionResolver{
    constructor( public transitionService: TransitionService,   public router: Router) {
        super(transitionService,router)
      }
      getUrl(): string {
        return environment.FRONTEND_ROUTES.PROCESSUS_CONTRIBUTION_FONCIERE;
      }
      
}


@Injectable()
export class ContribuationFonciereProcessusResolver extends ProcessusResolver  {

  getUrl(): string {
    return  environment.FRONTEND_ROUTES.PROCESSUS_CONTRIBUTION_FONCIERE;;
  }
  constructor( public enteteDossierService: EnteteDossierService,   public router: Router) {
    super(enteteDossierService,router,"WRKFProcessContribuationFonciers")
  }

}
