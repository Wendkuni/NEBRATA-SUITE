import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Injectable} from '@angular/core';
import { BaremeImpotService } from '@sycadApp/services/impot/bareme-impot.service';
import {catchError, map} from 'rxjs/operators';

import {of} from 'rxjs';
import { environment } from 'environments/environment';
@Injectable()
export class BaremeImpotResolver implements Resolve<any> {
  constructor(public service: BaremeImpotService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get("id");
    return this.service.get(id).pipe(
      map(res => {
        if (res && res.id) {
          return res;
        }
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_BAREME_IMPOT;
      }),
      catchError(error => {
        location.href = environment.FRONTEND_ROUTES.CONFIGURATION_BAREME_IMPOT;
        return of(null)
      })
    );

  }

}
