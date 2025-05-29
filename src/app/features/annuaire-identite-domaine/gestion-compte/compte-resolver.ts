import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { ActionProcessusEvent } from "@sycadApp/libs/model-table";
import { CompteService } from "@sycadApp/services/data-references/contribuables/compte.service";
import { EnteteDossierService } from "@sycadApp/services/workflow/entete.service";
import { TransitionService } from "@sycadApp/services/workflow/transition.service";
import { ProcessusResolver, TransitionResolver } from "@sycadApp/shared/form-components/processus/transition/transition.resolver";
import { environment } from "environments/environment";
import { map, catchError, of } from "rxjs";

@Injectable()
export class CreationCompteResolver implements Resolve<any> {
  constructor(private service: CompteService,  private router: Router) {}

  resolve(route: ActivatedRouteSnapshot) {
    const numero = route.paramMap.get('numero');
    let context: ActionProcessusEvent;
    if (this.router.getCurrentNavigation().extras.state) {
      const routeState = this.router.getCurrentNavigation().extras.state;
      if (routeState) {
        context = routeState.context;
      }
    }
    return this.service.get(numero).pipe(
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
export class CreationCompteProcessusResolver extends ProcessusResolver  {

  getUrl(): string {
    return  environment.FRONTEND_ROUTES.GESTION_COMPTE;;
  }
  constructor( public enteteDossierService: EnteteDossierService,   public router: Router) {
    super(enteteDossierService,router,"WRKFProcessCreationCompte")
  }

}


@Injectable()
export class CreationCompteTransitionResolver extends TransitionResolver{
    constructor( public transitionService: TransitionService,   public router: Router) {
        super(transitionService,router)
      }
      getUrl(): string {
        return environment.FRONTEND_ROUTES.GESTION_COMPTE;
      }
      
}