
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {catchError, map} from 'rxjs/operators';

import {of} from 'rxjs';

import { ActionProcessusEvent } from '@sycadApp/libs/model-table';
import {ProcessusResolver, TransitionResolver} from '@sycadApp/shared/form-components/processus/transition/transition.resolver';
import { environment } from 'environments/environment';
import { TransitionService } from '@sycadApp/services/workflow/transition.service';
import {EnteteDossierService} from '@sycadApp/services/workflow/entete.service';
import {
  SdSectionnementService
} from "@sycadApp/services/workflow/common/sd-sectionnement.service";



@Injectable()
export class SdSectionnementResolver implements Resolve<any> {

  constructor( private sdSectionnementService: SdSectionnementService,   private router: Router) {}

  resolve(route: ActivatedRouteSnapshot) {
    const numero = route.paramMap.get('numero');
    let context: ActionProcessusEvent;
    if (this.router.getCurrentNavigation().extras.state) {
      const routeState = this.router.getCurrentNavigation().extras.state;
      if (routeState) {
        context = routeState.context;
      }
    }
    return this.sdSectionnementService.get(numero).pipe(
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
export class SdSectionnementTransitionResolver extends TransitionResolver  {

  constructor( public transitionService: TransitionService,   public router: Router) {
    super(transitionService, router);
  }
  getUrl(): string {
    return environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_SECTIONNEMENT;
  }

}

@Injectable()
export class SdSectionnementProcessusResolver extends ProcessusResolver{
  getUrl(): string {
    return  environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_SECTIONNEMENT;
  }
  constructor( public enteteDossierService: EnteteDossierService,   public router: Router) {
    super(enteteDossierService, router, 'WRKFProcessSaisieDiffereeSectionnement');

  }
}

