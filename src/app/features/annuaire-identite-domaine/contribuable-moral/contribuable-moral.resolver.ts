import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {ContribuableMoralService} from '@sycadApp/services/data-references/contribuables/contribuable-moral-service';
import {catchError, map} from 'rxjs/operators';

import {of} from 'rxjs';
import {Injectable} from '@angular/core';
import { environment } from 'environments/environment';

@Injectable()
export class ContribuableMoralResolver implements  Resolve<any> {

  constructor(private contribuableService: ContribuableMoralService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const guid = route.paramMap.get("guid");
    return this.contribuableService.get(guid).pipe(
      map(res => {
        if(res && res.guid) {
          return res;
        }
        location.href = environment.FRONTEND_ROUTES.CONTRIBUABLE_MORAL;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.CONTRIBUABLE_MORAL;
        return of(null)
      })
    );

  }
}
